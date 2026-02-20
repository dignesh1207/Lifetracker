import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav, { TABS } from './components/BottomNav';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import Fitness from './pages/Fitness';
import Finance from './pages/Finance';
import Goals from './pages/Goals';
import api from './api/client';
import { ACCENT, DIM, DIM3, FONT_DISPLAY, FONT_MONO } from './styles/theme';

function AppContent({ user, onLogout }) {
  const { loading, habits, habitLog } = useApp();
  const [tab, setTab] = useState('dash');

  let streak = 0;
  if (habits.length > 0) {
    const d = new Date();
    while (true) {
      const ds = d.toISOString().split('T')[0];
      const allDone = habits.every((h) => habitLog.some((l) => l.habit_id === h.id && l.date === ds));
      if (allDone) { streak++; d.setDate(d.getDate() - 1); } else break;
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: ACCENT, fontSize: 14, fontFamily: FONT_MONO, letterSpacing: 3 }}>LOADING...</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (tab) {
      case 'dash': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'habits': return <Habits />;
      case 'fitness': return <Fitness />;
      case 'finance': return <Finance />;
      case 'goals': return <Goals />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 480, minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 10, color: DIM, letterSpacing: 3, textTransform: 'uppercase', fontFamily: FONT_MONO, fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 2, letterSpacing: -0.5 }}>
              {TABS.find((t) => t.id === tab)?.label}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {streak > 0 && (
              <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: ACCENT, fontWeight: 600 }}>
                🔥 {streak}d
              </span>
            )}
            <button onClick={onLogout} style={{
              background: 'none', border: `1px solid ${DIM3}`, borderRadius: 8,
              padding: '5px 10px', color: DIM, fontSize: 11, fontFamily: FONT_MONO,
              cursor: 'pointer',
            }}>
              {user.display_name || user.username} ✕
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '4px 16px 96px', WebkitOverflowScrolling: 'touch' }}>
          {renderPage()}
        </div>

        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setChecking(false);
      return;
    }
    api.getMe()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setChecking(false));
  }, []);

  const handleLogout = async () => {
    try { await api.logout(); } catch {}
    localStorage.removeItem('token');
    setUser(null);
  };

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0A0A0B' }}>
        <div style={{ color: ACCENT, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 3 }}>LOADING...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return (
    <AppProvider>
      <AppContent user={user} onLogout={handleLogout} />
    </AppProvider>
  );
}
