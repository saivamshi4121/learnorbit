require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const run = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'system', // Falling back to default if not in env
        database: process.env.DB_NAME || 'cyberorbit365', // Using DB name from env
        multipleStatements: true
    });

    try {
        const sql = fs.readFileSync(path.join(__dirname, '../sql/fix_auth_tables.sql'), 'utf8');
        await connection.query(sql);
        console.log('✅ Auth tables fixed successfully');
    } catch (err) {
        console.error('❌ Error fixing tables:', err);
    } finally {
        await connection.end();
    }
};

run();
