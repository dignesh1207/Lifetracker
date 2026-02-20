import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, Bar, Empty } from '../components/Shared';
import { S, ACCENT, YELLOW, DIM, DIM3, MONO, todayStr, weekStart, monthStart, fmtDate, nd } from '../styles/theme';

export default function WorkHours() {
  const { workHours, addWorkHour, deleteWorkHour } = useApp();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ place: '', hours: '', date: todayStr(), notes: '' });

  const today = todayStr(), ws = weekStart(), ms = monthStart();
  const todayHrs = workHours.filter(w => nd(w.date) === today).reduce((s, w) => s + w.hours, 0);
  const weekHrs = workHours.filter(w => nd(w.date) >= ws).reduce((s, w) => s + w.hours, 0);
  const monthHrs = workHours.filter(w => nd(w.date) >= ms).reduce((s, w) => s + w.hours, 0);

  // Get unique places for this month with total hours
  const places = {};
  workHours.filter(w => nd(w.date) >= ms).forEach(w => {
    places[w.place] = (places[w.place] || 0) + w.hours;
  });
  const placeList = Object.entries(places).sort((a, b) => b[1] - a[1]);

  const add = async () => {
    if (!f.place.trim() || !f.hours) return;
    await addWorkHour({ ...f, hours: +f.hours });
    setF({ place: '', hours: '', date: todayStr(), notes: '' });
    setOpen(false);
  };

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div style={S.card}>
          <div style={{ fontSize: 10, color: DIM, fontFamily: MONO, letterSpacing: 1.5, fontWeight: 700 }}>TODAY</div>
          <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 4 }}>{todayHrs.toFixed(1)}</div>
          <div style={{ fontSize: 11, color: DIM, fontWeight: 600 }}>hours</div>
        </div>
        <div style={S.card}>
          <div style={{ fontSize: 10, color: DIM, fontFamily: MONO, letterSpacing: 1.5, fontWeight: 700 }}>WEEK</div>
          <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: ACCENT, marginTop: 4 }}>{weekHrs.toFixed(1)}</div>
          <div style={{ fontSize: 11, color: DIM, fontWeight: 600 }}>hours</div>
        </div>
        <div style={S.card}>
          <div style={{ fontSize: 10, color: DIM, fontFamily: MONO, letterSpacing: 1.5, fontWeight: 700 }}>MONTH</div>
          <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: YELLOW, marginTop: 4 }}>{monthHrs.toFixed(1)}</div>
          <div style={{ fontSize: 11, color: DIM, fontWeight: 600 }}>hours</div>
        </div>
      </div>

      {/* Places Breakdown */}
      {placeList.length > 0 && (
        <div style={S.card}>
          <div style={S.cl}>Places · This Month</div>
          {placeList.map(([place, hrs]) => (
            <div key={place} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place}</span>
              <div style={{ width: 80 }}><Bar value={hrs} max={monthHrs} color={ACCENT} h={5}/></div>
              <span style={{ fontFamily: MONO, fontSize: 13, color: ACCENT, fontWeight: 700, width: 50, textAlign: 'right' }}>{hrs.toFixed(1)}h</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setOpen(true)} style={S.addBtn}>+ Log Work Hours</button>

      {!workHours.length && <Empty icon="⏱" text="No work hours logged yet"/>}

      {/* History */}
      {workHours.slice(0, 30).map(w => (
        <div key={w.id} style={S.li}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: DIM3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: ACCENT, flexShrink: 0, fontWeight: 800 }}>⏱</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.place}</div>
            <div style={{ fontSize: 12, color: DIM, fontFamily: MONO, fontWeight: 500 }}>
              {fmtDate(w.date)} · {w.hours}h{w.notes ? ` · ${w.notes}` : ''}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: ACCENT }}>{w.hours}h</span>
            <button onClick={() => deleteWorkHour(w.id)} style={S.del}>✕</button>
          </div>
        </div>
      ))}

      <Modal open={open} onClose={() => setOpen(false)} title="Log Work Hours">
        <div style={{ marginBottom: 12 }}>
          <label style={S.label}>Place / Company</label>
          <input value={f.place} onChange={e => setF({...f, place: e.target.value})} style={S.input} placeholder="Office, Client site, Remote..."/>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Hours</label>
            <input type="number" step="0.5" value={f.hours} onChange={e => setF({...f, hours: e.target.value})} style={S.input} placeholder="8" inputMode="decimal"/>
          </div>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Date</label>
            <input type="date" value={f.date} onChange={e => setF({...f, date: e.target.value})} style={S.input}/>
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={S.label}>Notes (optional)</label>
          <input value={f.notes} onChange={e => setF({...f, notes: e.target.value})} style={S.input} placeholder="Project, task details..."/>
        </div>
        <button onClick={add} disabled={!f.place.trim() || !f.hours} style={{ ...S.pri, opacity: f.place.trim() && f.hours ? 1 : 0.35 }}>Save Work Hours</button>
      </Modal>
    </div>
  );
}
