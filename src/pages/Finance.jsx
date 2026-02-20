import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, Bar, Empty } from '../components/Shared';
import { S, ACCENT, RED, DIM, DIM3, MONO, ECATS, todayStr, monthStart, fmtDate, fmtMoney, nd } from '../styles/theme';

export default function Finance() {
  const { transactions, addTransaction, deleteTransaction } = useApp();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: '', amount: '', category: 'Food', type: 'expense', date: todayStr() });
  const ms = monthStart();
  const monthTx = transactions.filter(tx => nd(tx.date) >= ms);
  const inc = monthTx.filter(tx => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
  const exp = monthTx.filter(tx => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);
  const add = async () => { if (!f.title.trim() || !f.amount) return; await addTransaction({ ...f, amount: +f.amount }); setF({ title: '', amount: '', category: 'Food', type: 'expense', date: todayStr() }); setOpen(false); };

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={S.card}><div style={{ fontSize: 10, color: DIM, fontFamily: MONO, letterSpacing: 1.5, fontWeight: 700 }}>INCOME</div><div style={{ fontFamily: MONO, fontSize: 19, fontWeight: 800, color: ACCENT, marginTop: 5 }}>{fmtMoney(inc)}</div></div>
        <div style={S.card}><div style={{ fontSize: 10, color: DIM, fontFamily: MONO, letterSpacing: 1.5, fontWeight: 700 }}>EXPENSES</div><div style={{ fontFamily: MONO, fontSize: 19, fontWeight: 800, color: RED, marginTop: 5 }}>{fmtMoney(exp)}</div></div>
      </div>
      {exp > 0 && <div style={S.card}><div style={S.cl}>Breakdown</div>{ECATS.map(cat => { const a = monthTx.filter(tx => tx.type==='expense'&&tx.category===cat).reduce((s,tx)=>s+tx.amount,0); if (!a) return null; return (<div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}><span style={{ fontSize: 12.5, color: DIM, width: 85, fontFamily: MONO, fontWeight: 600 }}>{cat}</span><div style={{ flex: 1 }}><Bar value={a} max={exp} color={DIM} h={5}/></div><span style={{ fontFamily: MONO, fontSize: 12.5, color: '#fff', width: 68, textAlign: 'right', fontWeight: 600 }}>{fmtMoney(a)}</span></div>); })}</div>}
      <button onClick={() => setOpen(true)} style={S.addBtn}>+ Add Transaction</button>
      {!transactions.length && <Empty icon="◈" text="No transactions yet"/>}
      {transactions.slice(0,30).map(tx => (
        <div key={tx.id} style={S.li}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: DIM3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: tx.type==='income'?ACCENT:RED, flexShrink: 0, fontWeight: 800 }}>{tx.type==='income'?'+':'−'}</div>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 15, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.title}</div><div style={{ fontSize: 12, color: DIM, fontFamily: MONO, fontWeight: 500 }}>{tx.category} · {fmtDate(tx.date)}</div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: tx.type==='income'?ACCENT:RED }}>{tx.type==='income'?'+':'−'}{fmtMoney(tx.amount)}</span><button onClick={() => deleteTransaction(tx.id)} style={S.del}>✕</button></div>
        </div>
      ))}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Transaction">
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>{['expense','income'].map(t => (<button key={t} onClick={() => setF({...f, type: t})} style={{ flex: 1, padding: '11px 0', borderRadius: 10, cursor: 'pointer', border: f.type===t?`1.5px solid ${t==='income'?ACCENT:RED}`:`1.5px solid ${DIM3}`, background: f.type===t?`${t==='income'?ACCENT:RED}15`:'transparent', color: f.type===t?'#fff':DIM, fontSize: 13, fontFamily: MONO, fontWeight: 700, textTransform: 'uppercase' }}>{t}</button>))}</div>
        <div style={{ marginBottom: 12 }}><label style={S.label}>Description</label><input value={f.title} onChange={e => setF({...f, title: e.target.value})} style={S.input} placeholder="Coffee, Salary..."/></div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}><div style={{ flex: 1 }}><label style={S.label}>Amount ($)</label><input type="number" value={f.amount} onChange={e => setF({...f, amount: e.target.value})} style={S.input} placeholder="0.00" inputMode="decimal"/></div><div style={{ flex: 1 }}><label style={S.label}>Category</label><select value={f.category} onChange={e => setF({...f, category: e.target.value})} style={S.input}>{ECATS.map(c => <option key={c} value={c}>{c}</option>)}</select></div></div>
        <div style={{ marginBottom: 18 }}><label style={S.label}>Date</label><input type="date" value={f.date} onChange={e => setF({...f, date: e.target.value})} style={S.input}/></div>
        <button onClick={add} disabled={!f.title.trim()||!f.amount} style={{ ...S.pri, opacity: f.title.trim()&&f.amount?1:0.35 }}>Save</button>
      </Modal>
    </div>
  );
}
