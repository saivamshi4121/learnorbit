-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMs (idempotent via IF NOT EXISTS - Postgres 14.x+)
-- We use a safer pattern: try to create; if schema has it already, it's fine.
-- Instead of DO blocks (which break PgBouncer transaction mode),
-- we create the table first and rely on column types as TEXT with CHECK constraints,
-- OR we rely on Postgres 14+ "CREATE TYPE IF NOT EXISTS" workaround via DO-less approach.

--------------------------------
-- 1️⃣ marketing_waitlist_users
--------------------------------

CREATE TABLE IF NOT EXISTS marketing_waitlist_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'instructor', 'course_creator', 'institute', 'corporate_trainer')),
  current_lms VARCHAR(255),
  frustrations JSONB,
  desired_features JSONB,
  pricing_range VARCHAR(100),
  early_access BOOLEAN DEFAULT false,
  beta_tester BOOLEAN DEFAULT false,
  source VARCHAR(100),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON marketing_waitlist_users(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_role ON marketing_waitlist_users(role);

--------------------------------
-- 2️⃣ marketing_contact_messages
--------------------------------

CREATE TABLE IF NOT EXISTS marketing_contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'replied', 'archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------
-- 3️⃣ marketing_feedback_submissions
--------------------------------

CREATE TABLE IF NOT EXISTS marketing_feedback_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'instructor')),
  biggest_problem TEXT,
  missing_feature TEXT,
  improvement_suggestion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------
-- 4️⃣ audit_logs
--------------------------------

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT NULL,
  event_type VARCHAR(100) NOT NULL,
  ip_address VARCHAR(100) NULL,
  user_agent TEXT NULL,
  details JSONB NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

