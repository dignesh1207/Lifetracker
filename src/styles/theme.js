// ─── Design Tokens ─────────────────────────────────────
export const ACCENT = '#00E5A0';
export const ACCENT2 = '#00C48C';
export const RED = '#F87171';
export const BLUE = '#38BDF8';
export const DIM = 'rgba(255,255,255,0.28)';
export const DIM2 = 'rgba(255,255,255,0.12)';
export const DIM3 = 'rgba(255,255,255,0.06)';
export const SURFACE = 'rgba(255,255,255,0.035)';
export const BG = '#0A0A0B';
export const MODAL_BG = '#111113';

export const FONT_DISPLAY = "'Outfit', sans-serif";
export const FONT_MONO = "'JetBrains Mono', monospace";

// ─── Shared Styles ─────────────────────────────────────
export const S = {
  card: {
    background: SURFACE,
    borderRadius: 14,
    padding: 16,
    border: `1px solid ${DIM3}`,
  },
  cardLabel: {
    fontSize: 10,
    color: DIM,
    fontFamily: FONT_MONO,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: 500,
    marginBottom: 8,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: SURFACE,
    borderRadius: 12,
    padding: '10px 14px',
    border: `1px solid ${DIM3}`,
  },
  addBtn: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: `1px dashed ${DIM2}`,
    background: 'transparent',
    color: ACCENT,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: FONT_MONO,
    cursor: 'pointer',
    letterSpacing: 0.5,
  },
  delBtn: {
    background: 'none',
    border: 'none',
    color: DIM,
    cursor: 'pointer',
    fontSize: 13,
    padding: 4,
    opacity: 0.5,
  },
  label: {
    display: 'block',
    fontSize: 10,
    fontWeight: 500,
    color: DIM,
    fontFamily: FONT_MONO,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    background: SURFACE,
    border: `1px solid ${DIM3}`,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    fontFamily: FONT_DISPLAY,
  },
  primaryBtn: {
    width: '100%',
    padding: '13px 20px',
    borderRadius: 12,
    background: ACCENT,
    border: 'none',
    color: BG,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: FONT_MONO,
    cursor: 'pointer',
    letterSpacing: 0.5,
    transition: 'opacity 0.2s',
  },
  smallBtn: {
    padding: '6px 16px',
    borderRadius: 8,
    border: `1px solid ${DIM2}`,
    background: `${ACCENT}12`,
    color: ACCENT,
    fontSize: 12,
    fontFamily: FONT_MONO,
    fontWeight: 600,
    cursor: 'pointer',
  },
  bigNum: {
    fontFamily: FONT_MONO,
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
};

// ─── Workout Types ─────────────────────────────────────
export const WORKOUT_TYPES = [
  { id: 'strength', label: 'Strength', icon: '▣' },
  { id: 'cardio', label: 'Cardio', icon: '▷' },
  { id: 'yoga', label: 'Yoga', icon: '◇' },
  { id: 'hiit', label: 'HIIT', icon: '⚡' },
  { id: 'swim', label: 'Swim', icon: '≈' },
  { id: 'cycle', label: 'Cycle', icon: '○' },
];

export const EXPENSE_CATS = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];

export const GOAL_COLORS = [ACCENT, '#38BDF8', '#F87171', '#FBBF24', '#A78BFA', '#F472B6'];

// ─── Utility Helpers ───────────────────────────────────
export const todayStr = () => new Date().toISOString().split('T')[0];

export const weekStart = () => {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
};

export const monthStart = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
};

export const fmtDate = (d) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const fmtMoney = (n) =>
  (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const last7 = () =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
