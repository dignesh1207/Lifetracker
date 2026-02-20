import { Router } from 'express';
import pool from '../db.js';
import { auth } from '../middleware/auth.js';
const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
  const habits = await pool.query('SELECT * FROM habits WHERE user_id=$1 ORDER BY created_at ASC', [req.user.id]);
  const logs = await pool.query('SELECT * FROM habit_log WHERE user_id=$1', [req.user.id]);
  res.json({ habits: habits.rows, logs: logs.rows });
});
router.post('/', async (req, res) => {
  const { title, icon='✦' } = req.body;
  const { rows } = await pool.query('INSERT INTO habits (user_id,title,icon) VALUES ($1,$2,$3) RETURNING *', [req.user.id, title, icon]);
  res.status(201).json(rows[0]);
});
router.post('/toggle', async (req, res) => {
  const { habit_id, date } = req.body;
  const c = await pool.query('SELECT id FROM habits WHERE id=$1 AND user_id=$2', [habit_id, req.user.id]);
  if (!c.rows.length) return res.status(404).json({ error: 'Not found' });
  const ex = await pool.query('SELECT id FROM habit_log WHERE habit_id=$1 AND date=$2', [habit_id, date]);
  if (ex.rows.length) { await pool.query('DELETE FROM habit_log WHERE habit_id=$1 AND date=$2', [habit_id, date]); res.json({ toggled: false }); }
  else { await pool.query('INSERT INTO habit_log (habit_id,user_id,date) VALUES ($1,$2,$3)', [habit_id, req.user.id, date]); res.json({ toggled: true }); }
});
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM habit_log WHERE habit_id=$1', [req.params.id]);
  await pool.query('DELETE FROM habits WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ success: true });
});
export default router;
