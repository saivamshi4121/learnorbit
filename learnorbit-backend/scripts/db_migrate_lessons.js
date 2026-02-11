require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const run = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'system',
        database: process.env.DB_NAME || 'cyberorbit365', // Using correct DB name
        multipleStatements: true
    });

    // List of migrations to run
    const migrations = [
        '../sql/lessons_migration.sql', // Create table if not exists with new schema
        '../sql/lessons_alter_provider.sql' // Alter if exists (might fail if columns exist, handle gracefully)
    ];

    for (const file of migrations) {
        try {
            console.log(`Running migration: ${file}`);
            const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
            await connection.query(sql);
            console.log(`✅ ${file} executed successfully`);
        } catch (err) {
            console.error(`⚠️ Error executing ${file}:`, err.message);
            // Continue if fails (e.g., column already exists)
        }
    }

    await connection.end();
};

run();
