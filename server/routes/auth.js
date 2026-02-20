import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { auth } from '../middleware/auth.js';
const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, password, display_name } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    if (username.length < 3) return res.status(400).json({ error: 'Username min 3 chars' });
    if (password.length < 6) return res.status(400).json({ error: 'Password min 6 chars' });
    const ex = await pool.query('SELECT id FROM users WHERE username=$1', [username.toLowerCase()]);
    if (ex.rows.length > 0) return res.status(400).json({ error: 'Username taken' });
    const hash = await bcrypt.hash(password, 10);
    const r = await pool.query('INSERT INTO users (username,password_hash,display_name) VALUES ($1,$2,$3) RETURNING id,username,display_name', [username.toLowerCase(), hash, display_name || username]);
    const user = r.rows[0];
    await pool.query(`INSERT INTO habits (user_id,title,icon) VALUES ($1,'Drink 8 glasses water','💧'),($1,'Read 20 minutes','📖'),($1,'Meditate','🧘')`, [user.id]);
    await pool.query(`INSERT INTO goals (user_id,title,target,current,unit,period,goal_type,color) VALUES ($1,'Complete 100 workouts',100,0,'workouts','','milestone','#00E5A0'),($1,'Weekly workouts',5,0,'sessions','week','periodic','#38BDF8')`, [user.id]);
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 30*24*60*60*1000 });
    res.status(201).json({ user, token });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    const r = await pool.query('SELECT * FROM users WHERE username=$1', [username.toLowerCase()]);
    if (!r.rows.length) return res.status(401).json({ error: 'Invalid username or password' });
    const user = r.rows[0];
    if (!(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ error: 'Invalid username or password' });
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 30*24*60*60*1000 });
    res.json({ user: { id: user.id, username: user.username, display_name: user.display_name }, token });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.post('/logout', (req, res) => { res.clearCookie('token'); res.json({ success: true }); });

router.get('/me', auth, async (req, res) => {
  const r = await pool.query('SELECT id,username,display_name,created_at FROM users WHERE id=$1', [req.user.id]);
  if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(r.rows[0]);
});

export default router;
