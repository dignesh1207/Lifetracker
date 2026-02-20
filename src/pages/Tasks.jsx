import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, Empty } from '../components/Shared';
import { S, ACCENT, DIM, DIM2, DIM3, RED, MONO, fmtDate } from '../styles/theme';

export default function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask } = useApp();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: '', priority: 'med', due: '' });
  const add = async () => { if (!f.title.trim()) return; await addTask(f); setF({ title: '', priority: 'med', due: '' }); setOpen(false); };
  const active = tasks.filter(t => !t.done).sort((a, b) => ({ high: 0, med: 1, low: 2 }[a.priority] || 1) - ({ high: 0, med: 1, low: 2 }[b.priority] || 1));
  const done = tasks.filter(t => t.done);

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      <button onClick={() => setOpen(true)} style={S.addBtn}>+ New Task</button>
      {!active.length && !done.length && <Empty icon="☐" text="No tasks yet"/>}
      {active.map(t => (
        <div key={t.id} style={{ ...S.li, animation: 'slideUp 0.25s ease' }}>
          <button onClick={() => toggleTask(t.id)} style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${DIM2}`, background: 'none', cursor: 'pointer', flexShrink: 0 }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
            <div style={{ fontSize: 12, color: DIM, display: 'flex', gap: 8, marginTop: 3, fontWeight: 500 }}>
              <span style={{ color: t.priority==='high'?RED:t.priority==='low'?DIM:ACCENT, fontFamily: MONO, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase' }}>{t.priority}</span>
              {t.due && <span>{fmtDate(t.due)}</span>}
            </div>
          </div>
          <button onClick={() => deleteTask(t.id)} style={S.del}>✕</button>
        </div>
      ))}
      {done.length > 0 && <>
        <div style={{ fontSize: 11, color: DIM, fontFamily: MONO, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginTop: 10 }}>COMPLETED</div>
        {done.map(t => (
          <div key={t.id} style={{ ...S.li, opacity: 0.4 }}>
            <button onClick={() => toggleTask(t.id)} style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${ACCENT}`, background: `${ACCENT}22`, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, fontSize: 13, fontWeight: 700 }}>✓</button>
            <span style={{ fontSize: 15, color: DIM, textDecoration: 'line-through', flex: 1, fontWeight: 500 }}>{t.title}</span>
            <button onClick={() => deleteTask(t.id)} style={S.del}>✕</button>
          </div>
        ))}
      </>}
      <Modal open={open} onClose={() => setOpen(false)} title="New Task">
        <div style={{ marginBottom: 14 }}><label style={S.label}>Title</label><input value={f.title} onChange={e => setF({...f, title: e.target.value})} style={S.input} placeholder="What needs to be done?"/></div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}><label style={S.label}>Priority</label><div style={{ display: 'flex', gap: 6 }}>{['low','med','high'].map(p => (<button key={p} onClick={() => setF({...f, priority: p})} style={{ flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer', border: f.priority===p?`1.5px solid ${p==='high'?RED:p==='low'?DIM:ACCENT}`:`1.5px solid ${DIM3}`, background: f.priority===p?`${p==='high'?RED:p==='low'?DIM:ACCENT}15`:'transparent', color: f.priority===p?'#fff':DIM, fontSize: 12, fontFamily: MONO, fontWeight: 700, textTransform: 'uppercase' }}>{p}</button>))}</div></div>
          <div style={{ flex: 1 }}><label style={S.label}>Due Date</label><input type="date" value={f.due} onChange={e => setF({...f, due: e.target.value})} style={S.input}/></div>
        </div>
        <button onClick={add} disabled={!f.title.trim()} style={{ ...S.pri, opacity: f.title.trim()?1:0.35 }}>Add Task</button>
      </Modal>
    </div>
  );
}
