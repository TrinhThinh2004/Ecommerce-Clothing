/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";

import { Camera, Save, Loader2, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { getUserProfile, updateUserProfile } from "../../api/user";

type UserProfile = {
  username: string;
  email: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  gender: "" | "male" | "female" | "other"; 
};

export default function UserProfile() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    email: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
    gender: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setInitialLoading(true);
      const data = await getUserProfile();

      setProfile({
        username: data.username || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        address: data.address || "",
        date_of_birth: data.date_of_birth || "",
        gender: data.gender || "",
      });

      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      toast.error("Không thể tải thông tin hồ sơ");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      setProfile({
        username: storedUser.username || "",
        email: storedUser.email || "",
        phone_number: storedUser.phone_number || "",
        address: storedUser.address || "",
        date_of_birth: storedUser.date_of_birth || "",
        gender: storedUser.gender || "",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    if (
      !profile.phone_number.trim() ||
      !profile.address.trim() ||
      !profile.date_of_birth.trim() ||
      !profile.gender.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ tất cả các trường!");
      return;
    }

    
    if (!/^[0-9]{10}$/.test(profile.phone_number)) {
      toast.error("Số điện thoại phải đúng 10 chữ số!");
      return;
    }

    setLoading(true);

    try {
      const updatedProfile = await updateUserProfile({
        phone_number: profile.phone_number,
        address: profile.address,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender || undefined, 
      });

      localStorage.setItem("user", JSON.stringify(updatedProfile));

      toast.success("Cập nhật hồ sơ thành công!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật hồ sơ"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-neutral-600" />
        <span className="ml-3 text-neutral-600">Đang tải thông tin...</span>
      </div>
    );
  }

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
          {/* Left */}
          <div className="space-y-5">

            {/* Username */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-neutral-700">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={profile.username}
                disabled
                className="h-11 rounded-lg border border-neutral-300 bg-neutral-100 px-4 text-sm cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-neutral-700">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="h-11 rounded-lg border border-neutral-300 bg-neutral-100 px-4 text-sm cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold">Số điện thoại</label>
              <input
                type="tel"
                name="phone_number"
                value={profile.phone_number}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^[0-9]{0,10}$/.test(v)) {
                    setProfile((prev) => ({ ...prev, phone_number: v }));
                  }
                }}
                placeholder="0123456789"
                className="h-11 rounded-lg border border-neutral-300 px-4 text-sm outline-none"
              />
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold">Địa chỉ</label>
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                rows={3}
                placeholder="Nhập địa chỉ"
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm"
              />
            </div>

            {/* DOB */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold">Ngày sinh</label>
              <input
                type="date"
                name="date_of_birth"
                value={profile.date_of_birth}
                onChange={handleChange}
                className="h-11 rounded-lg border border-neutral-300 px-4 text-sm"
              />
            </div>

            {/* Gender */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold">Giới tính</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={profile.gender === "male"}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  Nam
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={profile.gender === "female"}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  Nữ
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={profile.gender === "other"}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  Khác
                </label>
              </div>
            </div>
          </div>

        
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed bg-neutral-50 p-6">
            <div className="relative">
              <div className="grid h-32 w-32 place-content-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-5xl font-bold text-white shadow-lg">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 grid h-10 w-10 place-content-center rounded-full bg-black text-white border-2 border-white"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold">{profile.username}</p>
              <p className="text-xs text-neutral-500">{profile.email}</p>
            </div>

          </div>
        </div>

    
        <div className="flex justify-end gap-3 border-t pt-6">
          <button
            type="button"
            onClick={loadProfile}
            className="border border-neutral-300 px-6 py-2.5 rounded-lg"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
