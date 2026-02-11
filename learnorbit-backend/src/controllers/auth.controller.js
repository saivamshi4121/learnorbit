// src/controllers/auth.controller.js
const AuthService = require('../services/auth.service');
const logger = require('../utils/logger');

/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, profile } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required',
      });
    }

    // Validate role (default to student if not provided)
    const validRoles = ['admin', 'instructor', 'student'];
    const userRole = role || 'student';

    if (!validRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be admin, instructor, or student',
      });
    }

    // Only admins can create admin/instructor accounts
    // This check should be added after implementing protect middleware
    // if (userRole !== 'student' && (!req.user || req.user.role !== 'admin')) {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Only admins can create admin or instructor accounts',
    //   });
    // }

    const userId = await AuthService.register({
      name,
      email,
      password,
      role: userRole,
      profile: profile || {},
    });

    logger.info(`User registration successful`, {
      userId,
      email,
      role: userRole,
      ip: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: { userId, role: userRole },
    });
  } catch (err) {
    if (err.message === 'Email already registered') {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
      });
    }

    logger.error(`Registration failed: ${err.message}`, {
      error: err.stack,
      ip: req.ip,
    });

    next(err);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const ip = req.ip;
    const userAgent = req.get('User-Agent') || '';

    const { accessToken, refreshToken, user } = await AuthService.login({
      email,
      password,
      ip,
      userAgent,
    });

    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth/refresh',
    });

    logger.info(`Login successful`, {
      email,
      ip,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: { accessToken, user },
    });
  } catch (err) {
    if (err.message && err.message.includes('locked')) {
      return res.status(423).json({
        success: false,
        error: err.message,
      });
    }

    if (err.message && err.message.includes('deactivated')) {
      return res.status(403).json({
        success: false,
        error: err.message,
      });
    }

    logger.warn(`Login failed`, {
      email: req.body.email,
      ip: req.ip,
      error: err.message,
    });

    res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token missing',
      });
    }

    const ip = req.ip;
    const userAgent = req.get('User-Agent') || '';

    const { accessToken, refreshToken } = await AuthService.refresh({
      token,
      ip,
      userAgent,
    });

    // Set new refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth/refresh',
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken },
    });
  } catch (err) {
    logger.warn(`Token refresh failed`, {
      ip: req.ip,
      error: err.message,
    });

    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token',
    });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    const ip = req.ip;
    const userAgent = req.get('User-Agent') || '';

    if (token) {
      await AuthService.logout({ token, ip, userAgent });
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
    });

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    logger.error(`Logout error: ${err.message}`, {
      error: err.stack,
      ip: req.ip,
    });

    // Always return success for logout
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }
};

/**
 * Verify email
 * GET /api/auth/verify-email/:token
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Verification token is required',
      });
    }

    const success = await AuthService.verifyEmail(token);

    if (success) {
      res.json({
        success: true,
        message: 'Email verified successfully. You can now log in.',
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token',
      });
    }
  } catch (err) {
    logger.error(`Email verification error: ${err.message}`, {
      error: err.stack,
    });

    next(err);
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    await AuthService.requestPasswordReset(email);

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent.',
    });
  } catch (err) {
    logger.error(`Password reset request error: ${err.message}`, {
      error: err.stack,
      email: req.body.email,
    });

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent.',
    });
  }
};

/**
 * Reset password
 * POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token and new password are required',
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
      });
    }

    await AuthService.resetPassword(token, newPassword);

    res.json({
      success: true,
      message: 'Password reset successfully. Please log in with your new password.',
    });
  } catch (err) {
    if (err.message === 'Invalid or expired reset token') {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }

    logger.error(`Password reset error: ${err.message}`, {
      error: err.stack,
    });

    next(err);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 * Requires authentication
 */
exports.getProfile = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    const UserRepo = require('../repositories/user.repository');
    const user = await UserRepo.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Remove sensitive data
    delete user.password;

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    logger.error(`Get profile error: ${err.message}`, {
      userId: req.user?.id,
      error: err.stack,
    });

    next(err);
  }
};
