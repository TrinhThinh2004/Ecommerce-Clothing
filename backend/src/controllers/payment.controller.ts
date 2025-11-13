import { Request, Response } from "express";
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from "vnpay";
import Order from "../models/Order";

// Helper: Normalize IP address (IPv6 -> IPv4)
const normalizeIp = (ip?: string | null): string => {
  if (!ip) return "127.0.0.1";
  let addr = ip.split(",")[0].trim();
  if (addr === "::1" || addr === "::ffff:127.0.0.1") return "127.0.0.1";
  if (addr.startsWith("::ffff:")) addr = addr.replace("::ffff:", "");
  return addr;
};

// Helper: Generate unique payment ID
const generatePayID = (): string => {
  const now = new Date();
  const timestamp = now.getTime();
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const milliseconds = now.getMilliseconds().toString().padStart(3, "0");
  return `PAY${timestamp}${seconds}${milliseconds}`;
};

export const createVnpayUrl = async (req: Request, res: Response) => {
  try {
    const { amount, orderId } = req.body;
    
    // Validation
    if (!amount || !orderId) {
      return res.status(400).json({ 
        success: false,
        message: "Thiếu thông tin amount hoặc orderId" 
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: "Số tiền không hợp lệ" 
      });
    }

    // Kiểm tra đơn hàng có tồn tại không
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy đơn hàng" 
      });
    }

    const vnp_TmnCode = process.env.VNP_TMN_CODE;
    const vnp_HashSecret = process.env.VNP_HASH_SECRET;
    const vnp_ReturnUrl = process.env.VNP_RETURN_URL;

    // Validate env vars
    if (!vnp_TmnCode || !vnp_HashSecret || !vnp_ReturnUrl) {
      console.error("❌ Missing VNPay config:", {
        VNP_TMN_CODE: !!vnp_TmnCode,
        VNP_HASH_SECRET: !!vnp_HashSecret,
        VNP_RETURN_URL: !!vnp_ReturnUrl,
      });
      return res.status(500).json({ 
        success: false,
        message: "Cấu hình VNPay chưa đầy đủ. Vui lòng liên hệ quản trị viên." 
      });
    }

    // Lấy IP address
    const ipAddr = normalizeIp(
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress
    );

    // Khởi tạo VNPay instance
    const vnpay = new VNPay({
      tmnCode: vnp_TmnCode,
      secureSecret: vnp_HashSecret,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      loggerFn: ignoreLogger,
    });

    // Tính ngày hết hạn (24h sau)
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);

    // Tạo payment reference với orderId và unique ID
    const vnp_TxnRef = `${orderId}_${generatePayID()}`;

    // Build payment URL
    const vnpayResponse = vnpay.buildPaymentUrl({
      vnp_Amount: Math.round(amount * 100), // VNPay yêu cầu số tiền nhân 100
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(expireDate),
    });

    console.log("✅ VNPay URL created:", {
      orderId,
      amount,
      vnp_TxnRef,
      ipAddr,
      returnUrl: vnp_ReturnUrl,
    });

    // buildPaymentUrl trả về object có property url hoặc string
    const paymentUrl = typeof vnpayResponse === "string" 
      ? vnpayResponse 
      : (vnpayResponse as any).url || vnpayResponse;

    return res.json({ 
      success: true,
      paymentUrl 
    });

  } catch (err) {
    console.error("❌ Error creating VNPAY URL:", err);
    return res.status(500).json({ 
      success: false,
      message: "Lỗi tạo URL thanh toán",
      error: err instanceof Error ? err.message : "Unknown error" 
    });
  }
};

// Handle VNPay return
export const vnpayReturn = async (req: Request, res: Response) => {
  const vnp_HashSecret = process.env.VNP_HASH_SECRET;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  
  if (!vnp_HashSecret) {
    console.error("❌ Missing VNP_HASH_SECRET");
    return res.redirect(`${frontendUrl}/payment-result?status=error&message=Config%20error`);
  }

  try {
    // Khởi tạo VNPay instance để verify
    const vnpay = new VNPay({
      tmnCode: process.env.VNP_TMN_CODE!,
      secureSecret: vnp_HashSecret,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      loggerFn: ignoreLogger,
    });

    // Verify payment response
    const verifyResult = vnpay.verifyReturnUrl(req.query as any);

    const vnp_TxnRef = req.query.vnp_TxnRef as string;
    const responseCode = req.query.vnp_ResponseCode as string;
    const transactionStatus = req.query.vnp_TransactionStatus as string;

    // Extract orderId from vnp_TxnRef (format: orderId_PAY...)
    const orderId = vnp_TxnRef?.split("_")[0] || "";

    // Kiểm tra verify result (có thể là boolean hoặc object)
    const isValid = typeof verifyResult === "boolean" 
      ? verifyResult 
      : (verifyResult as any).isValid !== false;

    console.log("📥 VNPay return:", {
      orderId,
      vnp_TxnRef,
      responseCode,
      transactionStatus,
      isValid,
    });

    if (!isValid) {
      console.error("❌ Invalid signature");
      return res.redirect(`${frontendUrl}/payment-result?status=failed&message=Invalid%20signature`);
    }

    if (responseCode === "00" && transactionStatus === "00") {
      // Cập nhật trạng thái thanh toán trong database
      await Order.update(
        { payment_status: "paid" },
        { where: { order_id: parseInt(orderId) } }
      );
      
      console.log("✅ Payment success for order:", orderId);
      return res.redirect(`${frontendUrl}/payment-result?status=success&orderId=${orderId}`);
    } else {
      // Cập nhật trạng thái thanh toán thất bại
      await Order.update(
        { payment_status: "failed" },
        { where: { order_id: parseInt(orderId) } }
      );
      
      console.log("❌ Payment failed:", responseCode);
      return res.redirect(`${frontendUrl}/payment-result?status=failed&orderId=${orderId}&code=${responseCode}`);
    }
  } catch (err) {
    console.error("❌ Error processing VNPay return:", err);
    return res.redirect(`${frontendUrl}/payment-result?status=error&message=Processing%20error`);
  }
};

export const vnpayIpn = async (req: Request, res: Response) => {
  const vnp_HashSecret = process.env.VNP_HASH_SECRET;
  
  if (!vnp_HashSecret) {
    return res.status(200).json({ RspCode: "99", Message: "Config error" });
  }

  try {
    // Khởi tạo VNPay instance để verify
    const vnpay = new VNPay({
      tmnCode: process.env.VNP_TMN_CODE!,
      secureSecret: vnp_HashSecret,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      loggerFn: ignoreLogger,
    });

    // Verify IPN
    const verifyResult = vnpay.verifyIpnCall(req.query as any);

    const vnp_TxnRef = req.query.vnp_TxnRef as string;
    const responseCode = req.query.vnp_ResponseCode as string;
    const transactionStatus = req.query.vnp_TransactionStatus as string;

    // Extract orderId from vnp_TxnRef (format: orderId_PAY...)
    const orderId = vnp_TxnRef?.split("_")[0] || "";

    // Kiểm tra verify result (có thể là boolean hoặc object)
    const isValid = typeof verifyResult === "boolean" 
      ? verifyResult 
      : (verifyResult as any).isValid !== false;

    console.log("📥 VNPay IPN:", {
      orderId,
      vnp_TxnRef,
      responseCode,
      transactionStatus,
      isValid,
    });

    if (!isValid) {
      console.error("❌ IPN CHECKSUM FAILED");
      return res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
    }

    // Cập nhật trạng thái thanh toán trong database
    if (responseCode === "00" && transactionStatus === "00") {
      await Order.update(
        { payment_status: "paid" },
        { where: { order_id: parseInt(orderId) } }
      );
      console.log("✅ IPN VALID – Đã cập nhật payment_status = 'paid' cho đơn:", orderId);
    } else {
      await Order.update(
        { payment_status: "failed" },
        { where: { order_id: parseInt(orderId) } }
      );
      console.log("❌ IPN – Thanh toán thất bại cho đơn:", orderId);
    }

    return res.status(200).json({ RspCode: "00", Message: "Success" });
  } catch (err) {
    console.error("❌ Error processing VNPay IPN:", err);
    return res.status(200).json({ RspCode: "99", Message: "Processing error" });
  }
};