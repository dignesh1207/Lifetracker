import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, Chart, Empty } from '../components/Shared';
import { S, ACCENT, BLUE, DIM, DIM3, MONO, WTYPES, todayStr, last7, fmtDate, nd } from '../styles/theme';

export default function Fitness() {
  const { workouts, addWorkout, deleteWorkout } = useApp();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ type: 'strength', duration: 30, calories: 200, notes: '', date: todayStr() });
  const today = todayStr(), todayW = workouts.filter(w => nd(w.date) === today);
  const add = async () => { await addWorkout({ ...f, duration: +f.duration, calories: +f.calories }); setF({ type: 'strength', duration: 30, calories: 200, notes: '', date: todayStr() }); setOpen(false); };

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div style={S.card}><div style={{ fontSize: 10, color: DIM, fontFamily: MONO, letterSpacing: 1.5, fontWeight: 700 }}>TODAY</div><div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 4 }}>{todayW.length}</div><div style={{ fontSize: 11, color: DIM, fontWeight: 600 }}>sessions</div></div>
        <div style={S.card}><div style={{ fontSize: 10, color: DIM, fontFamily: MONO, letterSpacing: 1.5, fontWeight: 700 }}>KCAL</div><div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: ACCENT, marginTop: 4 }}>{todayW.reduce((s,w)=>s+w.calories,0)}</div><div style={{ fontSize: 11, color: DIM, fontWeight: 600 }}>burned</div></div>
        <div style={S.card}><div style={{ fontSize: 10, color: DIM, fontFamily: MONO, letterSpacing: 1.5, fontWeight: 700 }}>MINS</div><div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: BLUE, marginTop: 4 }}>{todayW.reduce((s,w)=>s+w.duration,0)}</div><div style={{ fontSize: 11, color: DIM, fontWeight: 600 }}>active</div></div>
      </div>
      <div style={S.card}><div style={S.cl}>Weekly Overview</div><Chart height={55} data={last7().map(d => ({ l: new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'short'}).charAt(0), v: workouts.filter(w=>nd(w.date)===d).reduce((s,w)=>s+w.calories,0), t: d===today }))}/></div>
      <button onClick={() => setOpen(true)} style={S.addBtn}>+ Log Workout</button>
      {!workouts.length && <Empty icon="△" text="No workouts yet"/>}
      {workouts.slice(0,20).map(w => { const wt = WTYPES.find(t=>t.id===w.type)||WTYPES[0]; return (
        <div key={w.id} style={S.li}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: DIM3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: ACCENT, flexShrink: 0, fontWeight: 700 }}>{wt.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{wt.label}</div><div style={{ fontSize: 12, color: DIM, fontFamily: MONO, fontWeight: 500 }}>{fmtDate(w.date)} · {w.duration}m · {w.calories}kcal</div></div>
          <button onClick={() => deleteWorkout(w.id)} style={S.del}>✕</button>
        </div>
      ); })}
      <Modal open={open} onClose={() => setOpen(false)} title="Log Workout">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7, marginBottom: 16 }}>{WTYPES.map(wt => (<button key={wt.id} onClick={() => setF({...f, type: wt.id})} style={{ padding: '12px 4px', borderRadius: 11, cursor: 'pointer', border: f.type===wt.id?`1.5px solid ${ACCENT}`:`1.5px solid ${DIM3}`, background: f.type===wt.id?`${ACCENT}12`:'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><span style={{ fontSize: 19, color: f.type===wt.id?ACCENT:DIM }}>{wt.icon}</span><span style={{ fontSize: 11, color: f.type===wt.id?ACCENT:DIM, fontFamily: MONO, fontWeight: 600 }}>{wt.label}</span></button>))}</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}><div style={{ flex: 1 }}><label style={S.label}>Duration (min)</label><input type="number" value={f.duration} onChange={e => setF({...f, duration: e.target.value})} style={S.input}/></div><div style={{ flex: 1 }}><label style={S.label}>Calories</label><input type="number" value={f.calories} onChange={e => setF({...f, calories: e.target.value})} style={S.input}/></div></div>
        <div style={{ marginBottom: 12 }}><label style={S.label}>Date</label><input type="date" value={f.date} onChange={e => setF({...f, date: e.target.value})} style={S.input}/></div>
        <div style={{ marginBottom: 18 }}><label style={S.label}>Notes</label><input value={f.notes} onChange={e => setF({...f, notes: e.target.value})} style={S.input} placeholder="Optional"/></div>
        <button onClick={add} style={S.pri}>Save Workout</button>
      </Modal>
    </div>
  );
}
