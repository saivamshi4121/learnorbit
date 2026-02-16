const pool = require('../src/config/db');

async function checkTable() {
    try {
        const [rows] = await pool.query('DESCRIBE marketing_waitlist_users');
        console.log('Table schema for marketing_waitlist_users:');
        rows.forEach(row => {
            console.log(`${row.Field} (${row.Type})`);
        });
    } catch (error) {
        console.error('Error describing table:', error);
    } finally {
        process.exit();
    }
}

checkTable();
