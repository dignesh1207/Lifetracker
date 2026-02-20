import { DIM3, ACCENT, clamp } from '../styles/theme';

export default function ProgressBar({ value, max, color = ACCENT, height = 5 }) {
  const pct = clamp(value / Math.max(max, 1), 0, 1) * 100;
  return (
    <div style={{ height, borderRadius: height, background: DIM3, overflow: 'hidden', width: '100%' }}>
      <div style={{
        height: '100%', borderRadius: height,
        width: `${pct}%`, background: color,
        transition: 'width 0.5s cubic-bezier(.4,0,.2,1)',
      }} />
    </div>
  );
}
