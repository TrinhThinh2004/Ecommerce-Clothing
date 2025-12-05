import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import { JWTPayload } from '../middleware/auth.middleware';
import crypto from 'crypto';
import sendMail from '../utils/mailer';

const createJWTPayload = (user: User): JWTPayload => ({
  user_id: user.user_id,
  username: user.username,
  email: user.email,
  role: user.role,
});

const generateAccessToken = (user: User): string => {
  const payload = createJWTPayload(user);
  const secret = process.env.JWT_SECRET; 
  if (!secret) {
    throw new Error('Thiếu cấu hình JWT_SECRET trong biến môi trường');
  }

  const expiresIn = process.env.JWT_ACCESS_EXPIRES || '30m';
  return jwt.sign(payload, secret as jwt.Secret, { expiresIn } as SignOptions);
};

const generateRefreshToken = (user: User): string => {
  const payload = createJWTPayload(user);
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Thiếu cấu hình JWT_REFRESH_SECRET hoặc JWT_SECRET trong biến môi trường');
  }

  const expiresIn = process.env.JWT_REFRESH_EXPIRES || '7d';
  return jwt.sign(payload, secret as jwt.Secret, { expiresIn } as SignOptions);
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    // read refresh token from HttpOnly cookie
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Thiếu cấu hình JWT_REFRESH_SECRET hoặc JWT_SECRET trong biến môi trường');
    }

    // verify signature and decode to get user id
    const decoded = jwt.verify(refreshToken, secret as jwt.Secret) as JWTPayload;

    // find user and validate stored hash
    const user = await User.findByPk(decoded.user_id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // validate stored refresh token (plaintext stored as requested)
    // @ts-ignore - refresh_token field exists on model
    if (!user.refresh_token || user.refresh_token !== refreshToken) {
      return res.status(403).json({ message: 'Refresh token revoked or not found' });
    }

    // rotate: replace stored refresh token with a new one
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    // persist new refresh token on user
    // @ts-ignore
    await user.update({ refresh_token: newRefreshToken });

    // set HttpOnly cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    return res.json({ accessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

// Logout: revoke a refresh token (end session)
export const logout = async (req: Request, res: Response) => {
  try {
    // read refresh token from cookie
    // @ts-ignore
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    if (!refreshToken) return res.json({ message: 'Logged out' });

    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Thiếu cấu hình JWT_REFRESH_SECRET hoặc JWT_SECRET trong biến môi trường');
    }

    // decode to get user id (if invalid, just clear cookie)
    let decoded: JWTPayload | null = null;
    try {
      decoded = jwt.verify(refreshToken, secret as jwt.Secret) as JWTPayload;
    } catch (e) {
      // invalid token: clear cookie and return
      res.clearCookie('refreshToken');
      return res.json({ message: 'Logged out' });
    }

    const user = await User.findByPk(decoded.user_id);
    if (user) {
      // @ts-ignore
      if (user.refresh_token && user.refresh_token === refreshToken) {
        // clear stored refresh token
        // @ts-ignore
        await user.update({ refresh_token: null });
      }
    }

    // clear cookie on client
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logged out' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Đăng nhập
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập email và mật khẩu' 
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không đúng' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không đúng' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB (plaintext as requested)
    await user.update({ refresh_token: refreshToken });

    // set refresh token in HttpOnly cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);

      return res.json({
        message: 'Đăng nhập thành công',
        accessToken,
        user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Đăng ký (chỉ tạo user role)
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, phone_number } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập username, email và mật khẩu' 
      });
    }

    const existingUserByEmail = await User.findOne({ where: { email } });
    const existingUserByUsername = await User.findOne({ where: { username } });
    
    if (existingUserByEmail || existingUserByUsername) {
      return res.status(409).json({ 
        message: 'Username hoặc email đã tồn tại' 
      });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      email,
      password_hash,
      phone_number,
      role: 'user',
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Store refresh token in DB (plaintext as requested)
    await newUser.update({ refresh_token: refreshToken });

    // set refresh token cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);

      return res.status(201).json({
        message: 'Đăng ký thành công',
        accessToken,
        user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Lấy profile user hiện tại
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    return res.json({
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Cập nhật profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { phone_number } = req.body;

    await user.update({
      phone_number: phone_number || user.phone_number,
    });

    return res.json({
      message: 'Cập nhật hồ sơ thành công',
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Vui lòng cung cấp email' });

    const user = await User.findOne({ where: { email } });

    // Always return generic response to avoid account enumeration
    if (!user) {
      return res.json({ message: 'Nếu tài khoản tồn tại, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // @ts-ignore
    await user.update({ password_reset_token: token, password_reset_expires: expires });

    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontend.replace(/\/$/, '')}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    const subject = 'Yêu cầu đặt lại mật khẩu';
    const html = `<p>Xin chào ${user.username},</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu. Bạn có thể đặt lại mật khẩu bằng cách nhấp vào liên kết bên dưới (hết hạn sau 1 giờ):</p>
      <p><a href="${resetLink}">Đặt lại mật khẩu</a></p>
      <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>`;

    try {
      await sendMail({ to: user.email, subject, html, text: `Mở liên kết sau để đặt lại mật khẩu: ${resetLink}` });
    } catch (mailErr) {
      console.error('Mail send error', mailErr);
    }

    return res.json({ message: 'Nếu tài khoản tồn tại, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) return res.status(400).json({ message: 'Thiếu thông tin' });

    const user = await User.findOne({ where: { email, password_reset_token: token } as any });
    if (!user) return res.status(400).json({ message: 'Liên kết không hợp lệ hoặc đã hết hạn' });

    // @ts-ignore
    if (!user.password_reset_expires || new Date(user.password_reset_expires) < new Date()) {
      return res.status(400).json({ message: 'Liên kết không hợp lệ hoặc đã hết hạn' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // update password, clear reset token and also revoke refresh token
    // @ts-ignore
    await user.update({ password_hash, password_reset_token: null, password_reset_expires: null, refresh_token: null });

    return res.json({ message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
