import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// GET /api/v1/users/profile - Lấy thông tin profile
router.get('/profile', getProfile);

// PUT /api/v1/users/profile - Cập nhật profile
router.put('/profile', updateProfile);

// PUT /api/v1/users/change-password - Đổi mật khẩu
router.put('/change-password', changePassword);

export default router;