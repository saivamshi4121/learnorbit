// src/repositories/user.repository.js
const pool = require('../config/database');
const logger = require('../utils/logger');

/**
 * User Repository - Unified repository for all user roles
 * Supports: admin, instructor, student
 */
class UserRepository {
    /**
     * Create a new user
     * @param {Object} userData - User data
     * @param {string} userData.name - User's full name
     * @param {string} userData.email - User's email
     * @param {string} userData.passwordHash - Hashed password
     * @param {string} userData.role - User role (admin|instructor|student)
     * @param {Object} userData.profile - Additional profile data
     * @returns {Promise<number>} User ID
     */
    static async create({ name, email, passwordHash, role = 'student', profile = {} }) {
        try {
            const sql = `
        INSERT INTO users (
          name, email, password_hash, role,
          expertise, years_of_experience, linkedin_url,
          enrollment_date, student_id,
          avatar_url, bio, phone
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
      `;

            const { rows } = await pool.query(sql, [
                name,
                email,
                passwordHash,
                role,
                // Instructor fields
                profile.expertise || null,
                profile.yearsOfExperience || null,
                profile.linkedinUrl || null,
                // Student fields
                profile.enrollmentDate || null,
                profile.studentId || null,
                // Common fields
                profile.avatarUrl || null,
                profile.bio || null,
                profile.phone || null,
            ]);

            logger.info(`User created successfully`, {
                userId: rows[0].id,
                email,
                role,
            });

            return rows[0].id;
        } catch (error) {
            logger.error(`Failed to create user: ${error.message}`, {
                email,
                role,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Find user by email
     * @param {string} email - User email
     * @returns {Promise<Object|null>} User object or null
     */
    static async findByEmail(email) {
        try {
            const sql = `
        SELECT 
          id, name, email, password_hash as password, role,
          is_active, is_email_verified,
          failed_login_attempts, locked_until,
          avatar_url, bio, phone,
          expertise, years_of_experience, linkedin_url,
          enrollment_date, student_id,
          institute_id,
          created_at, updated_at, last_login_at
        FROM users
        WHERE email = $1
      `;

            const { rows } = await pool.query(sql, [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            logger.error(`Failed to find user by email: ${error.message}`, {
                email,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Find user by ID
     * @param {number} id - User ID
     * @returns {Promise<Object|null>} User object or null
     */
    static async findById(id) {
        try {
            const sql = `
        SELECT 
          id, name, email, role,
          is_active, is_email_verified,
          avatar_url, bio, phone,
          expertise, years_of_experience, linkedin_url,
          enrollment_date, student_id,
          institute_id,
          created_at, updated_at, last_login_at
        FROM users
        WHERE id = $1
      `;

            const { rows } = await pool.query(sql, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            logger.error(`Failed to find user by ID: ${error.message}`, {
                userId: id,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Update user profile
     * @param {number} id - User ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<boolean>} Success status
     */
    static async update(id, updates) {
        try {
            const allowedFields = [
                'name', 'avatar_url', 'bio', 'phone',
                'expertise', 'years_of_experience', 'linkedin_url',
                'student_id',
            ];

            const fields = [];
            const values = [];

            Object.keys(updates).forEach(key => {
                if (allowedFields.includes(key)) {
                    fields.push(`${key} = $${values.length + 1}`);
                    values.push(updates[key]);
                }
            });

            if (fields.length === 0) {
                return false;
            }

            values.push(id);

            const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = $${values.length}`;
            const result = await pool.query(sql, values);

            logger.info(`User updated successfully`, {
                userId: id,
                fieldsUpdated: fields.length,
            });

            return result.rowCount > 0;
        } catch (error) {
            logger.error(`Failed to update user: ${error.message}`, {
                userId: id,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Update password
     * @param {number} id - User ID
     * @param {string} passwordHash - New hashed password
     * @returns {Promise<boolean>} Success status
     */
    static async updatePassword(id, passwordHash) {
        try {
            const sql = `UPDATE users SET password_hash = $1 WHERE id = $2`;
            const result = await pool.query(sql, [passwordHash, id]);

            logger.info(`Password updated successfully`, { userId: id });

            return result.rowCount > 0;
        } catch (error) {
            logger.error(`Failed to update password: ${error.message}`, {
                userId: id,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Check if account is locked
     * @param {Object} user - User object
     * @returns {boolean} True if locked
     */
    static isLocked(user) {
        if (!user.locked_until) return false;
        return new Date(user.locked_until) > new Date();
    }

    /**
     * Increment failed login attempts
     * @param {number} id - User ID
     * @returns {Promise<void>}
     */
    static async incrementFailedAttempts(id) {
        try {
            const sql = `
        UPDATE users 
        SET failed_login_attempts = failed_login_attempts + 1 
        WHERE id = $1
      `;
            await pool.query(sql, [id]);

            logger.warn(`Failed login attempt incremented`, { userId: id });
        } catch (error) {
            logger.error(`Failed to increment login attempts: ${error.message}`, {
                userId: id,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Lock user account
     * @param {number} id - User ID
     * @param {Date} lockUntil - Lock expiration time
     * @returns {Promise<void>}
     */
    static async lockAccount(id, lockUntil) {
        try {
            const sql = `UPDATE users SET locked_until = $1 WHERE id = $2`;
            await pool.query(sql, [lockUntil, id]);

            logger.warn(`Account locked`, {
                userId: id,
                lockUntil: lockUntil.toISOString(),
            });
        } catch (error) {
            logger.error(`Failed to lock account: ${error.message}`, {
                userId: id,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Reset failed login attempts
     * @param {number} id - User ID
     * @returns {Promise<void>}
     */
    static async resetFailedAttempts(id) {
        try {
            const sql = `
        UPDATE users 
        SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW()
        WHERE id = $1
      `;
            await pool.query(sql, [id]);

            logger.info(`Failed login attempts reset`, { userId: id });
        } catch (error) {
            logger.error(`Failed to reset login attempts: ${error.message}`, {
                userId: id,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Set email verification token
     * @param {number} id - User ID
     * @param {string} token - Verification token
     * @param {Date} expiresAt - Token expiration
     * @returns {Promise<void>}
     */
    static async setEmailVerificationToken(id, token, expiresAt) {
        try {
            const sql = `
        UPDATE users 
        SET email_verification_token = $1, email_verification_expires_at = $2
        WHERE id = $3
      `;
            await pool.query(sql, [token, expiresAt, id]);

            logger.info(`Email verification token set`, { userId: id });
        } catch (error) {
            logger.error(`Failed to set verification token: ${error.message}`, {
                userId: id,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Verify email
     * @param {string} token - Verification token
     * @returns {Promise<boolean>} Success status
     */
    static async verifyEmail(token) {
        try {
            const sql = `
        UPDATE users 
        SET is_email_verified = TRUE, 
            email_verification_token = NULL,
            email_verification_expires_at = NULL
        WHERE email_verification_token = $1 
          AND email_verification_expires_at > NOW()
      `;
            const result = await pool.query(sql, [token]);

            if (result.rowCount > 0) {
                logger.info(`Email verified successfully`, { token });
                return true;
            }

            return false;
        } catch (error) {
            logger.error(`Failed to verify email: ${error.message}`, {
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Set password reset token
     * @param {number} id - User ID
     * @param {string} token - Reset token
     * @param {Date} expiresAt - Token expiration
     * @returns {Promise<void>}
     */
    static async setPasswordResetToken(id, token, expiresAt) {
        try {
            const sql = `
        UPDATE users 
        SET password_reset_token = $1, password_reset_expires_at = $2
        WHERE id = $3
      `;
            await pool.query(sql, [token, expiresAt, id]);

            logger.info(`Password reset token set`, { userId: id });
        } catch (error) {
            logger.error(`Failed to set reset token: ${error.message}`, {
                userId: id,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Find user by password reset token
     * @param {string} token - Reset token
     * @returns {Promise<Object|null>} User object or null
     */
    static async findByPasswordResetToken(token) {
        try {
            const sql = `
        SELECT id, name, email, role
        FROM users
        WHERE password_reset_token = $1 
          AND password_reset_expires_at > NOW()
      `;
            const { rows } = await pool.query(sql, [token]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            logger.error(`Failed to find user by reset token: ${error.message}`, {
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Clear password reset token
     * @param {number} id - User ID
     * @returns {Promise<void>}
     */
    static async clearPasswordResetToken(id) {
        try {
            const sql = `
        UPDATE users 
        SET password_reset_token = NULL, password_reset_expires_at = NULL
        WHERE id = $1
      `;
            await pool.query(sql, [id]);

            logger.info(`Password reset token cleared`, { userId: id });
        } catch (error) {
            logger.error(`Failed to clear reset token: ${error.message}`, {
                userId: id,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Get users by role
     * @param {string} role - User role
     * @param {number} limit - Result limit
     * @param {number} offset - Result offset
     * @returns {Promise<Array>} Array of users
     */
    static async findByRole(role, limit = 50, offset = 0) {
        try {
            const sql = `
        SELECT 
          id, name, email, role, is_active, is_email_verified,
          avatar_url, created_at, last_login_at
        FROM users
        WHERE role = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
            const { rows } = await pool.query(sql, [role, limit, offset]);
            return rows;
        } catch (error) {
            logger.error(`Failed to find users by role: ${error.message}`, {
                role,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Deactivate user account
     * @param {number} id - User ID
     * @returns {Promise<boolean>} Success status
     */
    static async deactivate(id) {
        try {
            const sql = `UPDATE users SET is_active = FALSE WHERE id = $1`;
            const result = await pool.query(sql, [id]);

            logger.warn(`User account deactivated`, { userId: id });

            return result.rowCount > 0;
        } catch (error) {
            logger.error(`Failed to deactivate user: ${error.message}`, {
                userId: id,
                error: error.stack,
            });
            throw error;
        }
    }

    /**
     * Activate user account
     * @param {number} id - User ID
     * @returns {Promise<boolean>} Success status
     */
    static async activate(id) {
        try {
            const sql = `UPDATE users SET is_active = TRUE WHERE id = $1`;
            const result = await pool.query(sql, [id]);

            logger.info(`User account activated`, { userId: id });

            return result.rowCount > 0;
        } catch (error) {
            logger.error(`Failed to activate user: ${error.message}`, {
                userId: id,
                error: error.stack,
            });
            throw error;
        }
    }
}

module.exports = UserRepository;
