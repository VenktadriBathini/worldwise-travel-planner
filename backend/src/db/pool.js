// Ensure .env is loaded even if someone imports this before server.js
require('dotenv').config();

const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Check your .env or process env.');
}

// Optional: quick masked log to confirm which DB you’re hitting
const masked = process.env.DATABASE_URL.replace(/:\/\/([^:]+):[^@]+@/, '://$1:****@');
console.log('PG connecting:', masked);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false } // uncomment if your provider requires SSL
});

pool.on('error', (err) => console.error('PG Pool error', err));

module.exports = { pool };
