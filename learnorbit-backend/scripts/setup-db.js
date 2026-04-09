/**
 * LearnOrbit – Database Setup & Seed Script
 *
 * Creates all tables (LMS + Institute schemas) and seeds default accounts.
 *
 * Usage:
 *   node scripts/setup-db.js
 */
require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const { Client } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const SALT_ROUNDS = 10;

const SEED_USERS = [
    { name: 'Super Admin', email: 'superadmin@learnorbit.com', password: 'SuperAdmin@1234', role: 'super_admin' },
    { name: 'Admin User', email: 'admin@learnorbit.com', password: 'Admin@1234', role: 'admin' },
    { name: 'Instructor User', email: 'instructor@learnorbit.com', password: 'Instructor@1234', role: 'instructor' },
];

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
    });

    console.log('\n🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    // ── 1. Drop & recreate core LMS tables ────────────────────
    console.log('📦 Rebuilding LMS schema...');
    try {
        await client.query(
            `DROP TABLE IF EXISTS
                lesson_progress, enrollments, lessons, courses,
                institute_course_access, institute_students,
                institute_course_content, institute_courses,
                institutes, refresh_tokens, users
             CASCADE`
        );
        console.log('  ✅ Dropped all existing tables');
    } catch (e) {
        console.warn('  ⚠️  Drop warning:', e.message.split('\n')[0]);
    }

    const lmsSql = fs.readFileSync(
        path.join(__dirname, '../migrations/lms_schema.sql'), 'utf8'
    );
    await client.query(lmsSql);
    console.log('  ✅ LMS schema created\n');

    // ── 2. Institute schema ────────────────────────────────────
    console.log('🏛️  Applying institute schema...');
    const instSql = fs.readFileSync(
        path.join(__dirname, '../migrations/institute_schema.sql'), 'utf8'
    );
    await client.query(instSql);

    // Add FK from users.institute_id → institutes.id (after both tables exist)
    await client.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.table_constraints
                WHERE constraint_name = 'fk_users_institute'
            ) THEN
                ALTER TABLE users
                ADD CONSTRAINT fk_users_institute
                FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE SET NULL;
            END IF;
        END $$;
    `);
    console.log('  ✅ Institute schema created\n');

    // ── 3. Seed users ──────────────────────────────────────────
    console.log('👤 Seeding default users...\n');
    for (const u of SEED_USERS) {
        const existing = await client.query(
            'SELECT id FROM users WHERE email = $1', [u.email]
        );
        if (existing.rows.length > 0) {
            console.log(`  ⏭  ${u.role.toUpperCase()} already exists: ${u.email}`);
            continue;
        }
        const passwordHash = await bcrypt.hash(u.password, SALT_ROUNDS);
        const result = await client.query(
            `INSERT INTO users (name, email, password_hash, role, is_active, is_email_verified)
             VALUES ($1, $2, $3, $4, TRUE, TRUE) RETURNING id`,
            [u.name, u.email, passwordHash, u.role]
        );
        console.log(`  ✅ Created ${u.role.toUpperCase()}: ${u.email} (id=${result.rows[0].id})`);
        console.log(`     Password: ${u.password}`);
    }

    console.log('\n🎉 Database setup complete!\n');
    console.log('  Accounts:');
    console.log('  ┌─────────────────────────────────────────────────┐');
    console.log('  │  Super Admin: superadmin@learnorbit.com          │');
    console.log('  │  Password:    SuperAdmin@1234                    │');
    console.log('  ├─────────────────────────────────────────────────┤');
    console.log('  │  Admin:       admin@learnorbit.com               │');
    console.log('  │  Password:    Admin@1234                         │');
    console.log('  ├─────────────────────────────────────────────────┤');
    console.log('  │  Instructor:  instructor@learnorbit.com          │');
    console.log('  │  Password:    Instructor@1234                    │');
    console.log('  └─────────────────────────────────────────────────┘\n');

    await client.end();
}

main().catch(err => {
    console.error('\n❌ Setup failed:', err.message);
    process.exit(1);
});
