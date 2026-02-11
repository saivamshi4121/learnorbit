// src/services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { addMinutes, addDays, addHours } = require('date-fns');
const { v4: uuidv4 } = require('uuid');

const UserRepo = require('../repositories/user.repository');
const RefreshTokenRepo = require('../repositories/refreshToken.repository');
const AuditLogRepo = require('../repositories/auditLog.repository');
const logger = require('../utils/logger');

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES_MIN = 15; // minutes
const REFRESH_TOKEN_EXPIRES_DAYS = 7; // days
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MIN = 15;

/**
 * Authentication Service
 * Handles user registration, login, token management
 */
class AuthService {
  // ==================== Token Generation ====================

  /**
   * Generate JWT access token
   * @param {Object} payload - Token payload
   * @param {number} payload.id - User ID
   * @param {string} payload.email - User email
   * @param {string} payload.role - User role
   * @returns {string} JWT token
   */
  static _generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: `${ACCESS_TOKEN_EXPIRES_MIN}m`,
    });
  }

  /**
   * Generate refresh token
   * @returns {string} Opaque refresh token
   */
  static _generateRefreshToken() {
    return uuidv4() + uuidv4(); // high-entropy opaque token
  }

  /**
   * Generate random token for email verification/password reset
   * @returns {string} Random token
   */
  static _generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // ==================== Registration ====================

  /**
   * Register a new user
   * @param {Object} data - Registration data
   * @param {string} data.name - User name
   * @param {string} data.email - User email
   * @param {string} data.password - User password
   * @param {string} data.role - User role (admin|instructor|student)
   * @param {Object} data.profile - Additional profile data
   * @returns {Promise<number>} User ID
   */
  static async register({ name, email, password, role = 'student', profile = {} }) {
    try {
      // Validate role
      const validRoles = ['admin', 'instructor', 'student'];
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role specified');
      }

      // Check if email already exists
      const existingUser = await UserRepo.findByEmail(email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hash = await bcrypt.hash(password, SALT_ROUNDS);

      // Auto-generate student ID for students
      if (role === 'student' && !profile.studentId) {
        profile.studentId = `STU${Date.now()}`;
        profile.enrollmentDate = new Date();
      }

      // Create user
      const userId = await UserRepo.create({
        name,
        email,
        passwordHash: hash,
        role,
        profile,
      });

      // Generate email verification token
      const verificationToken = this._generateRandomToken();
      const expiresAt = addHours(new Date(), 24); // 24 hours

      await UserRepo.setEmailVerificationToken(userId, verificationToken, expiresAt);

      logger.info(`User registered successfully`, {
        userId,
        email,
        role,
      });

      // TODO: Send verification email
      // await emailQueue.add('email-verification', {
      //   userId,
      //   email,
      //   name,
      //   verificationToken,
      // });

      return userId;
    } catch (error) {
      logger.error(`Registration failed: ${error.message}`, {
        email,
        role,
        error: error.stack,
      });
      throw error;
    }
  }

  // ==================== Login ====================

  /**
   * Authenticate user and generate tokens
   * @param {Object} data - Login data
   * @param {string} data.email - User email
   * @param {string} data.password - User password
   * @param {string} data.ip - IP address
   * @param {string} data.userAgent - User agent
   * @returns {Promise<Object>} Access and refresh tokens
   */
  static async login({ email, password, ip, userAgent }) {
    try {
      // Find user
      const user = await UserRepo.findByEmail(email);
      if (!user) {
        await AuditLogRepo.log({
          eventType: 'login_failure',
          ip,
          userAgent,
          details: { email, reason: 'user_not_found' },
        });
        throw new Error('Invalid credentials');
      }

      // Check if account is active
      if (!user.is_active) {
        await AuditLogRepo.log({
          userId: user.id,
          eventType: 'login_failure',
          ip,
          userAgent,
          details: { reason: 'account_inactive' },
        });
        throw new Error('Account is deactivated. Please contact support.');
      }

      // Check if account is locked
      if (UserRepo.isLocked(user)) {
        await AuditLogRepo.log({
          userId: user.id,
          eventType: 'login_failure',
          ip,
          userAgent,
          details: { reason: 'account_locked' },
        });
        throw new Error('Account is temporarily locked. Try later.');
      }

      // Verify password
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        await UserRepo.incrementFailedAttempts(user.id);
        await AuditLogRepo.log({
          userId: user.id,
          eventType: 'login_failure',
          ip,
          userAgent,
          details: { reason: 'invalid_password' },
        });

        // Lock account if max attempts reached
        if (user.failed_login_attempts + 1 >= MAX_FAILED_ATTEMPTS) {
          const lockUntil = addMinutes(new Date(), LOCK_DURATION_MIN);
          await UserRepo.lockAccount(user.id, lockUntil);

          logger.warn(`Account locked due to failed attempts`, {
            userId: user.id,
            email: user.email,
            attempts: user.failed_login_attempts + 1,
          });
        }

        throw new Error('Invalid credentials');
      }

      // Successful login - reset counters
      await UserRepo.resetFailedAttempts(user.id);
      await AuditLogRepo.log({
        userId: user.id,
        eventType: 'login_success',
        ip,
        userAgent,
        details: { role: user.role },
      });

      // Generate tokens
      const accessToken = this._generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      const refreshToken = this._generateRefreshToken();
      const refreshExpiresAt = addDays(new Date(), REFRESH_TOKEN_EXPIRES_DAYS);

      await RefreshTokenRepo.create({
        userId: user.id,
        token: refreshToken,
        expiresAt: refreshExpiresAt,
        ip,
        userAgent,
      });

      logger.info(`User logged in successfully`, {
        userId: user.id,
        email: user.email,
        role: user.role,
        ip,
      });

      // Return user data (excluding sensitive fields)
      const userResponse = { ...user };
      delete userResponse.password;

      return { accessToken, refreshToken, user: userResponse };
    } catch (error) {
      logger.error(`Login failed: ${error.message}`, {
        email,
        error: error.stack,
      });
      throw error;
    }
  }

  // ==================== Token Refresh ====================

  /**
   * Refresh access token using refresh token
   * @param {Object} data - Refresh data
   * @param {string} data.token - Refresh token
   * @param {string} data.ip - IP address
   * @param {string} data.userAgent - User agent
   * @returns {Promise<Object>} New access and refresh tokens
   */
  static async refresh({ token, ip, userAgent }) {
    try {
      // Find refresh token
      const stored = await RefreshTokenRepo.findByToken(token);
      if (!stored) {
        await AuditLogRepo.log({
          eventType: 'token_refresh_failure',
          ip,
          userAgent,
          details: { reason: 'invalid_token' },
        });
        throw new Error('Invalid refresh token');
      }

      // Get user
      const user = await UserRepo.findById(stored.user_id);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user is active
      if (!user.is_active) {
        throw new Error('Account is deactivated');
      }

      // Rotate token (revoke old, create new)
      const newRefreshToken = this._generateRefreshToken();
      const newExpiresAt = addDays(new Date(), REFRESH_TOKEN_EXPIRES_DAYS);

      await RefreshTokenRepo.revoke(stored.token, ip, newRefreshToken);
      await RefreshTokenRepo.create({
        userId: stored.user_id,
        token: newRefreshToken,
        expiresAt: newExpiresAt,
        ip,
        userAgent,
      });

      // Generate new access token
      const accessToken = this._generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      await AuditLogRepo.log({
        userId: user.id,
        eventType: 'token_refresh',
        ip,
        userAgent,
      });

      logger.info(`Token refreshed successfully`, {
        userId: user.id,
        ip,
      });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      logger.error(`Token refresh failed: ${error.message}`, {
        error: error.stack,
      });
      throw error;
    }
  }

  // ==================== Logout ====================

  /**
   * Logout user and revoke refresh token
   * @param {Object} data - Logout data
   * @param {string} data.token - Refresh token
   * @param {string} data.ip - IP address
   * @param {string} data.userAgent - User agent
   * @returns {Promise<void>}
   */
  static async logout({ token, ip, userAgent }) {
    try {
      const stored = await RefreshTokenRepo.findByToken(token);
      if (stored && !stored.revoked) {
        await RefreshTokenRepo.revoke(stored.token, ip);
        await AuditLogRepo.log({
          userId: stored.user_id,
          eventType: 'logout',
          ip,
          userAgent,
        });

        logger.info(`User logged out successfully`, {
          userId: stored.user_id,
          ip,
        });
      }
    } catch (error) {
      logger.error(`Logout failed: ${error.message}`, {
        error: error.stack,
      });
      // Don't throw - logout should always succeed
    }
  }

  // ==================== Email Verification ====================

  /**
   * Verify user email
   * @param {string} token - Verification token
   * @returns {Promise<boolean>} Success status
   */
  static async verifyEmail(token) {
    try {
      const success = await UserRepo.verifyEmail(token);

      if (success) {
        logger.info(`Email verified successfully`, { token });
      } else {
        logger.warn(`Email verification failed - invalid or expired token`, { token });
      }

      return success;
    } catch (error) {
      logger.error(`Email verification error: ${error.message}`, {
        error: error.stack,
      });
      throw error;
    }
  }

  // ==================== Password Reset ====================

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<string>} Reset token (for email)
   */
  static async requestPasswordReset(email) {
    try {
      const user = await UserRepo.findByEmail(email);

      // Always return success to prevent email enumeration
      if (!user) {
        logger.warn(`Password reset requested for non-existent email`, { email });
        return null;
      }

      const resetToken = this._generateRandomToken();
      const expiresAt = addHours(new Date(), 1); // 1 hour

      await UserRepo.setPasswordResetToken(user.id, resetToken, expiresAt);

      logger.info(`Password reset requested`, {
        userId: user.id,
        email,
      });

      // TODO: Send password reset email
      // await emailQueue.add('password-reset', {
      //   userId: user.id,
      //   email,
      //   resetToken,
      // });

      return resetToken;
    } catch (error) {
      logger.error(`Password reset request failed: ${error.message}`, {
        email,
        error: error.stack,
      });
      throw error;
    }
  }

  /**
   * Reset password using token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  static async resetPassword(token, newPassword) {
    try {
      const user = await UserRepo.findByPasswordResetToken(token);

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await UserRepo.updatePassword(user.id, hash);
      await UserRepo.clearPasswordResetToken(user.id);

      // Revoke all existing sessions
      await RefreshTokenRepo.revokeAllForUser(user.id);

      await AuditLogRepo.log({
        userId: user.id,
        eventType: 'password_reset',
        ip: null,
        userAgent: null,
      });

      logger.info(`Password reset successfully`, {
        userId: user.id,
      });

      return true;
    } catch (error) {
      logger.error(`Password reset failed: ${error.message}`, {
        error: error.stack,
      });
      throw error;
    }
  }
}

module.exports = AuthService;
