const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.reload();
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

const api = {
  // Auth
  signup: (data) => request('/auth/signup', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),

  // Tasks
  getTasks: () => request('/tasks'),
  addTask: (data) => request('/tasks', { method: 'POST', body: data }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PATCH', body: data }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),

  // Habits
  getHabits: () => request('/habits'),
  addHabit: (data) => request('/habits', { method: 'POST', body: data }),
  toggleHabit: (habit_id, date) => request('/habits/toggle', { method: 'POST', body: { habit_id, date } }),
  deleteHabit: (id) => request(`/habits/${id}`, { method: 'DELETE' }),

  // Workouts
  getWorkouts: () => request('/workouts'),
  addWorkout: (data) => request('/workouts', { method: 'POST', body: data }),
  deleteWorkout: (id) => request(`/workouts/${id}`, { method: 'DELETE' }),

  // Transactions
  getTransactions: () => request('/transactions'),
  addTransaction: (data) => request('/transactions', { method: 'POST', body: data }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),

  // Goals
  getGoals: () => request('/goals'),
  addGoal: (data) => request('/goals', { method: 'POST', body: data }),
  updateGoal: (id, data) => request(`/goals/${id}`, { method: 'PATCH', body: data }),
  incrementGoal: (id, amount) => request(`/goals/${id}/increment`, { method: 'PATCH', body: { amount } }),
  deleteGoal: (id) => request(`/goals/${id}`, { method: 'DELETE' }),
};

export default api;
