/**
 * Run this to test the DB connection independently:
 *   node scripts/test-db-connection.js
 */
require('dotenv').config();
const dns = require('dns');
const { Client } = require('pg');

// Force IPv4 — Supabase DB host only resolves to IPv6 on some ISPs (e.g. Reliance)
dns.setDefaultResultOrder('ipv4first');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('❌ DATABASE_URL is not set in .env');
    process.exit(1);
}

console.log('\n🔍 Testing DB connection via DATABASE_URL:');
console.log(' ', connectionString.replace(/:([^:@]+)@/, ':(hidden)@'));
console.log('');

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
});

client.connect()
    .then(() => {
        console.log('✅ Connected successfully!\n');
        return client.query('SELECT NOW() AS now, current_user AS db_user, current_database() AS db_name');
    })
    .then(res => {
        const row = res.rows[0];
        console.log('  Server time :', row.now);
        console.log('  Connected as:', row.db_user);
        console.log('  Database    :', row.db_name);
        console.log('\n🎉 DB credentials are working!\n');
    })
    .catch(err => {
        console.error('❌ Connection FAILED:', err.message);
        if (err.message.includes('Tenant or user not found')) {
            console.error('\n  ⚠  PgBouncer error — project may have no pooler configured.');
            console.error('     Switch to the direct connection string from Supabase dashboard.\n');
        } else if (err.message.includes('password authentication failed')) {
            console.error('\n  ⚠  Wrong password. Reset at: Supabase Dashboard → Settings → Database\n');
        } else if (err.message.includes('ENOTFOUND')) {
            console.error('\n  ⚠  DNS failed even with ipv4first — check your internet connection.\n');
        } else if (err.message.includes('self-signed')) {
            console.error('\n  ⚠  SSL error — ssl: rejectUnauthorized should be false.\n');
        }
    })
    .finally(() => client.end());
