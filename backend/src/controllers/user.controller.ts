import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';

// Lấy thông tin profile user
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.user_id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash', 'refresh_token'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Cập nhật profile user
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.user_id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { phone_number, address, date_of_birth, gender } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Validation cho phone_number nếu có
    if (phone_number && !/^[0-9+\-\s()]*$/.test(phone_number)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format',
      });
    }

    // Validation cho address nếu có
    if (address && address.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Address must be less than 500 characters',
      });
    }

    // Validation cho gender nếu có
    if (gender && !['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gender value',
      });
    }

    // Cập nhật các trường được phép
    await user.update({
      phone_number: phone_number !== undefined ? phone_number : user.phone_number,
      address: address !== undefined ? address : user.address,
      date_of_birth: date_of_birth !== undefined ? date_of_birth : user.date_of_birth,
      gender: gender !== undefined ? gender : user.gender,
    });

    // Lấy user đã cập nhật (không trả về password)
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash', 'refresh_token'] },
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Đổi mật khẩu
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.user_id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Kiểm tra mật khẩu mới không giống mật khẩu cũ
    const isSameAsOld = await bcrypt.compare(newPassword, user.password_hash);
    
    if (isSameAsOld) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password',
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await user.update({
      password_hash: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};