const { z } = require('zod');
const { pool } = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const createTripSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  start_date: z.string().date().optional().or(z.string().length(0)),
  end_date: z.string().date().optional().or(z.string().length(0)),
  start_point_name: z.string().optional(),
  start_lat: z.number().optional(),
  start_lng: z.number().optional(),
  end_point_name: z.string().optional(),
  end_lat: z.number().optional(),
  end_lng: z.number().optional(),
  total_members: z.number().int().min(1).optional(),
  relation_type: z.string().optional(),
  planned_budget_amt: z.number().optional(),
  planned_budget_ccy: z.string().length(3).optional()
});

const createTrip = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const b = createTripSchema.parse(req.body);

  const q = `
    INSERT INTO trip (
      owner_id, title, description, start_date, end_date,
      start_point_name, start_lat, start_lng,
      end_point_name, end_lat, end_lng,
      total_members, relation_type, planned_budget_amt, planned_budget_ccy
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    RETURNING *`;
  const p = [
    userId, b.title, b.description ?? null, b.start_date || null, b.end_date || null,
    b.start_point_name || null, b.start_lat ?? null, b.start_lng ?? null,
    b.end_point_name || null, b.end_lat ?? null, b.end_lng ?? null,
    b.total_members ?? 1, b.relation_type || null, b.planned_budget_amt ?? null, (b.planned_budget_ccy || 'USD').toUpperCase()
  ];
  const { rows } = await pool.query(q, p);
  res.status(201).json(rows[0]);
});

const listMyTrips = asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM trip WHERE owner_id = $1 ORDER BY created_at DESC', [req.user.id]);
  res.json(rows);
});

const getTrip = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const { rows } = await pool.query('SELECT * FROM trip WHERE id = $1 AND owner_id = $2', [tripId, req.user.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Trip not found' });
  res.json(rows[0]);
});

const patchTrip = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  // simple patch: only title/description for brevity
  const { title, description } = req.body;
  const { rows } = await pool.query(
    `UPDATE trip SET title = COALESCE($1, title), description = COALESCE($2, description), updated_at = now()
     WHERE id = $3 AND owner_id = $4 RETURNING *`,
    [title ?? null, description ?? null, tripId, req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Trip not found or not owned' });
  res.json(rows[0]);
});

const deleteTrip = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const { rowCount } = await pool.query('DELETE FROM trip WHERE id = $1 AND owner_id = $2', [tripId, req.user.id]);
  if (!rowCount) return res.status(404).json({ error: 'Trip not found or not owned' });
  res.status(204).send();
});

module.exports = { createTrip, listMyTrips, getTrip, patchTrip, deleteTrip };
