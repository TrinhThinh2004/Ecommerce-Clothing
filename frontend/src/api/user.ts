// src/api/user.ts
import axiosInstance from './client';

export interface UserProfile {
  user_id: number;
  username: string;
  email: string;
  phone_number?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Lấy thông tin profile
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get('/api/v1/users/profile');
  return response.data.data;
};

// Cập nhật profile
export const updateUserProfile = async (
  data: UpdateProfileData
): Promise<UserProfile> => {
  const response = await axiosInstance.put('/api/v1/users/profile', data);
  return response.data.data;
};

// Đổi mật khẩu
export const changeUserPassword = async (
  data: ChangePasswordData
): Promise<void> => {
  await axiosInstance.put('/api/v1/users/change-password', data);
};