-- LearnOrbit LMS - Full PostgreSQL Schema
-- Run this once on a new Supabase project to set up all tables

-- ─────────────────────────────────
-- 1. USERS
-- ─────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                            BIGSERIAL PRIMARY KEY,
  name                          VARCHAR(255) NOT NULL,
  email                         VARCHAR(255) UNIQUE NOT NULL,
  password_hash                 TEXT NOT NULL,
  role                          VARCHAR(20) NOT NULL DEFAULT 'student'
                                  CHECK (role IN ('admin','super_admin','instructor','institute_admin','student')),
  is_active                     BOOLEAN DEFAULT TRUE,
  is_email_verified             BOOLEAN DEFAULT FALSE,
  failed_login_attempts         INT DEFAULT 0,
  locked_until                  TIMESTAMP NULL,
  avatar_url                    TEXT NULL,
  bio                           TEXT NULL,
  phone                         VARCHAR(20) NULL,
  -- Instructor fields
  expertise                     VARCHAR(255) NULL,
  years_of_experience           INT NULL,
  linkedin_url                  VARCHAR(255) NULL,
  -- Student fields
  enrollment_date               DATE NULL,
  student_id                    VARCHAR(50) NULL,
  -- Auth tokens
  email_verification_token      VARCHAR(255) NULL,
  email_verification_expires_at TIMESTAMP NULL,
  password_reset_token          VARCHAR(255) NULL,
  password_reset_expires_at     TIMESTAMP NULL,
  last_login_at                 TIMESTAMP NULL,
  institute_id                  UUID NULL,  -- set for institute_admin users; FK added after institutes table
  created_at                    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at                    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ─────────────────────────────────
-- 2. REFRESH TOKENS
-- ─────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id                BIGSERIAL PRIMARY KEY,
  user_id           BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token             VARCHAR(512) NOT NULL UNIQUE,
  expires_at        TIMESTAMP NOT NULL,
  revoked           BOOLEAN DEFAULT FALSE,
  revoked_at        TIMESTAMP NULL,
  replaced_by_token VARCHAR(512) NULL,
  ip_address        VARCHAR(45) NULL,
  user_agent        TEXT NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);

-- ─────────────────────────────────
-- 3. COURSES
-- ─────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id              BIGSERIAL PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  instructor_id   BIGINT REFERENCES users(id) ON DELETE SET NULL,
  price           NUMERIC(10,2) DEFAULT 0,
  thumbnail_url   TEXT NULL,
  is_published    BOOLEAN DEFAULT FALSE,
  category        VARCHAR(100) NULL,
  level           VARCHAR(20) DEFAULT 'beginner'
                    CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_hours  NUMERIC(5,1) NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_published  ON courses(is_published);

-- ─────────────────────────────────
-- 4. LESSONS
-- ─────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id          BIGSERIAL PRIMARY KEY,
  course_id   BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  type        VARCHAR(20) NOT NULL DEFAULT 'video'
                CHECK (type IN ('video', 'text', 'pdf', 'external')),
  content     TEXT NULL,        -- markdown text OR video/pdf URL
  provider    VARCHAR(50) NULL, -- 'youtube', 'vimeo', 'mp4', 'external'
  embed_url   TEXT NULL,        -- resolved embed URL for videos
  order_index INT DEFAULT 0,
  is_deleted  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);

-- ─────────────────────────────────
-- 5. ENROLLMENTS
-- ─────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id   BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status      VARCHAR(20) DEFAULT 'active'
                CHECK (status IN ('active', 'pending', 'completed', 'cancelled')),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user   ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);

-- ─────────────────────────────────
-- 6. LESSON PROGRESS
-- ─────────────────────────────────
CREATE TABLE IF NOT EXISTS lesson_progress (
  id               BIGSERIAL PRIMARY KEY,
  user_id          BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id        BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed        BOOLEAN DEFAULT FALSE,
  watch_percentage INT DEFAULT 0,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user   ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
