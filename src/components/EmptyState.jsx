import { DIM } from '../styles/theme';

export default function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px', color: DIM }}>
      <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.5 }}>{icon}</div>
      <div style={{ fontSize: 13 }}>{text}</div>
    </div>
  );
}
