import { ACCENT, DIM, DIM3, FONT_DISPLAY, FONT_MONO } from '../styles/theme';

const TABS = [
  { id: 'dash', icon: '◉', label: 'Home' },
  { id: 'tasks', icon: '☐', label: 'Tasks' },
  { id: 'habits', icon: '↻', label: 'Habits' },
  { id: 'fitness', icon: '△', label: 'Fitness' },
  { id: 'finance', icon: '◈', label: 'Finance' },
  { id: 'goals', icon: '◎', label: 'Goals' },
];

export default function BottomNav({ tab, setTab }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      display: 'flex', justifyContent: 'space-around',
      padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
      background: 'rgba(10,10,11,0.96)', backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${DIM3}`,
    }}>
      {TABS.map((t) => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          padding: '4px 8px', transition: 'color 0.2s',
          color: tab === t.id ? ACCENT : DIM,
        }}>
          <span style={{ fontSize: 18, fontFamily: FONT_DISPLAY, fontWeight: tab === t.id ? 700 : 400 }}>{t.icon}</span>
          <span style={{ fontSize: 9, fontFamily: FONT_MONO, fontWeight: tab === t.id ? 600 : 400, letterSpacing: 0.5 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export { TABS };
