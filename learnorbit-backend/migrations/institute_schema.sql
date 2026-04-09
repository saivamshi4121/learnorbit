-- ================================================================
-- LearnOrbit – Institute Module Schema (PostgreSQL)
-- Multi-tenant: each institute is fully isolated by institute_id
-- ================================================================

-- ─────────────────────────────────────────────────────────────────
-- 1. INSTITUTES  (the organization account)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS institutes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active', 'suspended')),
  created_by   BIGINT REFERENCES users(id) ON DELETE SET NULL,  -- super_admin user
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_institutes_email  ON institutes(email);
CREATE INDEX IF NOT EXISTS idx_institutes_status ON institutes(status);

-- ─────────────────────────────────────────────────────────────────
-- 2. INSTITUTE_COURSES
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS institute_courses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institute_id     UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
  title            VARCHAR(255) NOT NULL,
  description      TEXT,
  visibility_type  VARCHAR(20) NOT NULL DEFAULT 'private'
                     CHECK (visibility_type IN ('public','private','selected')),
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_icourses_institute  ON institute_courses(institute_id);
CREATE INDEX IF NOT EXISTS idx_icourses_visibility ON institute_courses(visibility_type);

-- ─────────────────────────────────────────────────────────────────
-- 3. INSTITUTE_COURSE_CONTENT  (ordered content items per course)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS institute_course_content (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id    UUID NOT NULL REFERENCES institute_courses(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  content_type VARCHAR(20) NOT NULL
                 CHECK (content_type IN ('video','pdf','document','link','iframe')),
  content_url  TEXT NOT NULL,   -- any http/https URL, stored as-is
  order_index  INT  NOT NULL DEFAULT 0,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_icontent_course ON institute_course_content(course_id);
CREATE INDEX IF NOT EXISTS idx_icontent_order  ON institute_course_content(course_id, order_index);

-- ─────────────────────────────────────────────────────────────────
-- 4. INSTITUTE_STUDENTS  (students enrolled in an institute)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS institute_students (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institute_id UUID   NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
  user_id      BIGINT NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (institute_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_istudents_institute ON institute_students(institute_id);
CREATE INDEX IF NOT EXISTS idx_istudents_user      ON institute_students(user_id);

-- ─────────────────────────────────────────────────────────────────
-- 5. INSTITUTE_COURSE_ACCESS  (per-course access grants / invites)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS institute_course_access (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id      UUID   NOT NULL REFERENCES institute_courses(id) ON DELETE CASCADE,
  student_id     BIGINT REFERENCES users(id) ON DELETE CASCADE,      -- NULL if not yet registered
  invited_email  VARCHAR(255),                                        -- for pending invites
  access_status  VARCHAR(20) NOT NULL DEFAULT 'pending'
                   CHECK (access_status IN ('pending','active','revoked')),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- A student can only have one active grant per course
  UNIQUE (course_id, student_id),
  -- email invite uniqueness per course
  UNIQUE (course_id, invited_email),
  -- at least one of student_id or invited_email must be set
  CHECK (student_id IS NOT NULL OR invited_email IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_iaccess_course   ON institute_course_access(course_id);
CREATE INDEX IF NOT EXISTS idx_iaccess_student  ON institute_course_access(student_id);
CREATE INDEX IF NOT EXISTS idx_iaccess_email    ON institute_course_access(invited_email);
CREATE INDEX IF NOT EXISTS idx_iaccess_status   ON institute_course_access(access_status);
