import { Request, Response } from "express";
import crypto from "crypto";
import moment from "moment";
import querystring from "qs";

/* ===============================
   TẠO URL THANH TOÁN VNPAY
=================================*/
export const createVnpayUrl = (req: Request, res: Response) => {
  try {
    const { amount, orderId } = req.body;
    
    // Validate input
    if (!amount || !orderId) {
      return res.status(400).json({ message: "Thiếu thông tin amount hoặc orderId" });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Số tiền không hợp lệ" });
    }

    const ipAddr =
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    const vnp_TmnCode = process.env.VNP_TMN_CODE;
    const vnp_HashSecret = process.env.VNP_HASH_SECRET;
    const vnp_Url = process.env.VNP_URL;
    const vnp_ReturnUrl = process.env.VNP_RETURN_URL;

    // Validate environment variables
    if (!vnp_TmnCode || !vnp_HashSecret || !vnp_Url || !vnp_ReturnUrl) {
      console.error("❌ Missing VNPay environment variables:", {
        hasTmnCode: !!vnp_TmnCode,
        hasHashSecret: !!vnp_HashSecret,
        hasUrl: !!vnp_Url,
        hasReturnUrl: !!vnp_ReturnUrl,
      });
      return res.status(500).json({ message: "Cấu hình VNPay chưa đầy đủ" });
    }

    const date = moment().format("YYYYMMDDHHmmss");

    let vnp_Params: Record<string, string | number> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnp_TmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: date,
    };

    // Sắp xếp key để tạo chuỗi ký
    vnp_Params = Object.keys(vnp_Params)
      .sort()
      .reduce((obj: any, key) => {
        obj[key] = vnp_Params[key];
        return obj;
      }, {});

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const paymentUrl = `${vnp_Url}?${signData}&vnp_SecureHash=${signed}`;

    // Log for debugging (remove sensitive data in production)
    console.log("✅ VNPay URL created:", {
      orderId,
      amount: amount * 100,
      vnp_TxnRef: vnp_Params.vnp_TxnRef,
      hasSecureHash: !!signed,
    });

    return res.json({ paymentUrl });
  } catch (err) {
    console.error("❌ Error creating VNPAY URL:", err);
    res.status(500).json({ message: "Lỗi tạo URL thanh toán", error: err instanceof Error ? err.message : "Unknown error" });
  }
};

/*XỬ LÝ CALLBACK (IPN)*/
export const vnpayIpn = (req: Request, res: Response) => {
  const vnp_HashSecret = process.env.VNP_HASH_SECRET!;
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params["vnp_SecureHash"] as string;

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((obj: any, key) => {
      obj[key] = vnp_Params[key];
      return obj;
    }, {});

  const signData = querystring.stringify(sortedParams, { encode: false });
  const signed = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  if (secureHash === signed) {
    // ✅ Thành công — cập nhật trạng thái đơn hàng tại đây
    console.log("✅ IPN hợp lệ cho đơn:", vnp_Params["vnp_TxnRef"]);
    res.status(200).json({ RspCode: "00", Message: "Success" });
  } else {
    console.log("❌ Checksum sai, IPN không hợp lệ");
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
};

/*XỬ LÝ RETURN URL (Sau khi thanh toán)*/
export const vnpayReturn = (req: Request, res: Response) => {
  const vnp_HashSecret = process.env.VNP_HASH_SECRET!;
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params["vnp_SecureHash"] as string;

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((obj: any, key) => {
      obj[key] = vnp_Params[key];
      return obj;
    }, {});

  const signData = querystring.stringify(sortedParams, { encode: false });
  const signed = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  const orderId = vnp_Params["vnp_TxnRef"] as string;
  const responseCode = vnp_Params["vnp_ResponseCode"] as string;
  const transactionStatus = vnp_Params["vnp_TransactionStatus"] as string;

  // Kiểm tra chữ ký
  if (secureHash !== signed) {
    console.log("❌ Checksum sai, return URL không hợp lệ");
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/thanh-toan?status=failed&message=Checksum failed`);
  }

  // Kiểm tra kết quả thanh toán
  // ResponseCode = "00" và TransactionStatus = "00" nghĩa là thanh toán thành công
  if (responseCode === "00" && transactionStatus === "00") {
    console.log("✅ Thanh toán thành công cho đơn:", orderId);
    // TODO: Cập nhật trạng thái đơn hàng trong database tại đây
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/thanh-toan?status=success&orderId=${orderId}`);
  } else {
    console.log("❌ Thanh toán thất bại cho đơn:", orderId, "ResponseCode:", responseCode);
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/thanh-toan?status=failed&orderId=${orderId}&code=${responseCode}`);
  }
};