import { useApp } from '../context/AppContext';
import { Ring, Bar, Chart } from '../components/Shared';
import { S, ACCENT, DIM, RED, MONO, todayStr, weekStart, monthStart, last7, fmtMoney, nd } from '../styles/theme';

export default function Dashboard() {
  const { tasks, habits, habitLog, workouts, transactions, goals, workHours } = useApp();
  const today = todayStr(), ws = weekStart(), ms = monthStart();
  const openT = tasks.filter(t => !t.done).length, doneT = tasks.filter(t => t.done).length;
  const todayH = habitLog.filter(l => l.date === today).length;
  const weekW = workouts.filter(w => nd(w.date) >= ws);
  const inc = transactions.filter(tx => tx.type === 'income' && nd(tx.date) >= ms).reduce((s, tx) => s + tx.amount, 0);
  const exp = transactions.filter(tx => tx.type === 'expense' && nd(tx.date) >= ms).reduce((s, tx) => s + tx.amount, 0);
  const weekHrs = workHours.filter(w => nd(w.date) >= ws).reduce((s, w) => s + w.hours, 0);

  const goalProg = g => {
    if (g.goal_type === 'milestone') return g.current || 0;
    const st = g.period === 'day' ? today : g.period === 'week' ? ws : ms;
    const f = workouts.filter(w => nd(w.date) >= st);
    if (g.unit === 'sessions') return f.length;
    if (g.unit === 'kcal') return f.reduce((s, w) => s + (w.calories || 0), 0);
    if (g.unit === 'minutes') return f.reduce((s, w) => s + (w.duration || 0), 0);
    return 0;
  };

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={S.card}><div style={S.cl}>Tasks</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}><span style={S.big}>{openT}</span><span style={{ fontSize: 13, color: DIM, fontWeight: 600 }}>open</span></div><div style={{ marginTop: 8 }}><Bar value={doneT} max={doneT + openT}/></div></div>
        <div style={S.card}><div style={S.cl}>Habits</div><Ring value={todayH} max={habits.length} size={56} stroke={4}><span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: '#fff' }}>{todayH}/{habits.length}</span></Ring></div>
      </div>

      <div style={S.card}>
        <div style={S.cl}>Fitness · This Week</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div><span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: '#fff' }}>{weekW.length}</span><span style={{ fontSize: 13, color: DIM, fontWeight: 600, marginLeft: 5 }}>sessions</span></div>
          <div style={{ fontSize: 13, color: DIM, fontFamily: MONO, fontWeight: 600 }}>{weekW.reduce((s, w) => s + w.calories, 0)} kcal</div>
        </div>
        <Chart data={last7().map(d => ({ l: new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'short'}).charAt(0), v: workouts.filter(w => nd(w.date) === d).reduce((s, w) => s + w.calories, 0), t: d === today }))}/>
      </div>

      {workHours.length > 0 && <div style={S.card}>
        <div style={S.cl}>Work · This Week</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}><span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: ACCENT }}>{weekHrs.toFixed(1)}</span><span style={{ fontSize: 13, color: DIM, fontWeight: 600 }}>hours</span></div>
      </div>}

      <div style={S.card}>
        <div style={S.cl}>Finance · This Month</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <div><div style={{ fontSize: 10.5, color: DIM, fontFamily: MONO, fontWeight: 600, marginBottom: 3 }}>INCOME</div><div style={{ fontFamily: MONO, fontSize: 17, fontWeight: 700, color: ACCENT }}>{fmtMoney(inc)}</div></div>
          <div style={{ textAlign: 'right' }}><div style={{ fontSize: 10.5, color: DIM, fontFamily: MONO, fontWeight: 600, marginBottom: 3 }}>EXPENSES</div><div style={{ fontFamily: MONO, fontSize: 17, fontWeight: 700, color: RED }}>{fmtMoney(exp)}</div></div>
        </div>
        <div style={{ marginTop: 10, padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: DIM, fontWeight: 600 }}>Net</span>
          <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: inc-exp >= 0 ? ACCENT : RED }}>{fmtMoney(inc-exp)}</span>
        </div>
      </div>

      {goals.length > 0 && <div style={S.card}><div style={S.cl}>Goals</div><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{goals.slice(0,3).map(g => { const p = goalProg(g); return (<div key={g.id}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}><span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{p>=g.target?'✓ ':''}{g.title}</span><span style={{ fontFamily: MONO, fontSize: 12, color: DIM, fontWeight: 600 }}>{p}/{g.target}</span></div><Bar value={p} max={g.target} color={g.color||ACCENT}/></div>);})}</div></div>}
    </div>
  );
}
