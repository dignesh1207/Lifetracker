export const ACCENT = '#00E5A0';
export const RED = '#F87171';
export const BLUE = '#38BDF8';
export const YELLOW = '#FBBF24';
export const PURPLE = '#A78BFA';
export const DIM = 'rgba(255,255,255,0.38)';
export const DIM2 = 'rgba(255,255,255,0.14)';
export const DIM3 = 'rgba(255,255,255,0.07)';
export const SURFACE = 'rgba(255,255,255,0.045)';
export const BG = '#0A0A0B';
export const MODAL_BG = '#111113';
export const FONT = "'Outfit',sans-serif";
export const MONO = "'JetBrains Mono',monospace";

export const S = {
  card: { background: SURFACE, borderRadius: 16, padding: 18, border: `1px solid ${DIM3}` },
  cl: { fontSize: 11.5, color: DIM, fontFamily: MONO, letterSpacing: 1.8, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 },
  li: { display: 'flex', alignItems: 'center', gap: 12, background: SURFACE, borderRadius: 14, padding: '13px 16px', border: `1px solid ${DIM3}` },
  addBtn: { width: '100%', padding: '15px 16px', borderRadius: 14, border: `1.5px dashed ${DIM2}`, background: 'transparent', color: ACCENT, fontSize: 15, fontWeight: 700, fontFamily: MONO, cursor: 'pointer' },
  del: { background: 'none', border: 'none', color: DIM, cursor: 'pointer', fontSize: 16, padding: 6, opacity: 0.5, minWidth: 34, minHeight: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  label: { display: 'block', fontSize: 11.5, fontWeight: 700, color: DIM, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 7 },
  input: { width: '100%', padding: '14px 14px', borderRadius: 12, background: SURFACE, border: `1px solid ${DIM3}`, color: '#fff', fontSize: 16, fontWeight: 500, outline: 'none', fontFamily: FONT },
  pri: { width: '100%', padding: '16px 20px', borderRadius: 14, background: ACCENT, border: 'none', color: BG, fontSize: 15, fontWeight: 800, fontFamily: MONO, cursor: 'pointer', transition: 'opacity 0.2s' },
  sm: { padding: '9px 18px', borderRadius: 10, border: `1px solid ${DIM2}`, background: `${ACCENT}15`, color: ACCENT, fontSize: 13, fontFamily: MONO, fontWeight: 700, cursor: 'pointer', minHeight: 38 },
  big: { fontFamily: MONO, fontSize: 30, fontWeight: 800, color: '#fff' },
  grid: { display: 'flex', flexDirection: 'column', gap: 12 },
};

export const WTYPES = [
  { id: 'strength', label: 'Strength', icon: '▣' },
  { id: 'cardio', label: 'Cardio', icon: '▷' },
  { id: 'yoga', label: 'Yoga', icon: '◇' },
  { id: 'hiit', label: 'HIIT', icon: '⚡' },
  { id: 'swim', label: 'Swim', icon: '≈' },
  { id: 'cycle', label: 'Cycle', icon: '○' },
];
export const ECATS = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];
export const GCOLORS = [ACCENT, '#38BDF8', '#F87171', '#FBBF24', '#A78BFA', '#F472B6'];

export const todayStr = () => new Date().toISOString().split('T')[0];
export const weekStart = () => { const d = new Date(); d.setDate(d.getDate() - d.getDay()); return d.toISOString().split('T')[0]; };
export const monthStart = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]; };

// FIX: PostgreSQL returns "2025-02-19T00:00:00.000Z" — this strips the time part
export const nd = (d) => { if (!d) return ''; return String(d).split('T')[0]; };

export const fmtDate = (d) => {
  const s = nd(d);
  if (!s) return '';
  return new Date(s + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const fmtMoney = (n) => {
  const v = typeof n === 'string' ? parseFloat(n) : (n || 0);
  return (v < 0 ? '-' : '') + '$' + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const last7 = () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().split('T')[0]; });
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
