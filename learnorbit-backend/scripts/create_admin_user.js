/**
 * Create Admin User Script
 * 
 * This script creates an admin user in the database
 * 
 * Admin Credentials:
 * Email: admin@learnorbit.com
 * Password: Admin@123
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const ADMIN_CREDENTIALS = {
    email: 'admin@learnorbit.com',
    password: 'Admin@123',
    name: 'Admin User',
    role: 'admin'
};

async function createAdminUser() {
    let connection;

    try {
        // Create database connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'cyberorbit365'
        });

        console.log('✅ Connected to database');

        // Check if admin user already exists
        const [existingUsers] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [ADMIN_CREDENTIALS.email]
        );

        if (existingUsers.length > 0) {
            console.log('⚠️  Admin user already exists!');
            console.log('   Email:', ADMIN_CREDENTIALS.email);

            // Update the existing user to admin role
            const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);
            await connection.execute(
                'UPDATE users SET password_hash = ?, role = ?, name = ? WHERE email = ?',
                [hashedPassword, ADMIN_CREDENTIALS.role, ADMIN_CREDENTIALS.name, ADMIN_CREDENTIALS.email]
            );

            console.log('✅ Updated existing user to admin with new password');
        } else {
            // Hash the password
            console.log('🔐 Hashing password...');
            const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);

            // Insert admin user
            console.log('📝 Creating admin user...');
            await connection.execute(
                `INSERT INTO users (name, email, password_hash, role, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, NOW(), NOW())`,
                [ADMIN_CREDENTIALS.name, ADMIN_CREDENTIALS.email, hashedPassword, ADMIN_CREDENTIALS.role]
            );

            console.log('✅ Admin user created successfully!');
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 ADMIN CREDENTIALS');
        console.log('='.repeat(60));
        console.log('Email:    ', ADMIN_CREDENTIALS.email);
        console.log('Password: ', ADMIN_CREDENTIALS.password);
        console.log('='.repeat(60));
        console.log('\n📍 Login at: http://localhost:3000/login');
        console.log('📍 Admin Dashboard: http://localhost:3000/admin/dashboard');
        console.log('\n');

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

// Run the script
createAdminUser();
