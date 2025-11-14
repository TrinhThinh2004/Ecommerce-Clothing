// frontend/src/pages/PaymentResult/PaymentResult.tsx
import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatVnd } from "../../utils/format";
import { clearCart } from "../../api/cart"; 

interface PaymentInfo {
  orderId: string | null;
  amount: number;
  status: "paid" | "failed" | "unknown";
  message?: string;
}

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    orderId: null,
    amount: 0,
    status: "unknown",
    message: "",
  });

  useEffect(() => {
    const orderId = searchParams.get("vnp_TxnRef") || null;
    const amountParam = searchParams.get("vnp_Amount");
    const vnpStatus = searchParams.get("vnp_TransactionStatus");
    const message = searchParams.get("vnp_ResponseMessage") || "";

    const amount = amountParam ? Number(amountParam) / 100 : 0;

    let status: "paid" | "failed" | "unknown" = "unknown";
    if (vnpStatus === "00") status = "paid";
    else if (vnpStatus !== null) status = "failed";

    setPaymentInfo({ orderId, amount, status, message });

    // 🟢 Nếu thanh toán thành công → xoá giỏ hàng server
    if (status === "paid") {
      clearCart().then(() => {
        window.dispatchEvent(new Event("cartUpdated")); // cập nhật UI
      });
    }
  }, [searchParams]);

  const getStatusConfig = () => {
    switch (paymentInfo.status) {
      case "paid":
        return {
          icon: <CheckCircle className="h-20 w-20 text-green-500" />,
          title: "Thanh toán thành công!",
          titleClass: "text-green-600",
          description: `Đơn hàng #${paymentInfo.orderId} đã được thanh toán thành công với số tiền ${formatVnd(paymentInfo.amount)}.`,
          descClass: "text-neutral-600",
        };
      case "failed":
        return {
          icon: <XCircle className="h-20 w-20 text-red-500" />,
          title: "Thanh toán thất bại!",
          titleClass: "text-red-600",
          description: paymentInfo.message || `Đơn hàng #${paymentInfo.orderId} chưa được thanh toán.`,
          descClass: "text-neutral-600",
        };
      default:
        return {
          icon: <AlertCircle className="h-20 w-20 text-orange-500" />,
          title: "Có lỗi xảy ra!",
          titleClass: "text-orange-600",
          description: paymentInfo.message || "Không thể xác định trạng thái thanh toán.",
          descClass: "text-neutral-600",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6 flex justify-center">{config.icon}</div>
        <h1 className={`text-2xl font-bold mb-3 ${config.titleClass}`}>{config.title}</h1>
        <p className={`mb-6 ${config.descClass}`}>{config.description}</p>

        {paymentInfo.orderId && (
          <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
            <div className="text-sm text-neutral-500">Mã đơn hàng</div>
            <div className="text-lg font-bold text-neutral-800">#{paymentInfo.orderId}</div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-neutral-800 transition"
          >
            Về trang chủ
          </Link>

          {paymentInfo.status === "paid" && (
            <button
              onClick={() => navigate("/don-hang")}
              className="inline-block px-6 py-3 border border-black text-black rounded-md hover:bg-neutral-50 transition"
            >
              Xem đơn hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
