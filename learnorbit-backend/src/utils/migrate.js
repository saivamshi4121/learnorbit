const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const logger = require('./logger');

async function runAutoMigration() {
    let connection;
    try {
        const sqlPath = path.join(__dirname, '../../sql/create_marketing_tables.sql');
        if (!fs.existsSync(sqlPath)) {
            logger.warn('Migration file not found: ' + sqlPath);
            return;
        }

        const sql = fs.readFileSync(sqlPath, 'utf8');
        logger.info('Running auto-migration for marketing tables...');

        // Connect specifically for migration with multipleStatements enabled
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : undefined,
            multipleStatements: true
        });

        await connection.query(sql);
        logger.info('Auto-migration completed successfully.');

    } catch (error) {
        logger.error('Auto-migration failed: ' + error.message);
    } finally {
        if (connection) await connection.end();
    }
}

module.exports = runAutoMigration;
