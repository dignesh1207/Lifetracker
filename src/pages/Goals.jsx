import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, Ring, Bar, Empty } from '../components/Shared';
import { S, ACCENT, DIM, DIM3, MONO, GCOLORS, todayStr, weekStart, monthStart, clamp, nd } from '../styles/theme';

export default function Goals() {
  const { workouts, goals, addGoal, updateGoal, incrementGoal, deleteGoal } = useApp();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [f, setF] = useState({ title: '', target: 10, unit: 'sessions', period: 'week', goal_type: 'periodic', color: ACCENT, current: 0 });
  const gp = g => { if (g.goal_type==='milestone') return g.current||0; const st=g.period==='day'?todayStr():g.period==='week'?weekStart():monthStart(); const fw=workouts.filter(w=>nd(w.date)>=st); if(g.unit==='sessions')return fw.length; if(g.unit==='kcal')return fw.reduce((s,w)=>s+(w.calories||0),0); if(g.unit==='minutes')return fw.reduce((s,w)=>s+(w.duration||0),0); return 0; };
  const save = async () => { if(!f.title.trim())return; const d={...f,target:+f.target,current:+f.current}; if(editId) await updateGoal(editId,d); else await addGoal(d); setF({title:'',target:10,unit:'sessions',period:'week',goal_type:'periodic',color:ACCENT,current:0}); setEditId(null); setOpen(false); };
  const edit = g => { setF({title:g.title,target:g.target,unit:g.unit,period:g.period||'week',goal_type:g.goal_type,color:g.color||ACCENT,current:g.current||0}); setEditId(g.id); setOpen(true); };

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      <button onClick={() => { setF({title:'',target:10,unit:'sessions',period:'week',goal_type:'periodic',color:ACCENT,current:0}); setEditId(null); setOpen(true); }} style={S.addBtn}>+ New Goal</button>
      {!goals.length && <Empty icon="◎" text="No goals yet"/>}
      {goals.map(g => { const p=gp(g), pct=clamp(p/Math.max(g.target,1),0,1), done=pct>=1; return (
        <div key={g.id} style={{ ...S.card, border: done?`1px solid ${g.color||ACCENT}33`:`1px solid ${DIM3}`, animation: 'slideUp 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{done?'✓ ':''}{g.title}</div><div style={{ fontSize: 12, color: DIM, fontFamily: MONO, fontWeight: 500, marginTop: 3 }}>{g.goal_type==='periodic'?`${g.target} ${g.unit} / ${g.period}`:`${g.target} ${g.unit} total`}</div></div>
            <div style={{ display: 'flex', gap: 2 }}><button onClick={() => edit(g)} style={S.del}>✎</button><button onClick={() => deleteGoal(g.id)} style={S.del}>✕</button></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
            <Ring value={p} max={g.target} size={72} stroke={5} color={g.color||ACCENT}><span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 800, color: '#fff' }}>{Math.round(pct*100)}%</span></Ring>
            <div><div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: '#fff' }}>{p}<span style={{ fontSize: 14, color: DIM }}>/{g.target}</span></div><div style={{ fontSize: 12, color: DIM, fontWeight: 600 }}>{g.unit}</div></div>
          </div>
          <div style={{ marginTop: 12 }}><Bar value={p} max={g.target} color={g.color||ACCENT}/></div>
          {g.goal_type==='milestone' && <div style={{ marginTop: 10, display: 'flex', gap: 6 }}><button onClick={() => incrementGoal(g.id,-1)} style={{ ...S.sm, opacity: 0.6 }}>−1</button><button onClick={() => incrementGoal(g.id,1)} style={S.sm}>+1</button></div>}
        </div>
      ); })}
      <Modal open={open} onClose={() => { setOpen(false); setEditId(null); }} title={editId?'Edit Goal':'New Goal'}>
        <div style={{ marginBottom: 12 }}><label style={S.label}>Goal Title</label><input value={f.title} onChange={e => setF({...f,title:e.target.value})} style={S.input} placeholder="e.g. Run 50 miles"/></div>
        <div style={{ marginBottom: 14 }}><label style={S.label}>Type</label><div style={{ display: 'flex', gap: 6 }}>{[{id:'periodic',l:'Recurring'},{id:'milestone',l:'Milestone'}].map(t => (<button key={t.id} onClick={() => setF({...f,goal_type:t.id})} style={{ flex: 1, padding: '11px 0', borderRadius: 10, cursor: 'pointer', border: f.goal_type===t.id?`1.5px solid ${ACCENT}`:`1.5px solid ${DIM3}`, background: f.goal_type===t.id?`${ACCENT}15`:'transparent', color: f.goal_type===t.id?'#fff':DIM, fontSize: 12.5, fontFamily: MONO, fontWeight: 700 }}>{t.l}</button>))}</div></div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}><div style={{ flex: 1 }}><label style={S.label}>Target</label><input type="number" value={f.target} onChange={e => setF({...f,target:e.target.value})} style={S.input}/></div><div style={{ flex: 1 }}><label style={S.label}>Unit</label><select value={f.unit} onChange={e => setF({...f,unit:e.target.value})} style={S.input}><option value="sessions">Sessions</option><option value="kcal">Calories</option><option value="minutes">Minutes</option><option value="workouts">Workouts</option><option value="custom">Custom</option></select></div></div>
        {f.goal_type==='periodic' && <div style={{ marginBottom: 12 }}><label style={S.label}>Period</label><div style={{ display: 'flex', gap: 6 }}>{['day','week','month'].map(p => (<button key={p} onClick={() => setF({...f,period:p})} style={{ flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer', border: f.period===p?`1.5px solid ${ACCENT}`:`1.5px solid ${DIM3}`, background: f.period===p?`${ACCENT}15`:'transparent', color: f.period===p?'#fff':DIM, fontSize: 12, fontFamily: MONO, fontWeight: 700, textTransform: 'uppercase' }}>{p}</button>))}</div></div>}
        {f.goal_type==='milestone' && <div style={{ marginBottom: 12 }}><label style={S.label}>Current Progress</label><input type="number" value={f.current} onChange={e => setF({...f,current:e.target.value})} style={S.input}/></div>}
        <div style={{ marginBottom: 18 }}><label style={S.label}>Color</label><div style={{ display: 'flex', gap: 7 }}>{GCOLORS.map(c => (<button key={c} onClick={() => setF({...f,color:c})} style={{ width: 36, height: 36, borderRadius: 9, background: c, cursor: 'pointer', border: f.color===c?'2.5px solid #fff':'2.5px solid transparent', opacity: f.color===c?1:0.45, transition: 'all 0.2s' }}/>))}</div></div>
        <button onClick={save} disabled={!f.title.trim()} style={{ ...S.pri, opacity: f.title.trim()?1:0.35 }}>{editId?'Update':'Create'} Goal</button>
      </Modal>
    </div>
  );
}
