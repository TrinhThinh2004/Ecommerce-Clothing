import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatVnd } from "../../utils/format";
import { clearCart } from "../../api/cart";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10); // Tăng thời gian chờ lên 10s

  // SỬA LỖI: Đọc các tham số đã được backend xử lý, không còn đọc tham số thô từ VNPay
  const status = searchParams.get("status"); // "paid" | "failed" | "error"
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const txnRef = searchParams.get("txnRef");
  const error = searchParams.get("error");
  const responseCode = searchParams.get("responseCode");

  useEffect(() => {
    // Nếu thanh toán thành công, tự động xóa giỏ hàng
    if (status === "paid") {
      clearCart().then(() => {
        console.log("✅ Giỏ hàng đã được xóa sau khi thanh toán thành công.");
        // Gửi sự kiện để các component khác (như header) cập nhật lại UI giỏ hàng
        window.dispatchEvent(new Event("cartUpdated"));
      }).catch((err) => {
        console.error("❌ Lỗi khi xóa giỏ hàng:", err);
      });
    }

    // Tự động đếm ngược để chuyển về trang chủ
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/"); // Chuyển về trang chủ
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Dọn dẹp interval khi component bị hủy
    return () => clearInterval(timer);
  }, [status, navigate]);

  // --- Giao diện hiển thị dựa trên trạng thái ---

  // Trường hợp 1: Thanh toán THÀNH CÔNG
  if (status === "paid") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-emerald-600 mb-2">
            Thanh toán thành công! 🎉
          </h1>
          <p className="text-neutral-600 mb-6">
            Đơn hàng của bạn đã được xác nhận. Cảm ơn bạn đã mua sắm!
          </p>

          <div className="bg-emerald-50 rounded-lg p-4 mb-6 text-left space-y-2 text-sm">
            {orderId && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Mã đơn hàng:</span>
                <span className="font-semibold">#{orderId}</span>
              </div>
            )}
            {amount && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Số tiền:</span>
                {/* SỬA LỖI: VNPay gửi amount đã nhân 100, nên cần chia lại */}
                <span className="font-semibold">{formatVnd(parseInt(amount) / 100)}</span>
              </div>
            )}
            {txnRef && (
              <div className="flex justify-between items-start">
                <span className="text-neutral-600">Mã giao dịch:</span>
                <span className="font-mono text-xs break-all text-right ml-2">{txnRef}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-neutral-500 mb-6">
            Tự động chuyển về trang chủ sau {countdown} giây...
          </p>

          <div className="flex gap-3">
            <button onClick={() => navigate("/")} className="flex-1 bg-emerald-600 text-white rounded-lg py-3 font-semibold hover:bg-emerald-700 transition">
              Về trang chủ
            </button>
            <button onClick={() => navigate("/don-hang")} className="flex-1 border border-emerald-600 text-emerald-600 rounded-lg py-3 font-semibold hover:bg-emerald-50 transition">
              Xem đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Trường hợp 2: Thanh toán THẤT BẠI
  if (status === "failed") {
    const errorMessages: Record<string, string> = {
      invalid_checksum: "Giao dịch không hợp lệ do chữ ký không đúng. Vui lòng thử lại.",
      order_not_found: "Không tìm thấy đơn hàng trong hệ thống.",
      invalid_order_id: "Mã đơn hàng không hợp lệ.",
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Thanh toán thất bại</h1>
          <p className="text-neutral-600 mb-6">
            {error && errorMessages[error] ? errorMessages[error] : `Đã có lỗi xảy ra. Mã lỗi VNPay: ${responseCode || 'N/A'}`}
          </p>
          <button onClick={() => navigate("/gio-hang")} className="w-full bg-neutral-800 text-white rounded-lg py-3 font-semibold hover:bg-neutral-900 transition">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Trường hợp 3: Lỗi không xác định hoặc lỗi server
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-amber-600 mb-2">Có lỗi xảy ra</h1>
        <p className="text-neutral-600 mb-6">
          {error === "server_error" ? "Lỗi hệ thống từ phía máy chủ." : "Không thể xác định trạng thái thanh toán. Vui lòng kiểm tra lịch sử đơn hàng của bạn."}
        </p>
        <button onClick={() => navigate("/")} className="w-full bg-neutral-800 text-white rounded-lg py-3 font-semibold hover:bg-neutral-900 transition">
          Về trang chủ
        </button>
      </div>
    </div>
  );
}