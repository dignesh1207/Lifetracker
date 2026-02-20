import { Router } from 'express';
import pool from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
    [req.user.id]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { title, amount, category = 'Other', type = 'expense', date } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO transactions (user_id, title, amount, category, type, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [req.user.id, title, amount, category, type, date]
  );
  res.status(201).json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

export default router;
