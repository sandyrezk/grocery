
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';

import {
  sendSuccess,
  sendError,
} from '../utils/response.js';

import {
  sendTokens,
  generateAccessToken,
} from '../utils/token.js';

// ─────────────────────────────────────────────────────────────
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, 'An account with this email already exists');
    }

    // Create user (password hashed in pre-save hook)
    const user = await User.create({ email, username, password });

    // Generate tokens
    const { accessToken } = sendTokens(res, user);

    return sendSuccess(res, 201, 'Account created successfully', {
      accessToken,
      user: user.toSafeObject(),
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Login with email & password
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.provider !== 'local') {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Generate & store refresh token
    const { accessToken, refreshToken } = sendTokens(res, user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'Login successful', {
      accessToken,
      user: user.toSafeObject(),
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Refresh access token using refresh token cookie
// @route   POST /api/auth/refresh-token
// @access  Public
// ─────────────────────────────────────────────────────────────
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return sendError(res, 401, 'No refresh token provided');
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return sendError(res, 401, 'Invalid or expired refresh token');
    }

    // Find user and validate stored token
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return sendError(res, 401, 'Refresh token is no longer valid');
    }

    // Issue new access token
    const accessToken = generateAccessToken(user._id);

    return sendSuccess(res, 200, 'Token refreshed', { accessToken });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Logout — clear refresh token
// @route   POST /api/auth/logout
// @access  Private
// ─────────────────────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    // Clear refresh token in DB
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return sendSuccess(res, 200, 'Logged out successfully');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Send OTP for password reset (email or phone)
// @route   POST /api/auth/forgot-password
// @access  Public
// ─────────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return sendError(res, 400, 'Provide an email or phone number');
    }

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);

    // Always respond with 200 to prevent user enumeration
    if (!user) {
      return sendSuccess(res, 200, 'If this account exists, a code has been sent');
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = otpExpiry;
    await user.save({ validateBeforeSave: false });

    // TODO: send OTP via email (Nodemailer) or SMS (Twilio)
    // For development, log to console
    console.log(`🔑 OTP for ${email || phone}: ${otp}`);

    return sendSuccess(res, 200, 'If this account exists, a code has been sent');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
// ─────────────────────────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    const query = email ? { email } : { phone };
    const user = await User.findOne(query).select('+resetPasswordOTP +resetPasswordOTPExpiry');

    if (!user) {
      return sendError(res, 400, 'Invalid code');
    }

    // Check OTP match and expiry
    if (user.resetPasswordOTP !== otp) {
      return sendError(res, 400, 'Invalid code');
    }
    if (user.resetPasswordOTPExpiry < new Date()) {
      return sendError(res, 400, 'Code has expired. Please request a new one');
    }

    // Generate a short-lived reset token (5 min)
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordOTP = resetToken; // reuse field as reset token
    user.resetPasswordOTPExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'Code verified successfully', { resetToken });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
// ─────────────────────────────────────────────────────────────
const resendOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const query = email ? { email } : { phone };
    const user = await User.findOne(query);

    if (!user) {
      return sendSuccess(res, 200, 'If this account exists, a new code has been sent');
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    console.log(`🔁 Resent OTP for ${email || phone}: ${otp}`);

    return sendSuccess(res, 200, 'If this account exists, a new code has been sent');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Reset password using reset token
// @route   POST /api/auth/reset-password
// @access  Public
// ─────────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken) {
      return sendError(res, 400, 'Reset token is required');
    }

    const user = await User.findOne({
      resetPasswordOTP: resetToken,
      resetPasswordOTPExpiry: { $gt: new Date() },
    }).select('+resetPasswordOTP +resetPasswordOTPExpiry');

    if (!user) {
      return sendError(res, 400, 'Invalid or expired reset token');
    }

    // Set new password and clear reset fields
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    user.refreshToken = undefined;
    await user.save();

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    return sendSuccess(res, 200, 'Password reset successfully. Please log in with your new password');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

export {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  verifyOTP,
  resendOTP,
  resetPassword,
};