import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './db.js';
import authRouter from './routes/auth.js';
import tasksRouter from './routes/tasks.js';
import habitsRouter from './routes/habits.js';
import workoutsRouter from './routes/workouts.js';
import transactionsRouter from './routes/transactions.js';
import goalsRouter from './routes/goals.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ─── Routes ────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/habits', habitsRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/goals', goalsRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── Serve React in production ─────────────────────────
app.use(express.static(join(__dirname, '..', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

// ─── Start ─────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Life Tracker API running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Database init failed:', err);
  process.exit(1);
});
