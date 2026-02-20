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
import workhoursRouter from './routes/workhours.js';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/habits', habitsRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/workhours', workhoursRouter);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(express.static(join(__dirname, '..', 'dist')));
app.get('*', (req, res) => res.sendFile(join(__dirname, '..', 'dist', 'index.html')));

initDB().then(() => app.listen(PORT, () => console.log(`✅ Server on port ${PORT}`))).catch(e => { console.error(e); process.exit(1); });
