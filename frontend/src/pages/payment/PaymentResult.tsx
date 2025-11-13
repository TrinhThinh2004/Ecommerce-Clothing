// frontend/src/pages/PaymentResult/PaymentResult.tsx
import { useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatVnd } from "../../utils/format";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  useEffect(() => {
    // Clear cart event nếu thanh toán thành công
    if (status === "success") {
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [status]);

  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: <CheckCircle className="h-20 w-20 text-green-500" />,
          title: "Thanh toán thành công!",
          titleClass: "text-green-600",
          description: `Đơn hàng #${orderId} đã được thanh toán thành công${amount ? ` với số tiền ${formatVnd(Number(amount))}` : ""}.`,
          descClass: "text-neutral-600",
        };
      case "failed":
        return {
          icon: <XCircle className="h-20 w-20 text-red-500" />,
          title: "Thanh toán thất bại!",
          titleClass: "text-red-600",
          description: message || `Đơn hàng #${orderId} chưa được thanh toán. ${code ? `Mã lỗi: ${code}` : ""}`,
          descClass: "text-neutral-600",
        };
      default:
        return {
          icon: <AlertCircle className="h-20 w-20 text-orange-500" />,
          title: "Có lỗi xảy ra!",
          titleClass: "text-orange-600",
          description: message || "Không thể xác định trạng thái thanh toán.",
          descClass: "text-neutral-600",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          {config.icon}
        </div>
        
        <h1 className={`text-2xl font-bold mb-3 ${config.titleClass}`}>
          {config.title}
        </h1>
        
        <p className={`mb-6 ${config.descClass}`}>
          {config.description}
        </p>

        {orderId && (
          <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
            <div className="text-sm text-neutral-500">Mã đơn hàng</div>
            <div className="text-lg font-bold text-neutral-800">#{orderId}</div>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-neutral-800 transition"
          >
            Về trang chủ
          </Link>
          
          {status === "success" && (
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