const { pool } = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const addPoint = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  // Ensure ownership
  const t = await pool.query('SELECT 1 FROM trip WHERE id = $1 AND owner_id = $2', [tripId, req.user.id]);
  if (!t.rowCount) return res.status(403).json({ error: 'Not your trip' });

  const { name, lat, lng, arrive_on, notes } = req.body;
  const r1 = await pool.query('SELECT COALESCE(MAX(ordinal), -1) + 1 AS next FROM trip_point WHERE trip_id = $1', [tripId]);
  const ordinal = r1.rows[0].next;

  const { rows } = await pool.query(
    `INSERT INTO trip_point (trip_id, ordinal, name, lat, lng, arrive_on, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [tripId, ordinal, name || null, lat, lng, arrive_on || null, notes || null]
  );
  res.status(201).json(rows[0]);
});

const listPoints = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const t = await pool.query('SELECT 1 FROM trip WHERE id = $1 AND owner_id = $2', [tripId, req.user.id]);
  if (!t.rowCount) return res.status(403).json({ error: 'Not your trip' });
  const { rows } = await pool.query('SELECT * FROM trip_point WHERE trip_id = $1 ORDER BY ordinal ASC', [tripId]);
  res.json(rows);
});

module.exports = { addPoint, listPoints };
