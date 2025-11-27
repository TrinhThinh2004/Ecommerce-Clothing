// src/types/user.types.ts

export type Gender = 'male' | 'female' | 'other';
export type UserRole = 'admin' | 'user';

export interface UserBase {
  user_id: number;
  username: string;
  email: string;
  phone_number?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
  gender?: Gender | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserWithPassword extends UserBase {
  password_hash: string;
  refresh_token?: string | null;
}

// User DTO (Data Transfer Object) - không có password
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserDTO extends UserBase {}

// Create User Request
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
  gender?: Gender;
  role?: UserRole;
}

// Update User Request
export interface UpdateUserRequest {
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
  gender?: Gender;
}

// Change Password Request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Login Request
export interface LoginRequest {
  username: string;
  password: string;
}

// Login Response
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}