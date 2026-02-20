import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Nav, { TABS } from './components/Nav';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import Fitness from './pages/Fitness';
import WorkHours from './pages/WorkHours';
import Finance from './pages/Finance';
import Goals from './pages/Goals';
import api from './api/client';
import { ACCENT, DIM, DIM3, MONO } from './styles/theme';

function AppContent({ user, onLogout }) {
  const { loading, habits, habitLog } = useApp();
  const [tab, setTab] = useState('dash');

  let streak = 0;
  if (habits.length > 0) {
    const d = new Date();
    while (true) {
      const ds = d.toISOString().split('T')[0];
      if (habits.every(h => habitLog.some(l => l.habit_id === h.id && l.date === ds))) { streak++; d.setDate(d.getDate()-1); } else break;
    }
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><div style={{ color: ACCENT, fontSize: 15, fontFamily: MONO, letterSpacing: 3, fontWeight: 600 }}>LOADING...</div></div>;

  const page = () => { switch(tab) { case 'dash': return <Dashboard/>; case 'tasks': return <Tasks/>; case 'habits': return <Habits/>; case 'fitness': return <Fitness/>; case 'work': return <WorkHours/>; case 'finance': return <Finance/>; case 'goals': return <Goals/>; default: return <Dashboard/>; } };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', minHeight: '100dvh' }}>
      <div style={{ width: '100%', maxWidth: 480, minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, color: DIM, letterSpacing: 3, textTransform: 'uppercase', fontFamily: MONO, fontWeight: 600 }}>{new Date().toLocaleDateString('en-US',{weekday:'long'})}</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginTop: 3, letterSpacing: -0.5 }}>{TABS.find(t => t.id === tab)?.label}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {streak > 0 && <span style={{ fontFamily: MONO, fontSize: 13, color: ACCENT, fontWeight: 700 }}>🔥 {streak}d</span>}
            <button onClick={onLogout} style={{ background: 'none', border: `1px solid ${DIM3}`, borderRadius: 9, padding: '6px 12px', color: DIM, fontSize: 12, fontFamily: MONO, fontWeight: 600, cursor: 'pointer' }}>{user.display_name || user.username} ✕</button>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '4px 16px 100px', WebkitOverflowScrolling: 'touch' }}>{page()}</div>
        <Nav tab={tab} setTab={setTab}/>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => { const t = localStorage.getItem('token'); if (!t) { setChecking(false); return; } api.getMe().then(u => setUser(u)).catch(() => localStorage.removeItem('token')).finally(() => setChecking(false)); }, []);
  const logout = async () => { try { await api.logout(); } catch {} localStorage.removeItem('token'); setUser(null); };
  if (checking) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0A0A0B' }}><div style={{ color: ACCENT, fontSize: 15, fontFamily: MONO, letterSpacing: 3, fontWeight: 600 }}>LOADING...</div></div>;
  if (!user) return <AuthPage onLogin={setUser}/>;
  return <AppProvider><AppContent user={user} onLogout={logout}/></AppProvider>;
}
