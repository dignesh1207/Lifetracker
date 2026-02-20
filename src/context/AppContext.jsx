import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { nd } from '../styles/theme';

const Ctx = createContext(null);

// Normalize PostgreSQL dates on every row
const fix = (arr, fields = ['date']) => arr.map(r => {
  const c = { ...r };
  fields.forEach(f => { if (c[f]) c[f] = nd(c[f]); });
  // also convert numeric strings from pg decimal
  if (c.amount !== undefined) c.amount = parseFloat(c.amount);
  if (c.target !== undefined) c.target = parseFloat(c.target);
  if (c.current !== undefined) c.current = parseFloat(c.current);
  if (c.hours !== undefined) c.hours = parseFloat(c.hours);
  return c;
});

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [habitLog, setHabitLog] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [workHours, setWorkHours] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [t, h, w, tx, g, wh] = await Promise.all([
        api.getTasks(), api.getHabits(), api.getWorkouts(),
        api.getTransactions(), api.getGoals(), api.getWorkHours().catch(() => []),
      ]);
      setTasks(fix(t, ['due']));
      setHabits(h.habits);
      setHabitLog(fix(h.logs, ['date']));
      setWorkouts(fix(w, ['date']));
      setTransactions(fix(tx, ['date']));
      setGoals(fix(g, []));
      setWorkHours(fix(wh, ['date']));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addTask = async d => { const r = await api.addTask(d); setTasks(p => [fix([r], ['due'])[0], ...p]); };
  const toggleTask = async id => { const t = tasks.find(x => x.id === id); const r = await api.updateTask(id, { done: !t.done }); setTasks(p => p.map(x => x.id === id ? fix([r], ['due'])[0] : x)); };
  const deleteTask = async id => { await api.deleteTask(id); setTasks(p => p.filter(x => x.id !== id)); };

  const addHabit = async d => { const r = await api.addHabit(d); setHabits(p => [...p, r]); };
  const toggleHabit = async (hid, date) => {
    const r = await api.toggleHabit(hid, date);
    if (r.toggled) setHabitLog(p => [...p, { habit_id: hid, date }]);
    else setHabitLog(p => p.filter(l => !(l.habit_id === hid && l.date === date)));
  };
  const deleteHabit = async id => { await api.deleteHabit(id); setHabits(p => p.filter(x => x.id !== id)); setHabitLog(p => p.filter(l => l.habit_id !== id)); };

  const addWorkout = async d => { const r = await api.addWorkout(d); setWorkouts(p => [fix([r], ['date'])[0], ...p]); const g = await api.getGoals(); setGoals(fix(g, [])); };
  const deleteWorkout = async id => { await api.deleteWorkout(id); setWorkouts(p => p.filter(x => x.id !== id)); };

  const addTransaction = async d => { const r = await api.addTransaction(d); setTransactions(p => [fix([r], ['date'])[0], ...p]); };
  const deleteTransaction = async id => { await api.deleteTransaction(id); setTransactions(p => p.filter(x => x.id !== id)); };

  const addGoal = async d => { const r = await api.addGoal(d); setGoals(p => [...p, fix([r], [])[0]]); };
  const updateGoal = async (id, d) => { const r = await api.updateGoal(id, d); setGoals(p => p.map(x => x.id === id ? fix([r], [])[0] : x)); };
  const incrementGoal = async (id, amt) => { const r = await api.incrementGoal(id, amt); setGoals(p => p.map(x => x.id === id ? fix([r], [])[0] : x)); };
  const deleteGoal = async id => { await api.deleteGoal(id); setGoals(p => p.filter(x => x.id !== id)); };

  const addWorkHour = async d => { const r = await api.addWorkHour(d); setWorkHours(p => [fix([r], ['date'])[0], ...p]); };
  const deleteWorkHour = async id => { await api.deleteWorkHour(id); setWorkHours(p => p.filter(x => x.id !== id)); };

  const isHabitDone = (hid, date) => habitLog.some(l => l.habit_id === hid && l.date === date);

  return <Ctx.Provider value={{
    loading, tasks, addTask, toggleTask, deleteTask,
    habits, habitLog, addHabit, toggleHabit, deleteHabit, isHabitDone,
    workouts, addWorkout, deleteWorkout,
    transactions, addTransaction, deleteTransaction,
    goals, addGoal, updateGoal, incrementGoal, deleteGoal,
    workHours, addWorkHour, deleteWorkHour, refresh,
  }}>{children}</Ctx.Provider>;
}

export function useApp() { const c = useContext(Ctx); if (!c) throw new Error('useApp required'); return c; }
