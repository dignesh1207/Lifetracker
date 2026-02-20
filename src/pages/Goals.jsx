import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import Ring from '../components/Ring';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import { S, ACCENT, DIM, DIM3, FONT_MONO, GOAL_COLORS, todayStr, weekStart, monthStart, clamp } from '../styles/theme';

export default function Goals() {
  const { workouts, goals, addGoal, updateGoal, incrementGoal, deleteGoal } = useApp();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', target: 10, unit: 'sessions', period: 'week', goal_type: 'periodic', color: ACCENT, current: 0 });

  const goalProgress = (g) => {
    if (g.goal_type === 'milestone') return g.current || 0;
    const start = g.period === 'day' ? todayStr() : g.period === 'week' ? weekStart() : monthStart();
    const f = workouts.filter((w) => w.date >= start);
    if (g.unit === 'sessions') return f.length;
    if (g.unit === 'kcal') return f.reduce((s, w) => s + (w.calories || 0), 0);
    if (g.unit === 'minutes') return f.reduce((s, w) => s + (w.duration || 0), 0);
    return 0;
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    const data = { ...form, target: +form.target, current: +form.current };
    if (editId) {
      await updateGoal(editId, data);
    } else {
      await addGoal(data);
    }
    setForm({ title: '', target: 10, unit: 'sessions', period: 'week', goal_type: 'periodic', color: ACCENT, current: 0 });
    setEditId(null);
    setOpen(false);
  };

  const openEdit = (g) => {
    setForm({ title: g.title, target: g.target, unit: g.unit, period: g.period || 'week', goal_type: g.goal_type, color: g.color || ACCENT, current: g.current || 0 });
    setEditId(g.id);
    setOpen(true);
  };

  const openNew = () => {
    setForm({ title: '', target: 10, unit: 'sessions', period: 'week', goal_type: 'periodic', color: ACCENT, current: 0 });
    setEditId(null);
    setOpen(true);
  };

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      <button onClick={openNew} style={S.addBtn}>+ New Goal</button>

      {goals.length === 0 && <EmptyState icon="◎" text="No goals yet. Set one to start tracking!" />}

      {goals.map((g) => {
        const prog = goalProgress(g);
        const pct = clamp(prog / Math.max(g.target, 1), 0, 1);
        const done = pct >= 1;

        return (
          <div key={g.id} style={{ ...S.card, border: done ? `1px solid ${g.color || ACCENT}33` : `1px solid ${DIM3}`, animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{done ? '✓ ' : ''}{g.title}</div>
                <div style={{ fontSize: 11, color: DIM, fontFamily: FONT_MONO, marginTop: 2 }}>
                  {g.goal_type === 'periodic' ? `${g.target} ${g.unit} / ${g.period}` : `${g.target} ${g.unit} total`}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => openEdit(g)} style={S.delBtn}>✎</button>
                <button onClick={() => deleteGoal(g.id)} style={S.delBtn}>✕</button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
              <Ring value={prog} max={g.target} size={68} stroke={5} color={g.color || ACCENT}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 15, fontWeight: 700, color: '#fff' }}>{Math.round(pct * 100)}%</span>
              </Ring>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, color: '#fff' }}>
                  {prog}<span style={{ fontSize: 13, color: DIM }}>/{g.target}</span>
                </div>
                <div style={{ fontSize: 11, color: DIM }}>{g.unit}</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}><ProgressBar value={prog} max={g.target} color={g.color || ACCENT} /></div>

            {g.goal_type === 'milestone' && (
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                <button onClick={() => incrementGoal(g.id, -1)} style={{ ...S.smallBtn, opacity: 0.6 }}>−1</button>
                <button onClick={() => incrementGoal(g.id, 1)} style={S.smallBtn}>+1</button>
              </div>
            )}
          </div>
        );
      })}

      <Modal open={open} onClose={() => { setOpen(false); setEditId(null); }} title={editId ? 'Edit Goal' : 'New Goal'}>
        <div style={{ marginBottom: 12 }}>
          <label style={S.label}>Goal Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={S.input} placeholder="e.g. Run 50 miles" />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Type</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ id: 'periodic', l: 'Recurring' }, { id: 'milestone', l: 'Milestone' }].map((t) => (
              <button key={t.id} onClick={() => setForm({ ...form, goal_type: t.id })} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, cursor: 'pointer',
                border: form.goal_type === t.id ? `1.5px solid ${ACCENT}` : `1.5px solid ${DIM3}`,
                background: form.goal_type === t.id ? `${ACCENT}15` : 'transparent',
                color: form.goal_type === t.id ? '#fff' : DIM, fontSize: 12, fontFamily: FONT_MONO,
              }}>{t.l}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Target</label>
            <input type="number" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} style={S.input} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Unit</label>
            <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} style={S.input}>
              <option value="sessions">Sessions</option>
              <option value="kcal">Calories</option>
              <option value="minutes">Minutes</option>
              <option value="workouts">Workouts</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        {form.goal_type === 'periodic' && (
          <div style={{ marginBottom: 12 }}>
            <label style={S.label}>Period</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['day', 'week', 'month'].map((p) => (
                <button key={p} onClick={() => setForm({ ...form, period: p })} style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
                  border: form.period === p ? `1.5px solid ${ACCENT}` : `1.5px solid ${DIM3}`,
                  background: form.period === p ? `${ACCENT}15` : 'transparent',
                  color: form.period === p ? '#fff' : DIM, fontSize: 11, fontFamily: FONT_MONO, textTransform: 'uppercase',
                }}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {form.goal_type === 'milestone' && (
          <div style={{ marginBottom: 12 }}>
            <label style={S.label}>Current Progress</label>
            <input type="number" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} style={S.input} />
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <label style={S.label}>Color</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {GOAL_COLORS.map((c) => (
              <button key={c} onClick={() => setForm({ ...form, color: c })} style={{
                width: 32, height: 32, borderRadius: 8, background: c, cursor: 'pointer',
                border: form.color === c ? '2px solid #fff' : '2px solid transparent',
                opacity: form.color === c ? 1 : 0.5, transition: 'all 0.2s',
              }} />
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={!form.title.trim()} style={{ ...S.primaryBtn, opacity: form.title.trim() ? 1 : 0.35 }}>
          {editId ? 'Update' : 'Create'} Goal
        </button>
      </Modal>
    </div>
  );
}
