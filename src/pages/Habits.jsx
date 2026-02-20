import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import Ring from '../components/Ring';
import { S, ACCENT, DIM, DIM2, DIM3, SURFACE, FONT_MONO, todayStr, last7 } from '../styles/theme';

export default function Habits() {
  const { habits, habitLog, addHabit, toggleHabit, deleteHabit, isHabitDone } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', icon: '✦' });

  const today = todayStr();
  const todayDone = habitLog.filter((l) => l.date === today).length;

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    await addHabit(form);
    setForm({ title: '', icon: '✦' });
    setOpen(false);
  };

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      {/* Progress Ring */}
      <div style={S.card}>
        <div style={S.cardLabel}>Today's Progress</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
          <Ring value={todayDone} max={habits.length} size={72} stroke={5}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: '#fff' }}>
              {Math.round((todayDone / Math.max(habits.length, 1)) * 100)}%
            </span>
          </Ring>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: '#fff' }}>{todayDone} of {habits.length}</div>
            <div style={{ fontSize: 11, color: DIM }}>completed today</div>
          </div>
        </div>
      </div>

      {/* 7-Day Heatmap */}
      <div style={S.card}>
        <div style={S.cardLabel}>Last 7 Days</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {last7().map((d) => {
            const done = habits.filter((h) => habitLog.some((l) => l.habit_id === h.id && l.date === d)).length;
            const total = habits.length || 1;
            const pct = done / total;
            return (
              <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: 6,
                  background: pct >= 1 ? ACCENT : pct > 0 ? `${ACCENT}${Math.round(pct * 80 + 20).toString(16).padStart(2, '0')}` : DIM3,
                }} />
                <span style={{ fontSize: 9, color: DIM, fontFamily: FONT_MONO }}>
                  {new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={() => setOpen(true)} style={S.addBtn}>+ New Habit</button>

      {/* Habit List */}
      {habits.map((h) => {
        const done = isHabitDone(h.id, today);
        return (
          <div key={h.id} style={{ ...S.listItem, background: done ? `${ACCENT}08` : SURFACE, border: done ? `1px solid ${ACCENT}22` : `1px solid ${DIM3}` }}>
            <button onClick={() => toggleHabit(h.id, today)} style={{
              width: 36, height: 36, borderRadius: 10,
              border: done ? `2px solid ${ACCENT}` : `2px solid ${DIM2}`,
              background: done ? `${ACCENT}18` : 'transparent',
              color: done ? ACCENT : DIM, fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.25s ease', flexShrink: 0,
            }}>{done ? '✓' : h.icon}</button>
            <span style={{ fontSize: 14, fontWeight: 500, color: done ? ACCENT : '#fff', flex: 1 }}>{h.title}</span>
            <button onClick={() => deleteHabit(h.id)} style={S.delBtn}>✕</button>
          </div>
        );
      })}

      <Modal open={open} onClose={() => setOpen(false)} title="New Habit">
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Habit</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={S.input} placeholder="e.g. Drink water" />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={S.label}>Icon</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['✦', '💧', '📖', '🧘', '🏃', '💪', '🎯', '💤', '🥗', '✍️', '🎵', '🧠'].map((ic) => (
              <button key={ic} onClick={() => setForm({ ...form, icon: ic })} style={{
                width: 40, height: 40, borderRadius: 10, cursor: 'pointer',
                border: form.icon === ic ? `1.5px solid ${ACCENT}` : `1.5px solid ${DIM3}`,
                background: form.icon === ic ? `${ACCENT}18` : 'transparent',
                fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{ic}</button>
            ))}
          </div>
        </div>
        <button onClick={handleAdd} disabled={!form.title.trim()} style={{ ...S.primaryBtn, opacity: form.title.trim() ? 1 : 0.35 }}>Add Habit</button>
      </Modal>
    </div>
  );
}
