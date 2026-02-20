import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { S, ACCENT, DIM, DIM2, DIM3, RED, FONT_MONO, fmtDate } from '../styles/theme';

export default function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', priority: 'med', due: '' });

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    await addTask(form);
    setForm({ title: '', priority: 'med', due: '' });
    setOpen(false);
  };

  const active = tasks.filter((t) => !t.done).sort((a, b) => {
    const p = { high: 0, med: 1, low: 2 };
    return (p[a.priority] || 1) - (p[b.priority] || 1);
  });
  const done = tasks.filter((t) => t.done);

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      <button onClick={() => setOpen(true)} style={S.addBtn}>+ New Task</button>

      {active.length === 0 && done.length === 0 && <EmptyState icon="☐" text="No tasks yet. Add one to get started." />}

      {active.map((t) => (
        <div key={t.id} style={{ ...S.listItem, animation: 'slideUp 0.25s ease' }}>
          <button onClick={() => toggleTask(t.id)} style={{
            width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${DIM2}`,
            background: 'none', cursor: 'pointer', flexShrink: 0,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
            <div style={{ fontSize: 11, color: DIM, display: 'flex', gap: 8, marginTop: 2 }}>
              <span style={{ color: t.priority === 'high' ? RED : t.priority === 'low' ? DIM : ACCENT, fontFamily: FONT_MONO, fontSize: 10, textTransform: 'uppercase' }}>{t.priority}</span>
              {t.due && <span>{fmtDate(t.due)}</span>}
            </div>
          </div>
          <button onClick={() => deleteTask(t.id)} style={S.delBtn}>✕</button>
        </div>
      ))}

      {done.length > 0 && (
        <>
          <div style={{ fontSize: 10, color: DIM, fontFamily: FONT_MONO, letterSpacing: 2, textTransform: 'uppercase', marginTop: 10 }}>COMPLETED</div>
          {done.map((t) => (
            <div key={t.id} style={{ ...S.listItem, opacity: 0.4 }}>
              <button onClick={() => toggleTask(t.id)} style={{
                width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${ACCENT}`,
                background: `${ACCENT}22`, cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, fontSize: 12,
              }}>✓</button>
              <span style={{ fontSize: 14, color: DIM, textDecoration: 'line-through', flex: 1 }}>{t.title}</span>
              <button onClick={() => deleteTask(t.id)} style={S.delBtn}>✕</button>
            </div>
          ))}
        </>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New Task">
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={S.input} placeholder="What needs to be done?" />
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Priority</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['low', 'med', 'high'].map((p) => (
                <button key={p} onClick={() => setForm({ ...form, priority: p })} style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
                  border: form.priority === p ? `1.5px solid ${p === 'high' ? RED : p === 'low' ? DIM : ACCENT}` : `1.5px solid ${DIM3}`,
                  background: form.priority === p ? `${p === 'high' ? RED : p === 'low' ? DIM : ACCENT}15` : 'transparent',
                  color: form.priority === p ? '#fff' : DIM, fontSize: 11, fontFamily: FONT_MONO, textTransform: 'uppercase',
                }}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Due Date</label>
            <input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} style={S.input} />
          </div>
        </div>
        <button onClick={handleAdd} disabled={!form.title.trim()} style={{ ...S.primaryBtn, opacity: form.title.trim() ? 1 : 0.35 }}>Add Task</button>
      </Modal>
    </div>
  );
}
