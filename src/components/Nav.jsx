import { ACCENT, DIM3, MONO } from '../styles/theme';
export const TABS = [
  { id: 'dash', icon: '◉', label: 'Home' },
  { id: 'tasks', icon: '☐', label: 'Tasks' },
  { id: 'habits', icon: '↻', label: 'Habits' },
  { id: 'fitness', icon: '△', label: 'Fitness' },
  { id: 'work', icon: '⏱', label: 'Work' },
  { id: 'finance', icon: '◈', label: 'Finance' },
  { id: 'goals', icon: '◎', label: 'Goals' },
];
export default function Nav({ tab, setTab }) {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, display: 'flex', justifyContent: 'space-around', padding: '6px 2px max(6px, env(safe-area-inset-bottom))', background: 'rgba(10,10,11,0.97)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${DIM3}`, zIndex: 50 }}>
      {TABS.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: '5px 4px', transition: 'color 0.2s',
          color: tab === t.id ? ACCENT : 'rgba(255,255,255,0.28)',
        }}>
          <span style={{ fontSize: 17, fontWeight: tab === t.id ? 700 : 400 }}>{t.icon}</span>
          <span style={{ fontSize: 8.5, fontFamily: MONO, fontWeight: tab === t.id ? 700 : 400, letterSpacing: 0.3 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
