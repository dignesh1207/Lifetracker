import { useApp } from '../context/AppContext';
import Ring from '../components/Ring';
import ProgressBar from '../components/ProgressBar';
import MiniChart from '../components/MiniChart';
import { S, ACCENT, DIM, FONT_MONO, RED, todayStr, weekStart, monthStart, last7, fmtMoney } from '../styles/theme';

export default function Dashboard() {
  const { tasks, habits, habitLog, workouts, transactions, goals } = useApp();

  const today = todayStr();
  const ws = weekStart();
  const ms = monthStart();
  const openTasks = tasks.filter((t) => !t.done).length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const todayH = habitLog.filter((l) => l.date === today).length;
  const weekW = workouts.filter((w) => w.date >= ws);
  const inc = transactions.filter((tx) => tx.type === 'income' && tx.date >= ms).reduce((s, tx) => s + tx.amount, 0);
  const exp = transactions.filter((tx) => tx.type === 'expense' && tx.date >= ms).reduce((s, tx) => s + tx.amount, 0);

  const chartData = last7().map((d) => ({
    label: new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
    v: workouts.filter((w) => w.date === d).reduce((s, w) => s + w.calories, 0),
    today: d === today,
  }));

  const goalProgress = (g) => {
    if (g.goal_type === 'milestone') return g.current || 0;
    const start = g.period === 'day' ? today : g.period === 'week' ? ws : ms;
    const f = workouts.filter((w) => w.date >= start);
    if (g.unit === 'sessions') return f.length;
    if (g.unit === 'kcal') return f.reduce((s, w) => s + (w.calories || 0), 0);
    if (g.unit === 'minutes') return f.reduce((s, w) => s + (w.duration || 0), 0);
    return 0;
  };

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={S.card}>
          <div style={S.cardLabel}>Tasks</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={S.bigNum}>{openTasks}</span>
            <span style={{ fontSize: 11, color: DIM }}>open</span>
          </div>
          <div style={{ marginTop: 8 }}><ProgressBar value={doneTasks} max={doneTasks + openTasks} /></div>
        </div>
        <div style={S.card}>
          <div style={S.cardLabel}>Habits</div>
          <Ring value={todayH} max={habits.length} size={52} stroke={3.5}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 600, color: '#fff' }}>{todayH}/{habits.length}</span>
          </Ring>
        </div>
      </div>

      {/* Fitness Chart */}
      <div style={S.card}>
        <div style={S.cardLabel}>Fitness · This Week</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <span style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: 600, color: '#fff' }}>{weekW.length}</span>
            <span style={{ fontSize: 11, color: DIM, marginLeft: 4 }}>sessions</span>
          </div>
          <div style={{ fontSize: 12, color: DIM, fontFamily: FONT_MONO }}>
            {weekW.reduce((s, w) => s + w.calories, 0)} kcal
          </div>
        </div>
        <MiniChart data={chartData} />
      </div>

      {/* Finance */}
      <div style={S.card}>
        <div style={S.cardLabel}>Finance · This Month</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <div>
            <div style={{ fontSize: 10, color: DIM, fontFamily: FONT_MONO, marginBottom: 2 }}>INCOME</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 600, color: ACCENT }}>{fmtMoney(inc)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: DIM, fontFamily: FONT_MONO, marginBottom: 2 }}>EXPENSES</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 600, color: RED }}>{fmtMoney(exp)}</div>
          </div>
        </div>
        <div style={{ marginTop: 10, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: DIM }}>Net</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: inc - exp >= 0 ? ACCENT : RED }}>{fmtMoney(inc - exp)}</span>
        </div>
      </div>

      {/* Goals */}
      {goals.length > 0 && (
        <div style={S.card}>
          <div style={S.cardLabel}>Goals</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
            {goals.slice(0, 3).map((g) => {
              const p = goalProgress(g);
              return (
                <div key={g.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{p >= g.target ? '✓ ' : ''}{g.title}</span>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: DIM }}>{p}/{g.target}</span>
                  </div>
                  <ProgressBar value={p} max={g.target} color={g.color || ACCENT} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
