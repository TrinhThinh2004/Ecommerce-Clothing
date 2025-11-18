/**
 * @fileoverview Controller để xử lý tích hợp cổng thanh toán VNPay.
 * File này quản lý toàn bộ vòng đời của một giao dịch VNPay:
 * 1. Tạo URL thanh toán (`createVnpayUrl`).
 * 2. Xử lý việc VNPay trả về phía client sau khi thanh toán (`vnpayReturn`).
 * 3. Xử lý thông báo thanh toán tức thời (IPN) từ server VNPay (`vnpayIpn`).
 */

import { Request, Response } from "express";
import { VNPay, VnpLocale, ProductCode, dateFormat, ignoreLogger } from "vnpay";
import Order from "../models/Order";

// --- Các hàm hỗ trợ ---

/**
 * Chuẩn hóa địa chỉ IP từ request, xử lý các trường hợp proxy và localhost.
 */
const normalizeIp = (ip?: string | null): string => {
  if (!ip) return "127.0.0.1";
  let addr = ip.split(",")[0].trim();
  if (addr === "::1" || addr === "::ffff:127.0.0.1") return "127.0.0.1";
  if (addr.startsWith("::ffff:")) addr = addr.replace("::ffff:", "");
  return addr;
};

// --- Controllers ---

/**
 * Tạo một URL thanh toán VNPay cho một đơn hàng cụ thể.
 * @route POST /api/payment/create
 */
export const createVnpayUrl = async (req: Request, res: Response) => {
  try {
    const { amount, orderId } = req.body;

    // 1. Kiểm tra dữ liệu đầu vào
    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu các tham số bắt buộc: amount hoặc orderId.",
      });
    }

    // 2. Kiểm tra đơn hàng
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng.",
      });
    }
    if (order.payment_status === "paid") {
      return res.status(409).json({
        success: false,
        message: "Đơn hàng này đã được thanh toán.",
      });
    }

    // 3. Lấy cấu hình
    const { VNP_TMN_CODE, VNP_HASH_SECRET, VNP_RETURN_URL } = process.env;
    if (!VNP_TMN_CODE || !VNP_HASH_SECRET || !VNP_RETURN_URL) {
      console.error("❌ Cấu hình VNPay bị thiếu trong tệp .env.");
      return res.status(500).json({
        success: false,
        message: "Lỗi cấu hình phía máy chủ.",
      });
    }

    const vnpay = new VNPay({
      tmnCode: VNP_TMN_CODE,
      secureSecret: VNP_HASH_SECRET,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      loggerFn: ignoreLogger,
    });

    // 4. Chuẩn bị các tham số thanh toán
    const createDate = new Date();
    const expireDate = new Date(createDate.getTime() + 15 * 60 * 1000); 
    const vnp_TxnRef = `${orderId}_${dateFormat(createDate, 'HHmmss')}`;

    // 5. Xây dựng URL thanh toán
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: normalizeIp(req.headers["x-forwarded-for"] as string || req.socket.remoteAddress),
      vnp_TxnRef,
      vnp_OrderInfo: `Thanh toan cho don hang #${orderId}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: VNP_RETURN_URL,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(createDate, 'yyyyMMddHHmmss'),
      vnp_ExpireDate: dateFormat(expireDate, 'yyyyMMddHHmmss'),
    });

    console.log("✅ Đã tạo URL VNPay thành công:", vnp_TxnRef);
    return res.json({ success: true, paymentUrl });

  } catch (err) {
    console.error("❌ Lỗi khi tạo URL VNPay:", err);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi không mong muốn khi tạo URL thanh toán.",
      error: (err as Error).message,
    });
  }
};

/**
 * Xử lý việc VNPay trả về sau khi người dùng hoàn tất thanh toán.
 * ✅ QUAN TRỌNG: Hàm này phải CẬP NHẬT DATABASE
 * @route GET /api/payment/vnpay_return
 */
export const vnpayReturn = async (req: Request, res: Response) => {
  const { FRONTEND_URL, VNP_HASH_SECRET, VNP_TMN_CODE } = process.env;
  
  try {
    console.log("📨 VNPay Return - Đã nhận query params:", JSON.stringify(req.query, null, 2));
    
    // 1. Khởi tạo VNPay để verify
    const vnpay = new VNPay({ 
      tmnCode: VNP_TMN_CODE!, 
      secureSecret: VNP_HASH_SECRET!, 
      loggerFn: ignoreLogger 
    });
    
    // 2. Verify chữ ký
    const isValid = vnpay.verifyIpnCall(req.query as any);
    console.log("🔐 Checksum verification:", isValid ? "✅ Valid" : "❌ Invalid");

    if (!isValid) {
      console.error("❌ VNPay Return - Chữ ký không hợp lệ.");
      return res.redirect(`${FRONTEND_URL}/payment-result?status=failed&error=invalid_checksum`);
    }

    // 3. Parse transaction info
    const { vnp_TxnRef, vnp_TransactionStatus, vnp_ResponseCode, vnp_Amount } = req.query;
    const orderId = parseInt((vnp_TxnRef as string).split("_")[0], 10);

    console.log("📋 Transaction details:", {
      vnp_TxnRef,
      vnp_TransactionStatus,
      vnp_ResponseCode,
      orderId
    });

    // 4. ✅ QUAN TRỌNG: Tìm đơn hàng và cập nhật trạng thái
    const order = await Order.findByPk(orderId);
    if (!order) {
      console.error("❌ VNPay Return - Không tìm thấy đơn hàng:", orderId);
      return res.redirect(`${FRONTEND_URL}/payment-result?status=failed&error=order_not_found&orderId=${orderId}`);
    }

    console.log(`📦 Found order ${orderId}, current payment_status: ${order.payment_status}`);

    // 5. ✅ CẬP NHẬT DATABASE dựa trên kết quả thanh toán
    if (vnp_TransactionStatus === "00" && vnp_ResponseCode === "00") {
      // ✅ Payment thành công
      const [affectedCount] = await Order.update(
        { payment_status: "paid" },
        { where: { order_id: orderId } }
      );
      
      console.log(`✅ VNPay Return - Đã cập nhật đơn hàng ${orderId} thành 'paid' (affected: ${affectedCount})`);
      
      // Verify update
      const updatedOrder = await Order.findByPk(orderId);
      console.log(`✅ Xác nhận payment_status sau khi update: ${updatedOrder?.payment_status}`);
      
      const redirectUrl = `${FRONTEND_URL}/payment-result?status=paid&orderId=${orderId}&amount=${vnp_Amount}&txnRef=${vnp_TxnRef}`;
      return res.redirect(redirectUrl);
    } else {
      // ❌ Payment thất bại
      const [affectedCount] = await Order.update(
        { payment_status: "failed" },
        { where: { order_id: orderId } }
      );
      
      console.log(`❌ VNPay Return - Đã cập nhật đơn hàng ${orderId} thành 'failed' (affected: ${affectedCount})`);
      
      const redirectUrl = `${FRONTEND_URL}/payment-result?status=failed&orderId=${orderId}&responseCode=${vnp_ResponseCode}`;
      return res.redirect(redirectUrl);
    }
  } catch (err) {
    console.error("❌ Lỗi nghiêm trọng trong vnpayReturn:", err);
    return res.redirect(`${FRONTEND_URL}/payment-result?status=error&error=server_error`);
  }
};

/**
 * Xử lý thông báo thanh toán tức thời (IPN) từ server của VNPay.
 * @route GET /api/payment/vnpay_ipn
 */
export const vnpayIpn = async (req: Request, res: Response) => {
  const { VNP_HASH_SECRET, VNP_TMN_CODE } = process.env;
  try {
    console.log("🔔 VNPay IPN - Đã nhận thông báo:", JSON.stringify(req.query, null, 2));

    const vnpay = new VNPay({ 
      tmnCode: VNP_TMN_CODE!,
      secureSecret: VNP_HASH_SECRET!, 
      loggerFn: ignoreLogger 
    });
    
    const isValid = vnpay.verifyIpnCall(req.query as any);
    console.log("🔐 IPN verification:", isValid ? "✅ Valid" : "❌ Invalid");

    if (!isValid) {
      console.error("❌ IPN - Chữ ký không hợp lệ.");
      return res.status(200).json({ RspCode: "97", Message: "Invalid Checksum" });
    }

    const { vnp_TxnRef, vnp_TransactionStatus, vnp_ResponseCode } = req.query;
    const orderId = parseInt((vnp_TxnRef as string).split("_")[0], 10);
    
    console.log("📋 IPN details:", {
      vnp_TxnRef,
      vnp_TransactionStatus,
      vnp_ResponseCode,
      orderId
    });

    const order = await Order.findByPk(orderId);
    if (!order) {
      console.error("❌ IPN - Không tìm thấy đơn hàng:", orderId);
      return res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }

    console.log(`📦 IPN - Found order ${orderId}, current payment_status: ${order.payment_status}`);

    // Nếu đã paid rồi thì không cần update nữa
    if (order.payment_status === "paid") {
      console.log(`ℹ️ IPN - Đơn hàng ${orderId} đã được thanh toán. Ghi nhận thành công.`);
      return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
    }
    
    // Cập nhật trạng thái
    if (vnp_TransactionStatus === "00" && vnp_ResponseCode === "00") {
      const [affectedCount] = await Order.update(
        { payment_status: "paid" },
        { where: { order_id: orderId } }
      );
      console.log(`✅ IPN - Đã cập nhật trạng thái đơn hàng ${orderId} thành 'paid' (affected: ${affectedCount})`);
    } else {
      const [affectedCount] = await Order.update(
        { payment_status: "failed" },
        { where: { order_id: orderId } }
      );
      console.log(`❌ IPN - Đã cập nhật trạng thái đơn hàng ${orderId} thành 'failed' (affected: ${affectedCount})`);
    }

    return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });

  } catch (err) {
    console.error("❌ Lỗi nghiêm trọng khi xử lý VNPay IPN:", err);
    return res.status(200).json({ RspCode: "99", Message: "Unknown error" });
  }
};