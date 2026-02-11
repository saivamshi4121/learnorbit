-- Migration to align users table with UserRepository requirements
USE cyberorbit365;

ALTER TABLE users 
RENAME COLUMN password TO password_hash;

ALTER TABLE users
ADD COLUMN is_active TINYINT(1) DEFAULT 1,
ADD COLUMN is_email_verified TINYINT(1) DEFAULT 0,
ADD COLUMN failed_login_attempts INT DEFAULT 0,
ADD COLUMN locked_until TIMESTAMP NULL,
ADD COLUMN avatar_url VARCHAR(255) NULL,
ADD COLUMN bio TEXT NULL,
ADD COLUMN phone VARCHAR(20) NULL,
ADD COLUMN expertise VARCHAR(255) NULL,
ADD COLUMN years_of_experience INT NULL,
ADD COLUMN linkedin_url VARCHAR(255) NULL,
ADD COLUMN enrollment_date DATE NULL,
ADD COLUMN student_id VARCHAR(50) NULL,
ADD COLUMN last_login_at TIMESTAMP NULL,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN email_verification_token VARCHAR(255) NULL,
ADD COLUMN email_verification_expires_at TIMESTAMP NULL,
ADD COLUMN password_reset_token VARCHAR(255) NULL,
ADD COLUMN password_reset_expires_at TIMESTAMP NULL;
