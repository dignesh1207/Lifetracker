// Ring.jsx - re-exported as named
import { DIM3, ACCENT, clamp, MONO } from '../styles/theme';

export function Ring({ value, max, size = 64, stroke = 4.5, color = ACCENT, children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, pct = clamp(value / Math.max(max, 1), 0, 1);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={DIM3} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c*(1-pct)} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(.4,0,.2,1)' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>{children}</div>
    </div>
  );
}

export function Bar({ value, max, color = ACCENT, h = 6 }) {
  return (
    <div style={{ height: h, borderRadius: h, background: DIM3, overflow: 'hidden', width: '100%' }}>
      <div style={{ height: '100%', borderRadius: h, width: `${clamp(value/Math.max(max,1),0,1)*100}%`, background: color, transition: 'width 0.5s cubic-bezier(.4,0,.2,1)' }}/>
    </div>
  );
}

export function Chart({ data, height = 52, color = ACCENT }) {
  const mx = Math.max(...data.map(d => d.v), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ width: '100%', maxWidth: 30, borderRadius: 4, height: Math.max((d.v/mx)*(height-18), d.v > 0 ? 4 : 2), background: d.t ? color : d.v > 0 ? `${color}55` : DIM3, transition: 'height 0.4s ease' }}/>
          <span style={{ fontSize: 10, color: d.t ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)', fontFamily: MONO, fontWeight: 500 }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'fadeIn 0.15s ease' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: 480, background: '#111113', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: '22px 22px 0 0', padding: '24px 20px max(24px, env(safe-area-inset-bottom))', animation: 'slideUp 0.25s cubic-bezier(.4,0,.2,1)', maxHeight: '88vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 20, padding: 6 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Empty({ icon, text }) {
  return <div style={{ textAlign: 'center', padding: '52px 20px', color: 'rgba(255,255,255,0.3)' }}>
    <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.5 }}>{icon}</div>
    <div style={{ fontSize: 14, fontWeight: 500 }}>{text}</div>
  </div>;
}
