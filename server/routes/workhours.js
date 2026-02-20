import { Router } from 'express';
import pool from '../db.js';
import { auth } from '../middleware/auth.js';
const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM work_hours WHERE user_id=$1 ORDER BY date DESC, created_at DESC', [req.user.id]);
  res.json(rows);
});
router.post('/', async (req, res) => {
  const { place, hours, date, notes='' } = req.body;
  const { rows } = await pool.query('INSERT INTO work_hours (user_id,place,hours,date,notes) VALUES ($1,$2,$3,$4,$5) RETURNING *', [req.user.id, place, hours, date, notes]);
  res.status(201).json(rows[0]);
});
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM work_hours WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ success: true });
});
export default router;
