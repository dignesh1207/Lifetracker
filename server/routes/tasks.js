import { Router } from 'express';
import pool from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// ALL routes require login
router.use(auth);

// GET — only YOUR tasks
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY done ASC, created_at DESC',
    [req.user.id]
  );
  res.json(rows);
});

// POST — creates task for YOU
router.post('/', async (req, res) => {
  const { title, priority = 'med', due = null } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO tasks (user_id, title, priority, due) VALUES ($1, $2, $3, $4) RETURNING *',
    [req.user.id, title, priority, due]
  );
  res.status(201).json(rows[0]);
});

// PATCH — only if it's YOUR task
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { done, title, priority } = req.body;

  // Verify ownership
  const check = await pool.query('SELECT id FROM tasks WHERE id = $1 AND user_id = $2', [id, req.user.id]);
  if (check.rows.length === 0) return res.status(404).json({ error: 'Not found' });

  if (done !== undefined) await pool.query('UPDATE tasks SET done = $1 WHERE id = $2', [done, id]);
  if (title) await pool.query('UPDATE tasks SET title = $1 WHERE id = $2', [title, id]);
  if (priority) await pool.query('UPDATE tasks SET priority = $1 WHERE id = $2', [priority, id]);

  const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  res.json(rows[0]);
});

// DELETE — only YOUR task
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

export default router;
