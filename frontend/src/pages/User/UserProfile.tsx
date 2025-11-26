// src/pages/User/UserProfile.tsx
import { useState, useEffect } from "react";
import { Camera, Save } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/client";

type UserProfile = {
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "male" | "female" | "other" | "";
};

export default function UserProfile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Lấy thông tin user từ localStorage trước
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      setProfile({
        username: storedUser.username || "",
        email: storedUser.email || "",
        phone_number: storedUser.phone_number || "",
        first_name: storedUser.first_name || "",
        last_name: storedUser.last_name || "",
        date_of_birth: storedUser.date_of_birth || "",
        gender: storedUser.gender || "",
      });

      // Gọi API để lấy thông tin mới nhất (nếu có endpoint)
      // const res = await axiosInstance.get("/api/v1/users/profile");
      // setProfile(res.data.data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gọi API cập nhật profile
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await axiosInstance.put("/api/v1/users/profile", {
        phone_number: profile.phone_number,
        first_name: profile.first_name,
        last_name: profile.last_name,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
      });

      // Cập nhật localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...storedUser,
        ...profile,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("✅ Cập nhật hồ sơ thành công!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message || "❌ Có lỗi xảy ra khi cập nhật hồ sơ"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-neutral-800">Hồ Sơ Của Tôi</h2>
        <p className="text-sm text-neutral-600 mt-1">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-[1fr,300px]">
          {/* Left - Form fields */}
          <div className="space-y-5">
            {/* Username (readonly) */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-neutral-700">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={profile.username}
                disabled
                className="h-11 rounded-lg border border-neutral-300 bg-neutral-100 px-4 text-sm outline-none cursor-not-allowed"
              />
              <p className="text-xs text-neutral-500">
                Tên đăng nhập không thể thay đổi
              </p>
            </div>

            {/* Email (readonly) */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-neutral-700">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="h-11 rounded-lg border border-neutral-300 bg-neutral-100 px-4 text-sm outline-none cursor-not-allowed"
              />
            </div>

            {/* First Name & Last Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-neutral-700">
                  Họ và tên đệm
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn"
                  className="h-11 rounded-lg border border-neutral-300 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/20"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-neutral-700">
                  Tên
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  placeholder="A"
                  className="h-11 rounded-lg border border-neutral-300 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-neutral-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone_number"
                value={profile.phone_number}
                onChange={handleChange}
                placeholder="0123456789"
                className="h-11 rounded-lg border border-neutral-300 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/20"
              />
            </div>

            {/* Date of Birth */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-neutral-700">
                Ngày sinh
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={profile.date_of_birth}
                onChange={handleChange}
                className="h-11 rounded-lg border border-neutral-300 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/20"
              />
            </div>

            {/* Gender */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-neutral-700">
                Giới tính
              </label>
              <div className="flex items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={profile.gender === "male"}
                    onChange={handleChange}
                    className="h-4 w-4 accent-black"
                  />
                  <span className="text-sm">Nam</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={profile.gender === "female"}
                    onChange={handleChange}
                    className="h-4 w-4 accent-black"
                  />
                  <span className="text-sm">Nữ</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={profile.gender === "other"}
                    onChange={handleChange}
                    className="h-4 w-4 accent-black"
                  />
                  <span className="text-sm">Khác</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right - Avatar */}
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6">
            <div className="relative">
              <div className="grid h-32 w-32 place-content-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-5xl font-bold text-white shadow-lg">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 grid h-10 w-10 place-content-center rounded-full border-2 border-white bg-black text-white shadow-lg hover:bg-neutral-800"
                title="Chọn ảnh"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold text-neutral-800">
                {profile.first_name} {profile.last_name || profile.username}
              </p>
              <p className="text-xs text-neutral-500 mt-1">{profile.email}</p>
            </div>

            <button
              type="button"
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
            >
              Chọn Ảnh
            </button>

            <p className="text-center text-xs text-neutral-500">
              Dung lượng tối đa 1MB
              <br />
              Định dạng: JPG, PNG
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 border-t pt-6">
          <button
            type="button"
            onClick={loadProfile}
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
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}