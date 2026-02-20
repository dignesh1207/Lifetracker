import { Router } from 'express';
import pool from '../db.js';
import { auth } from '../middleware/auth.js';
const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tasks WHERE user_id=$1 ORDER BY done ASC, created_at DESC', [req.user.id]);
  res.json(rows);
});
router.post('/', async (req, res) => {
  const { title, priority='med', due=null } = req.body;
  const { rows } = await pool.query('INSERT INTO tasks (user_id,title,priority,due) VALUES ($1,$2,$3,$4) RETURNING *', [req.user.id, title, priority, due || null]);
  res.status(201).json(rows[0]);
});
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const c = await pool.query('SELECT id FROM tasks WHERE id=$1 AND user_id=$2', [id, req.user.id]);
  if (!c.rows.length) return res.status(404).json({ error: 'Not found' });
  if (req.body.done !== undefined) await pool.query('UPDATE tasks SET done=$1 WHERE id=$2', [req.body.done, id]);
  if (req.body.title) await pool.query('UPDATE tasks SET title=$1 WHERE id=$2', [req.body.title, id]);
  if (req.body.priority) await pool.query('UPDATE tasks SET priority=$1 WHERE id=$2', [req.body.priority, id]);
  const { rows } = await pool.query('SELECT * FROM tasks WHERE id=$1', [id]);
  res.json(rows[0]);
});
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ success: true });
});
export default router;
