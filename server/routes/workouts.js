import { Router } from 'express';
import pool from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM workouts WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
    [req.user.id]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { type, duration = 0, calories = 0, notes = '', date } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO workouts (user_id, type, duration, calories, notes, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [req.user.id, type, duration, calories, notes, date]
  );

  // Auto-increment milestone goals
  await pool.query(
    "UPDATE goals SET current = current + 1 WHERE user_id = $1 AND goal_type = 'milestone' AND unit = 'workouts'",
    [req.user.id]
  );

  res.status(201).json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM workouts WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

export default router;
