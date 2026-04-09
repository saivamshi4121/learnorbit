const { Pool } = require('pg');
require('dotenv').config();
const dns = require('dns');

// Force Node.js to resolve hostnames to IPv4 addresses first.
// Supabase DB hosts (db.*.supabase.co) resolve to IPv6 on some Indian ISPs (e.g. Reliance)
// which don't route IPv6 traffic. This ensures we always get an IPv4 connection.
dns.setDefaultResultOrder('ipv4first');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle DB client:', err.message);
});

module.exports = pool;
