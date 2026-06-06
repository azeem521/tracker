import { useState } from 'react';
import axios from 'axios';

export default function EntryForm({ onSaved }) {
  const [form, setForm] = useState({ kind: 'expense', date: new Date().toISOString().slice(0,10), note: '', amount: '' });

  async function submit(e) {
    e.preventDefault();
    await axios.post('/api/entries', { ...form, amount: Number(form.amount), date: new Date(form.date) });
    setForm({ kind: 'expense', date: new Date().toISOString().slice(0,10), note: '', amount: '' });
    onSaved && onSaved();
    try { const { showToast } = await import('./ToastContainer'); showToast('success', 'Entry added'); } catch(e){ /* ignore */ }
  }

  return (
    <form onSubmit={submit} className="card">
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select style={{ flex: '1 1 140px' }} value={form.kind} onChange={e=>setForm({...form, kind: e.target.value})}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="charity">Charity</option>
            <option value="saving">Saving</option>
          </select>
          <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} style={{ flex: '1 1 160px' }} />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder="Note (optional)" value={form.note} onChange={e=>setForm({...form, note: e.target.value})} style={{ flex: '1 1 200px' }} />
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="number" step="0.01" value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} placeholder="Amount" style={{ flex: 1 }} />
          <button className="btn" type="submit">Add</button>
        </div>
      </div>
    </form>
  )
}
