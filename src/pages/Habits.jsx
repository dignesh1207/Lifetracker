import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, Ring } from '../components/Shared';
import { S, ACCENT, DIM, DIM2, DIM3, SURFACE, MONO, todayStr, last7 } from '../styles/theme';

export default function Habits() {
  const { habits, habitLog, addHabit, toggleHabit, deleteHabit, isHabitDone } = useApp();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: '', icon: '✦' });
  const today = todayStr(), todayDone = habitLog.filter(l => l.date === today).length;
  const add = async () => { if (!f.title.trim()) return; await addHabit(f); setF({ title: '', icon: '✦' }); setOpen(false); };

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      <div style={S.card}><div style={S.cl}>Today's Progress</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
          <Ring value={todayDone} max={habits.length} size={76} stroke={5}><span style={{ fontFamily: MONO, fontSize: 19, fontWeight: 800, color: '#fff' }}>{Math.round((todayDone/Math.max(habits.length,1))*100)}%</span></Ring>
          <div><div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: '#fff' }}>{todayDone} of {habits.length}</div><div style={{ fontSize: 13, color: DIM, fontWeight: 500 }}>completed today</div></div>
        </div>
      </div>
      <div style={S.card}><div style={S.cl}>Last 7 Days</div>
        <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>{last7().map(d => { const done = habits.filter(h => habitLog.some(l => l.habit_id === h.id && l.date === d)).length; const tot = habits.length||1; const pct = done/tot; return (<div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><div style={{ width: '100%', aspectRatio: '1', borderRadius: 7, background: pct>=1?ACCENT:pct>0?`${ACCENT}${Math.round(pct*80+20).toString(16).padStart(2,'0')}`:DIM3 }}/><span style={{ fontSize: 10, color: DIM, fontFamily: MONO, fontWeight: 500 }}>{new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'short'}).charAt(0)}</span></div>); })}</div>
      </div>
      <button onClick={() => setOpen(true)} style={S.addBtn}>+ New Habit</button>
      {habits.map(h => { const done = isHabitDone(h.id, today); return (
        <div key={h.id} style={{ ...S.li, background: done?`${ACCENT}08`:SURFACE, border: done?`1px solid ${ACCENT}22`:`1px solid ${DIM3}` }}>
          <button onClick={() => toggleHabit(h.id, today)} style={{ width: 40, height: 40, borderRadius: 11, border: done?`2px solid ${ACCENT}`:`2px solid ${DIM2}`, background: done?`${ACCENT}18`:'transparent', color: done?ACCENT:DIM, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease', flexShrink: 0, fontWeight: 700 }}>{done?'✓':h.icon}</button>
          <span style={{ fontSize: 15, fontWeight: 600, color: done?ACCENT:'#fff', flex: 1 }}>{h.title}</span>
          <button onClick={() => deleteHabit(h.id)} style={S.del}>✕</button>
        </div>
      ); })}
      <Modal open={open} onClose={() => setOpen(false)} title="New Habit">
        <div style={{ marginBottom: 14 }}><label style={S.label}>Habit</label><input value={f.title} onChange={e => setF({...f, title: e.target.value})} style={S.input} placeholder="e.g. Drink water"/></div>
        <div style={{ marginBottom: 18 }}><label style={S.label}>Icon</label><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{['✦','💧','📖','🧘','🏃','💪','🎯','💤','🥗','✍️','🎵','🧠'].map(ic => (<button key={ic} onClick={() => setF({...f, icon: ic})} style={{ width: 44, height: 44, borderRadius: 11, cursor: 'pointer', border: f.icon===ic?`1.5px solid ${ACCENT}`:`1.5px solid ${DIM3}`, background: f.icon===ic?`${ACCENT}18`:'transparent', fontSize: 19, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ic}</button>))}</div></div>
        <button onClick={add} disabled={!f.title.trim()} style={{ ...S.pri, opacity: f.title.trim()?1:0.35 }}>Add Habit</button>
      </Modal>
    </div>
  );
}
