import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import MiniChart from '../components/MiniChart';
import EmptyState from '../components/EmptyState';
import { S, ACCENT, BLUE, DIM, DIM3, FONT_MONO, WORKOUT_TYPES, todayStr, last7, fmtDate } from '../styles/theme';

export default function Fitness() {
  const { workouts, addWorkout, deleteWorkout } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: 'strength', duration: 30, calories: 200, notes: '', date: todayStr() });

  const today = todayStr();
  const todayW = workouts.filter((w) => w.date === today);

  const handleAdd = async () => {
    await addWorkout({ ...form, duration: +form.duration, calories: +form.calories });
    setForm({ type: 'strength', duration: 30, calories: 200, notes: '', date: todayStr() });
    setOpen(false);
  };

  const chartData = last7().map((d) => ({
    label: new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
    v: workouts.filter((w) => w.date === d).reduce((s, w) => s + w.calories, 0),
    today: d === today,
  }));

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div style={S.card}>
          <div style={{ fontSize: 9, color: DIM, fontFamily: FONT_MONO, letterSpacing: 1.5 }}>TODAY</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, color: '#fff', marginTop: 4 }}>{todayW.length}</div>
          <div style={{ fontSize: 10, color: DIM }}>sessions</div>
        </div>
        <div style={S.card}>
          <div style={{ fontSize: 9, color: DIM, fontFamily: FONT_MONO, letterSpacing: 1.5 }}>KCAL</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, color: ACCENT, marginTop: 4 }}>{todayW.reduce((s, w) => s + w.calories, 0)}</div>
          <div style={{ fontSize: 10, color: DIM }}>burned</div>
        </div>
        <div style={S.card}>
          <div style={{ fontSize: 9, color: DIM, fontFamily: FONT_MONO, letterSpacing: 1.5 }}>MINS</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, color: BLUE, marginTop: 4 }}>{todayW.reduce((s, w) => s + w.duration, 0)}</div>
          <div style={{ fontSize: 10, color: DIM }}>active</div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardLabel}>Weekly Overview</div>
        <MiniChart height={55} data={chartData} />
      </div>

      <button onClick={() => setOpen(true)} style={S.addBtn}>+ Log Workout</button>

      {workouts.length === 0 && <EmptyState icon="△" text="No workouts yet" />}

      {workouts.slice(0, 20).map((w) => {
        const wt = WORKOUT_TYPES.find((t) => t.id === w.type) || WORKOUT_TYPES[0];
        return (
          <div key={w.id} style={S.listItem}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: DIM3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: ACCENT, flexShrink: 0, fontWeight: 700 }}>{wt.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{wt.label}</div>
              <div style={{ fontSize: 11, color: DIM, fontFamily: FONT_MONO }}>{fmtDate(w.date)} · {w.duration}m · {w.calories}kcal</div>
            </div>
            <button onClick={() => deleteWorkout(w.id)} style={S.delBtn}>✕</button>
          </div>
        );
      })}

      <Modal open={open} onClose={() => setOpen(false)} title="Log Workout">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 16 }}>
          {WORKOUT_TYPES.map((wt) => (
            <button key={wt.id} onClick={() => setForm({ ...form, type: wt.id })} style={{
              padding: '10px 4px', borderRadius: 10, cursor: 'pointer',
              border: form.type === wt.id ? `1.5px solid ${ACCENT}` : `1.5px solid ${DIM3}`,
              background: form.type === wt.id ? `${ACCENT}12` : 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <span style={{ fontSize: 18, color: form.type === wt.id ? ACCENT : DIM }}>{wt.icon}</span>
              <span style={{ fontSize: 10, color: form.type === wt.id ? ACCENT : DIM, fontFamily: FONT_MONO }}>{wt.label}</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><label style={S.label}>Duration (min)</label><input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} style={S.input} /></div>
          <div style={{ flex: 1 }}><label style={S.label}>Calories</label><input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} style={S.input} /></div>
        </div>
        <div style={{ marginBottom: 12 }}><label style={S.label}>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={S.input} /></div>
        <div style={{ marginBottom: 18 }}><label style={S.label}>Notes</label><input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={S.input} placeholder="Optional" /></div>
        <button onClick={handleAdd} style={S.primaryBtn}>Save Workout</button>
      </Modal>
    </div>
  );
}
