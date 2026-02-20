import { DIM, DIM3, ACCENT, FONT_MONO } from '../styles/theme';

export default function MiniChart({ data, height = 50, color = ACCENT }) {
  const mx = Math.max(...data.map((d) => d.v), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{
            width: '100%', maxWidth: 28, borderRadius: 3,
            height: Math.max((d.v / mx) * (height - 16), d.v > 0 ? 4 : 2),
            background: d.today ? color : d.v > 0 ? `${color}55` : DIM3,
            transition: 'height 0.4s ease',
          }} />
          <span style={{ fontSize: 9, color: d.today ? 'rgba(255,255,255,0.6)' : DIM, fontFamily: FONT_MONO }}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
