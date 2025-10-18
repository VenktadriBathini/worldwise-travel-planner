const { pool } = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const createSavedPlace = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { pointId } = req.params;
  // ensure point belongs to user's trip
  const p = await pool.query(
    `SELECT tp.id FROM trip_point tp
     JOIN trip t ON t.id = tp.trip_id
     WHERE tp.id = $1 AND t.owner_id = $2`,
    [pointId, userId]
  );
  if (!p.rowCount) return res.status(403).json({ error: 'Not your trip point' });

  const { name, category, lat, lng, address, url, locked_cost_amt, locked_cost_ccy, notes } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO saved_place
      (trip_point_id, user_id, name, category, lat, lng, address, url, locked_cost_amt, locked_cost_ccy, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,COALESCE($10,'USD'),$11)
     RETURNING *`,
    [pointId, userId, name, category || null, lat ?? null, lng ?? null, address || null, url || null,
      locked_cost_amt ?? null, (locked_cost_ccy || 'USD').toUpperCase(), notes || null]
  );
  res.status(201).json(rows[0]);
});

const listSavedPlaces = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { pointId } = req.params;
  // authorize like above
  const p = await pool.query(
    `SELECT 1 FROM trip_point tp JOIN trip t ON t.id = tp.trip_id WHERE tp.id = $1 AND t.owner_id = $2`,
    [pointId, userId]
  );
  if (!p.rowCount) return res.status(403).json({ error: 'Not your trip point' });

  const { rows } = await pool.query(
    'SELECT * FROM saved_place WHERE trip_point_id = $1 AND user_id = $2 ORDER BY created_at DESC',
    [pointId, userId]
  );
  res.json(rows);
});

module.exports = { createSavedPlace, listSavedPlaces };
