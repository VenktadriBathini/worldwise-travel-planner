const bcrypt = require('bcryptjs');
const { pool } = require('../db/pool');

async function createUser({ email, password, display_name }) {
  const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 10);
  const q = `
    INSERT INTO app_user (email, password_hash, display_name)
    VALUES ($1,$2,$3) RETURNING id, email, display_name, created_at`;
  const { rows } = await pool.query(q, [email, hash, display_name || null]);
  return rows[0];
}

async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM app_user WHERE email = $1', [email]);
  return rows[0];
}

module.exports = { createUser, findUserByEmail };
