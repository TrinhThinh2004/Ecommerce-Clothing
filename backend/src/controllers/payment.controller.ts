import { Request, Response } from "express";
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from "vnpay";
import * as crypto from "crypto";
import Order from "../models/Order";

// Helper: Normalize IP address
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

/**
 * Create VNPay payment URL
 * POST /api/payment/create
 */
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

    // Check if order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Không tìm thấy đơn hàng" 
      });
    }

    // Get environment variables
    const vnp_TmnCode = process.env.VNP_TMN_CODE!;
    const vnp_HashSecret = process.env.VNP_HASH_SECRET!;
    const vnp_ReturnUrl = process.env.VNP_RETURN_URL!;

    // Initialize VNPay
    const ipAddr = normalizeIp(
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress
    );

    const vnpay = new VNPay({
      tmnCode: vnp_TmnCode,
      secureSecret: vnp_HashSecret,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      loggerFn: ignoreLogger,
    });

    // Set expiration date (24 hours)
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);

    // Generate transaction reference
    const vnp_TxnRef = `${orderId}_${generatePayID()}`;

    // Build payment URL
    const vnpayResponse = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(expireDate),
    });

    const paymentUrl = 
      typeof vnpayResponse === "string" 
        ? vnpayResponse 
        : (vnpayResponse as any).url || vnpayResponse;

    console.log("✅ VNPay URL created successfully:", vnp_TxnRef);

    return res.json({ success: true, paymentUrl });
  } catch (err) {
    console.error("❌ Error creating VNPay URL:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Lỗi tạo URL thanh toán", 
      error: (err as Error).message 
    });
  }
};

/**
 * VNPay return callback
 * GET /api/payment/vnpay-return
 */
export const vnpayReturn = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    const VNPAY_SECRET = process.env.VNP_HASH_SECRET!;
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

    console.log("📨 VNPay Return - Received query params");

    // Verify checksum
    const vnpParams: any = { ...query };
    const secureHash = vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    const sortedKeys = Object.keys(vnpParams).sort();
    const signData = sortedKeys.map((key) => `${key}=${vnpParams[key]}`).join("&");

    const hmac = crypto.createHmac("sha512", VNPAY_SECRET);
    const checkSum = hmac.update(signData, "utf8").digest("hex");

    // Invalid checksum
    if (checkSum !== secureHash) {
      console.error("❌ Invalid checksum from VNPay");
      const redirectUrl = `${FRONTEND_URL}/payment-result?status=failed&error=invalid_checksum`;
      return res.redirect(redirectUrl);
    }

    // Parse transaction info
    const txnRef = query.vnp_TxnRef as string;
    const vnpTransactionStatus = query.vnp_TransactionStatus as string;
    const vnpResponseCode = query.vnp_ResponseCode as string;
    const amountParam = query.vnp_Amount as string;

    // Extract order ID
    const orderId = parseInt(txnRef.split("_")[0], 10);
    if (!orderId || isNaN(orderId)) {
      console.error("❌ Invalid orderId from txnRef:", txnRef);
      const redirectUrl = `${FRONTEND_URL}/payment-result?status=failed&error=invalid_order_id`;
      return res.redirect(redirectUrl);
    }

    // Check if order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      console.error("❌ Order not found:", orderId);
      const redirectUrl = `${FRONTEND_URL}/payment-result?status=failed&orderId=${orderId}&error=order_not_found`;
      return res.redirect(redirectUrl);
    }

    console.log(`📦 Found order ${orderId}, current payment_status: ${order.payment_status}`);

    // Update payment status based on VNPay response
    if (vnpTransactionStatus === "00" && vnpResponseCode === "00") {
      // ✅ Payment successful - Update payment_status to 'paid'
      await order.update({ 
        payment_status: "paid"
      });
      
      console.log(`✅ Payment successful - Updated order ${orderId} payment_status to 'paid'`);
      
      const redirectUrl = `${FRONTEND_URL}/payment-result?status=paid&orderId=${orderId}&amount=${amountParam}&txnRef=${txnRef}`;
      return res.redirect(redirectUrl);
    } else {
      // ❌ Payment failed
      await order.update({ payment_status: "failed" });
      
      console.log(`❌ Payment failed - Updated order ${orderId} payment_status to 'failed'`);
      
      const redirectUrl = `${FRONTEND_URL}/payment-result?status=failed&orderId=${orderId}&amount=${amountParam}&responseCode=${vnpResponseCode}`;
      return res.redirect(redirectUrl);
    }
  } catch (err) {
    console.error("❌ Error in vnpayReturn:", err);
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const redirectUrl = `${FRONTEND_URL}/payment-result?status=error&error=server_error`;
    return res.redirect(redirectUrl);
  }
};

/**
 * VNPay IPN (Instant Payment Notification)
 * GET /api/payment/vnpay-ipn
 */
export const vnpayIpn = async (req: Request, res: Response) => {
  try {
    const vnp_HashSecret = process.env.VNP_HASH_SECRET!;
    
    const vnpay = new VNPay({
      tmnCode: process.env.VNP_TMN_CODE!,
      secureSecret: vnp_HashSecret,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      loggerFn: ignoreLogger,
    });

    // Verify IPN call
    const verifyResult = vnpay.verifyIpnCall(req.query as any);
    const isValid = 
      typeof verifyResult === "boolean" 
        ? verifyResult 
        : (verifyResult as any).isValid !== false;

    if (!isValid) {
      console.error("❌ IPN - Invalid checksum");
      return res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
    }

    // Parse IPN data
    const vnp_TxnRef = req.query.vnp_TxnRef as string;
    const responseCode = req.query.vnp_ResponseCode as string;
    const transactionStatus = req.query.vnp_TransactionStatus as string;
    const orderId = parseInt(vnp_TxnRef.split("_")[0], 10);

    // Check if order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      console.error("❌ IPN - Order not found:", orderId);
      return res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }

    // Update order status
    if (responseCode === "00" && transactionStatus === "00") {
      // ✅ Only update if not already paid
      if (order.payment_status !== "paid") {
        await order.update({ 
          payment_status: "paid"
        });
        console.log(`✅ IPN - Updated order ${orderId} payment_status to 'paid'`);
      }
    } else {
      await order.update({ payment_status: "failed" });
      console.log(`❌ IPN - Payment failed for order ${orderId}`);
    }

    return res.status(200).json({ RspCode: "00", Message: "Success" });
  } catch (err) {
    console.error("❌ Error processing VNPay IPN:", err);
    return res.status(200).json({ RspCode: "99", Message: "Processing error" });
  }
};