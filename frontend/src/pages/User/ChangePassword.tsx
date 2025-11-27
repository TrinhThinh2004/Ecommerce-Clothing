// src/pages/User/ChangePassword.tsx
import { useState } from "react";
import { Eye, EyeOff, Lock, Save } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/client";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.currentPassword) {
      toast.error(" Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    if (!formData.newPassword) {
      toast.error("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error(" Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(" Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error(" Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }

    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await axiosInstance.put("/api/v1/users/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success(" Đổi mật khẩu thành công!");

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error changing password:", error);

      if (error.response?.status === 401) {
        toast.error(" Mật khẩu hiện tại không đúng");
      } else {
        toast.error(
          error.response?.data?.message ||
            " Có lỗi xảy ra khi đổi mật khẩu"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-neutral-800">Đổi Mật Khẩu</h2>
        <p className="text-sm text-neutral-600 mt-1">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        {/* Current Password */}
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-neutral-700">
            Mật khẩu hiện tại <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type={showPassword.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu hiện tại"
              className="h-12 w-full rounded-lg border border-neutral-300 pl-12 pr-12 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/20"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword.current ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-neutral-700">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              className="h-12 w-full rounded-lg border border-neutral-300 pl-12 pr-12 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/20"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword.new ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Password strength indicator */}
          {formData.newPassword && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      formData.newPassword.length < 6
                        ? "w-1/3 bg-red-500"
                        : formData.newPassword.length < 8
                        ? "w-2/3 bg-yellow-500"
                        : "w-full bg-green-500"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    formData.newPassword.length < 6
                      ? "text-red-600"
                      : formData.newPassword.length < 8
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {formData.newPassword.length < 6
                    ? "Yếu"
                    : formData.newPassword.length < 8
                    ? "Trung bình"
                    : "Mạnh"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-neutral-700">
            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu mới"
              className="h-12 w-full rounded-lg border border-neutral-300 pl-12 pr-12 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/20"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword.confirm ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Match indicator */}
          {formData.confirmPassword && (
            <p
              className={`text-xs font-semibold ${
                formData.newPassword === formData.confirmPassword
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formData.newPassword === formData.confirmPassword
                ? "✓ Mật khẩu khớp"
                : "✗ Mật khẩu không khớp"}
            </p>
          )}
        </div>

        {/* Info box */}
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            💡 Gợi ý mật khẩu mạnh:
          </h4>
          <ul className="space-y-1 text-xs text-blue-700">
            <li>• Ít nhất 8 ký tự</li>
            <li>• Kết hợp chữ hoa, chữ thường</li>
            <li>• Có số và ký tự đặc biệt</li>
            <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() =>
              setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              })
            }
            className="rounded-lg border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold hover:bg-neutral-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
}