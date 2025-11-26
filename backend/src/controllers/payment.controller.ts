import { Request, Response } from "express";
import { VNPay, VnpLocale, ProductCode, dateFormat, ignoreLogger } from "vnpay";
import Order from "../models/Order";


const normalizeIp = (ip?: string | null): string => {
  if (!ip) return "127.0.0.1";
  let addr = ip.split(",")[0].trim();
  if (addr === "::1" || addr === "::ffff:127.0.0.1") return "127.0.0.1";
  if (addr.startsWith("::ffff:")) addr = addr.replace("::ffff:", "");
  return addr;
};


export const createVnpayUrl = async (req: Request, res: Response) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu các tham số bắt buộc: amount hoặc orderId.",
      });
    }

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

   
    const { VNP_TMN_CODE, VNP_HASH_SECRET, VNP_RETURN_URL } = process.env;
    if (!VNP_TMN_CODE || !VNP_HASH_SECRET || !VNP_RETURN_URL) {
      console.error(" Cấu hình VNPay bị thiếu trong tệp .env.");
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

  
    const createDate = new Date();
    const expireDate = new Date(createDate.getTime() + 15 * 60 * 1000); 
    const vnp_TxnRef = `${orderId}_${dateFormat(createDate, 'HHmmss')}`;

 
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

  
    return res.json({ success: true, paymentUrl });

  } catch (err) {
    console.error(" Lỗi khi tạo URL VNPay:", err);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi không mong muốn khi tạo URL thanh toán.",
      error: (err as Error).message,
    });
  }
};


export const vnpayReturn = async (req: Request, res: Response) => {
  const { FRONTEND_URL, VNP_HASH_SECRET, VNP_TMN_CODE } = process.env;
  
  try {
    console.log(" VNPay Return - Đã nhận query params:", JSON.stringify(req.query, null, 2));
    
   
    const vnpay = new VNPay({ 
      tmnCode: VNP_TMN_CODE!, 
      secureSecret: VNP_HASH_SECRET!, 
      loggerFn: ignoreLogger 
    });
    
  
    const isValid = vnpay.verifyIpnCall(req.query as any);
    console.log(" Checksum verification:", isValid ? "Valid" : " Invalid");

    if (!isValid) {
      console.error(" VNPay Return - Chữ ký không hợp lệ.");
      return res.redirect(`${FRONTEND_URL}/payment-result?status=failed&error=invalid_checksum`);
    }

    
    const { vnp_TxnRef, vnp_TransactionStatus, vnp_ResponseCode, vnp_Amount } = req.query;
    const orderId = parseInt((vnp_TxnRef as string).split("_")[0], 10);

    console.log(" Transaction details:", {
      vnp_TxnRef,
      vnp_TransactionStatus,
      vnp_ResponseCode,
      orderId
    });

    
    const order = await Order.findByPk(orderId);
    if (!order) {
      console.error(" VNPay Return - Không tìm thấy đơn hàng:", orderId);
      return res.redirect(`${FRONTEND_URL}/payment-result?status=failed&error=order_not_found&orderId=${orderId}`);
    }

    console.log(` Found order ${orderId}, current payment_status: ${order.payment_status}`);


    if (vnp_TransactionStatus === "00" && vnp_ResponseCode === "00") {
     
      const [affectedCount] = await Order.update(
        { payment_status: "paid" },
        { where: { order_id: orderId } }
      );
      
      console.log(` VNPay Return - Đã cập nhật đơn hàng ${orderId} thành 'paid' (affected: ${affectedCount})`);
      
      
      const updatedOrder = await Order.findByPk(orderId);
      console.log(` Xác nhận payment_status sau khi update: ${updatedOrder?.payment_status}`);
      
      const redirectUrl = `${FRONTEND_URL}/payment-result?status=paid&orderId=${orderId}&amount=${vnp_Amount}&txnRef=${vnp_TxnRef}`;
      return res.redirect(redirectUrl);
    } else {
      
      const [affectedCount] = await Order.update(
        { payment_status: "failed" },
        { where: { order_id: orderId } }
      );
      
      console.log(` VNPay Return - Đã cập nhật đơn hàng ${orderId} thành 'failed' (affected: ${affectedCount})`);
      
      const redirectUrl = `${FRONTEND_URL}/payment-result?status=failed&orderId=${orderId}&responseCode=${vnp_ResponseCode}`;
      return res.redirect(redirectUrl);
    }
  } catch (err) {
    console.error(" Lỗi nghiêm trọng trong vnpayReturn:", err);
    return res.redirect(`${FRONTEND_URL}/payment-result?status=error&error=server_error`);
  }
};

export const vnpayIpn = async (req: Request, res: Response) => {
  const { VNP_HASH_SECRET, VNP_TMN_CODE } = process.env;
  try {
    console.log(" VNPay IPN - Đã nhận thông báo:", JSON.stringify(req.query, null, 2));

    const vnpay = new VNPay({ 
      tmnCode: VNP_TMN_CODE!,
      secureSecret: VNP_HASH_SECRET!, 
      loggerFn: ignoreLogger 
    });
    
    const isValid = vnpay.verifyIpnCall(req.query as any);
    console.log(" IPN verification:", isValid ? " Valid" : " Invalid");

    if (!isValid) {
      console.error(" IPN - Chữ ký không hợp lệ.");
      return res.status(200).json({ RspCode: "97", Message: "Invalid Checksum" });
    }

    const { vnp_TxnRef, vnp_TransactionStatus, vnp_ResponseCode } = req.query;
    const orderId = parseInt((vnp_TxnRef as string).split("_")[0], 10);
    
   


    const order = await Order.findByPk(orderId);
    if (!order) {
      console.error(" IPN - Không tìm thấy đơn hàng:", orderId);
      return res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }

    console.log(` IPN - Found order ${orderId}, current payment_status: ${order.payment_status}`);

   
    if (order.payment_status === "paid") {
      console.log(`ℹ IPN - Đơn hàng ${orderId} đã được thanh toán. Ghi nhận thành công.`);
      return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
    }
    
    if (vnp_TransactionStatus === "00" && vnp_ResponseCode === "00") {
      const [affectedCount] = await Order.update(
        { payment_status: "paid" },
        { where: { order_id: orderId } }
      );
      console.log(` IPN - Đã cập nhật trạng thái đơn hàng ${orderId} thành 'paid' (affected: ${affectedCount})`);
    } else {
      const [affectedCount] = await Order.update(
        { payment_status: "failed" },
        { where: { order_id: orderId } }
      );
      console.log(` IPN - Đã cập nhật trạng thái đơn hàng ${orderId} thành 'failed' (affected: ${affectedCount})`);
    }

    return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });

  } catch (err) {
    console.error(" Lỗi nghiêm trọng khi xử lý VNPay IPN:", err);
    return res.status(200).json({ RspCode: "99", Message: "Unknown error" });
  }
};