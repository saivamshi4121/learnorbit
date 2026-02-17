const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('Testing DB Payload with SSL...');
    const ssl = { rejectUnauthorized: false };

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: ssl
        });
        console.log('Connected successfully with SSL!');
        await connection.end();
    } catch (error) {
        console.error('Failed with SSL:', error.message);
    }

    console.log('Testing DB Payload without SSL...');
    try {
        const connection2 = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
            // no ssl
        });
        console.log('Connected successfully without SSL!');
        await connection2.end();
    } catch (error) {
        console.error('Failed without SSL:', error.message);
    }
}

testConnection();
