import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [habitLog, setHabitLog] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Load all data on mount ────────────────────────
  const refresh = useCallback(async () => {
    try {
      const [t, h, w, tx, g] = await Promise.all([
        api.getTasks(),
        api.getHabits(),
        api.getWorkouts(),
        api.getTransactions(),
        api.getGoals(),
      ]);
      setTasks(t);
      setHabits(h.habits);
      setHabitLog(h.logs);
      setWorkouts(w);
      setTransactions(tx);
      setGoals(g);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ─── Task Actions ──────────────────────────────────
  const addTask = async (data) => {
    const task = await api.addTask(data);
    setTasks((prev) => [task, ...prev]);
  };
  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    const updated = await api.updateTask(id, { done: !task.done });
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };
  const deleteTask = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ─── Habit Actions ─────────────────────────────────
  const addHabit = async (data) => {
    const habit = await api.addHabit(data);
    setHabits((prev) => [...prev, habit]);
  };
  const toggleHabit = async (habitId, date) => {
    const result = await api.toggleHabit(habitId, date);
    if (result.toggled) {
      setHabitLog((prev) => [...prev, { habit_id: habitId, date }]);
    } else {
      setHabitLog((prev) => prev.filter((l) => !(l.habit_id === habitId && l.date === date)));
    }
  };
  const deleteHabit = async (id) => {
    await api.deleteHabit(id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setHabitLog((prev) => prev.filter((l) => l.habit_id !== id));
  };

  // ─── Workout Actions ───────────────────────────────
  const addWorkout = async (data) => {
    const workout = await api.addWorkout(data);
    setWorkouts((prev) => [workout, ...prev]);
    // Refresh goals (milestone may have incremented)
    const g = await api.getGoals();
    setGoals(g);
  };
  const deleteWorkout = async (id) => {
    await api.deleteWorkout(id);
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  // ─── Transaction Actions ───────────────────────────
  const addTransaction = async (data) => {
    const tx = await api.addTransaction(data);
    setTransactions((prev) => [tx, ...prev]);
  };
  const deleteTransaction = async (id) => {
    await api.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // ─── Goal Actions ──────────────────────────────────
  const addGoal = async (data) => {
    const goal = await api.addGoal(data);
    setGoals((prev) => [...prev, goal]);
  };
  const updateGoal = async (id, data) => {
    const goal = await api.updateGoal(id, data);
    setGoals((prev) => prev.map((g) => (g.id === id ? goal : g)));
  };
  const incrementGoal = async (id, amount) => {
    const goal = await api.incrementGoal(id, amount);
    setGoals((prev) => prev.map((g) => (g.id === id ? goal : g)));
  };
  const deleteGoal = async (id) => {
    await api.deleteGoal(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // ─── Helper: check habit log ───────────────────────
  const isHabitDone = (habitId, date) => {
    return habitLog.some((l) => l.habit_id === habitId && l.date === date);
  };

  const value = {
    loading,
    tasks, addTask, toggleTask, deleteTask,
    habits, habitLog, addHabit, toggleHabit, deleteHabit, isHabitDone,
    workouts, addWorkout, deleteWorkout,
    transactions, addTransaction, deleteTransaction,
    goals, addGoal, updateGoal, incrementGoal, deleteGoal,
    refresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
