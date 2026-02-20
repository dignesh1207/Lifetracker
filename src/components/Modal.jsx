import { DIM, DIM3, MODAL_BG, FONT_DISPLAY } from '../styles/theme';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(6px)', zIndex: 100,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      animation: 'fadeIn 0.15s ease',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: MODAL_BG, border: `1px solid ${DIM3}`,
        borderRadius: '20px 20px 0 0',
        padding: '22px 20px max(22px, env(safe-area-inset-bottom))',
        animation: 'slideUp 0.25s cubic-bezier(.4,0,.2,1)',
        maxHeight: '85vh', overflow: 'auto',
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: FONT_DISPLAY }}>{title}</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: DIM, cursor: 'pointer', fontSize: 18, padding: 4,
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
