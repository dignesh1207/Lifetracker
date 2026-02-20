import { Router } from 'express';
import pool from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at ASC',
    [req.user.id]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { title, target = 10, current = 0, unit = 'sessions', period = 'week', goal_type = 'periodic', color = '#00E5A0' } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO goals (user_id, title, target, current, unit, period, goal_type, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [req.user.id, title, target, current, unit, period, goal_type, color]
  );
  res.status(201).json(rows[0]);
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const check = await pool.query('SELECT id FROM goals WHERE id = $1 AND user_id = $2', [id, req.user.id]);
  if (check.rows.length === 0) return res.status(404).json({ error: 'Not found' });

  const fields = ['title', 'target', 'current', 'unit', 'period', 'goal_type', 'color'];
  for (const f of fields) {
    if (req.body[f] !== undefined) {
      await pool.query(`UPDATE goals SET ${f} = $1 WHERE id = $2`, [req.body[f], id]);
    }
  }
  const { rows } = await pool.query('SELECT * FROM goals WHERE id = $1', [id]);
  res.json(rows[0]);
});

router.patch('/:id/increment', async (req, res) => {
  const { amount = 1 } = req.body;
  await pool.query(
    'UPDATE goals SET current = GREATEST(0, current + $1) WHERE id = $2 AND user_id = $3',
    [amount, req.params.id, req.user.id]
  );
  const { rows } = await pool.query('SELECT * FROM goals WHERE id = $1', [req.params.id]);
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM goals WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

export default router;
