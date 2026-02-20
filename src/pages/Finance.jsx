import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import { S, ACCENT, RED, DIM, DIM3, FONT_MONO, EXPENSE_CATS, todayStr, monthStart, fmtDate, fmtMoney } from '../styles/theme';

export default function Finance() {
  const { transactions, addTransaction, deleteTransaction } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', type: 'expense', date: todayStr() });

  const ms = monthStart();
  const monthTx = transactions.filter((tx) => tx.date >= ms);
  const income = monthTx.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
  const expenses = monthTx.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);

  const handleAdd = async () => {
    if (!form.title.trim() || !form.amount) return;
    await addTransaction({ ...form, amount: +form.amount });
    setForm({ title: '', amount: '', category: 'Food', type: 'expense', date: todayStr() });
    setOpen(false);
  };

  return (
    <div style={{ ...S.grid, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={S.card}>
          <div style={{ fontSize: 9, color: DIM, fontFamily: FONT_MONO, letterSpacing: 1.5 }}>INCOME</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: ACCENT, marginTop: 4 }}>{fmtMoney(income)}</div>
        </div>
        <div style={S.card}>
          <div style={{ fontSize: 9, color: DIM, fontFamily: FONT_MONO, letterSpacing: 1.5 }}>EXPENSES</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: RED, marginTop: 4 }}>{fmtMoney(expenses)}</div>
        </div>
      </div>

      {expenses > 0 && (
        <div style={S.card}>
          <div style={S.cardLabel}>Breakdown</div>
          {EXPENSE_CATS.map((cat) => {
            const amt = monthTx.filter((tx) => tx.type === 'expense' && tx.category === cat).reduce((s, tx) => s + tx.amount, 0);
            if (amt === 0) return null;
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: DIM, width: 80, fontFamily: FONT_MONO }}>{cat}</span>
                <div style={{ flex: 1 }}><ProgressBar value={amt} max={expenses} color={DIM} height={4} /></div>
                <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: '#fff', width: 64, textAlign: 'right' }}>{fmtMoney(amt)}</span>
              </div>
            );
          })}
        </div>
      )}

      <button onClick={() => setOpen(true)} style={S.addBtn}>+ Add Transaction</button>

      {transactions.length === 0 && <EmptyState icon="◈" text="No transactions yet" />}

      {transactions.slice(0, 30).map((tx) => (
        <div key={tx.id} style={S.listItem}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: DIM3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: tx.type === 'income' ? ACCENT : RED, flexShrink: 0, fontWeight: 700 }}>
            {tx.type === 'income' ? '+' : '−'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.title}</div>
            <div style={{ fontSize: 11, color: DIM, fontFamily: FONT_MONO }}>{tx.category} · {fmtDate(tx.date)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: tx.type === 'income' ? ACCENT : RED }}>
              {tx.type === 'income' ? '+' : '−'}{fmtMoney(tx.amount)}
            </span>
            <button onClick={() => deleteTransaction(tx.id)} style={S.delBtn}>✕</button>
          </div>
        </div>
      ))}

      <Modal open={open} onClose={() => setOpen(false)} title="Add Transaction">
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {['expense', 'income'].map((t) => (
            <button key={t} onClick={() => setForm({ ...form, type: t })} style={{
              flex: 1, padding: '10px 0', borderRadius: 8, cursor: 'pointer',
              border: form.type === t ? `1.5px solid ${t === 'income' ? ACCENT : RED}` : `1.5px solid ${DIM3}`,
              background: form.type === t ? `${t === 'income' ? ACCENT : RED}15` : 'transparent',
              color: form.type === t ? '#fff' : DIM, fontSize: 12, fontFamily: FONT_MONO, textTransform: 'uppercase',
            }}>{t}</button>
          ))}
        </div>
        <div style={{ marginBottom: 12 }}><label style={S.label}>Description</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={S.input} placeholder="Coffee, Salary..." /></div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><label style={S.label}>Amount ($)</label><input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={S.input} placeholder="0.00" /></div>
          <div style={{ flex: 1 }}><label style={S.label}>Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={S.input}>{EXPENSE_CATS.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
        </div>
        <div style={{ marginBottom: 18 }}><label style={S.label}>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={S.input} /></div>
        <button onClick={handleAdd} disabled={!form.title.trim() || !form.amount} style={{ ...S.primaryBtn, opacity: form.title.trim() && form.amount ? 1 : 0.35 }}>Save</button>
      </Modal>
    </div>
  );
}
