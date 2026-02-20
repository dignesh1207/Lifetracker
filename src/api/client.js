const BASE = '/api';
function getToken() { return localStorage.getItem('token'); }
async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    credentials: 'include', ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (res.status === 401) { localStorage.removeItem('token'); window.location.reload(); throw new Error('Unauthorized'); }
  if (!res.ok) { const e = await res.json().catch(() => ({ error: 'Failed' })); throw new Error(e.error || 'Failed'); }
  return res.json();
}
const api = {
  signup: (d) => request('/auth/signup', { method: 'POST', body: d }),
  login: (d) => request('/auth/login', { method: 'POST', body: d }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  getTasks: () => request('/tasks'),
  addTask: (d) => request('/tasks', { method: 'POST', body: d }),
  updateTask: (id, d) => request(`/tasks/${id}`, { method: 'PATCH', body: d }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  getHabits: () => request('/habits'),
  addHabit: (d) => request('/habits', { method: 'POST', body: d }),
  toggleHabit: (hid, date) => request('/habits/toggle', { method: 'POST', body: { habit_id: hid, date } }),
  deleteHabit: (id) => request(`/habits/${id}`, { method: 'DELETE' }),
  getWorkouts: () => request('/workouts'),
  addWorkout: (d) => request('/workouts', { method: 'POST', body: d }),
  deleteWorkout: (id) => request(`/workouts/${id}`, { method: 'DELETE' }),
  getTransactions: () => request('/transactions'),
  addTransaction: (d) => request('/transactions', { method: 'POST', body: d }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
  getGoals: () => request('/goals'),
  addGoal: (d) => request('/goals', { method: 'POST', body: d }),
  updateGoal: (id, d) => request(`/goals/${id}`, { method: 'PATCH', body: d }),
  incrementGoal: (id, amt) => request(`/goals/${id}/increment`, { method: 'PATCH', body: { amount: amt } }),
  deleteGoal: (id) => request(`/goals/${id}`, { method: 'DELETE' }),
  getWorkHours: () => request('/workhours'),
  addWorkHour: (d) => request('/workhours', { method: 'POST', body: d }),
  deleteWorkHour: (id) => request(`/workhours/${id}`, { method: 'DELETE' }),
};
export default api;
