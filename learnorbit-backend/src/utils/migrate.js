const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Runs the marketing table auto-migration using the shared database pool.
 *
 * Uses the Session pooler (port 5432) which supports multi-statement queries,
 * so we can send the entire SQL file in one go — no splitting needed.
 *
 * Non-throwing — a failed migration logs a warning but does NOT crash the server.
 */
async function runAutoMigration() {
    const pool = require('../config/database');

    const sqlPath = path.join(__dirname, '../../migrations/init.sql');
    if (!fs.existsSync(sqlPath)) {
        logger.warn('Migration file not found: ' + sqlPath);
        return;
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    logger.info('Running auto-migration for PostgreSQL tables...');

    let client;
    try {
        client = await pool.connect();
        await client.query(sql);
        logger.info('Auto-migration completed successfully.');
    } catch (err) {
        logger.warn('Auto-migration warning (tables may already exist): ' + err.message.split('\n')[0]);
    } finally {
        if (client) client.release();
    }
}

module.exports = runAutoMigration;
