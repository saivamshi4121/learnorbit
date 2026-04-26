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

--------------------------------
-- 5️⃣ events
--------------------------------

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMP,
  location VARCHAR(255),
  image_url TEXT,
  registration_fields JSONB DEFAULT '[]',
  is_paid BOOLEAN DEFAULT false,
  price DECIMAL(10, 2) DEFAULT 0.00,
  qr_code_url TEXT,
  certificate_settings JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------
-- 6️⃣ event_registrations
--------------------------------

CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id INT NULL, -- Optional if guest
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  form_data JSONB NOT NULL,
  payment_screenshot_url TEXT,
  transaction_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, transaction_id)
);

CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON event_registrations(status);

-- Migration for existing tables (Idempotent)
ALTER TABLE events ADD COLUMN IF NOT EXISTS certificate_settings JSONB DEFAULT '{}';
ALTER TABLE events ALTER COLUMN date DROP NOT NULL;



