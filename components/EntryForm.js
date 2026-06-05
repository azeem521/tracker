import { useState } from 'react';
import axios from 'axios';

export default function EntryForm({ onSaved }) {
  const [form, setForm] = useState({ kind: 'expense', date: new Date().toISOString().slice(0,10), category: '', note: '', amount: 0 });

  async function submit(e) {
    e.preventDefault();
    await axios.post('/api/entries', { ...form, amount: Number(form.amount), date: new Date(form.date) });
    setForm({ kind: 'expense', date: new Date().toISOString().slice(0,10), category: '', note: '', amount: 0 });
    onSaved && onSaved();
  }

  return (
    <form onSubmit={submit} style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', gap: 8 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Type</label>
          <select style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 6, padding: 8 }} value={form.kind} onChange={e=>setForm({...form, kind: e.target.value})}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="charity">Charity</option>
            <option value="saving">Saving</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Date</label>
          <input style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 6, padding: 8 }} type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Category</label>
          <input style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 6, padding: 8 }} placeholder="Category" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Note</label>
          <input style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 6, padding: 8 }} placeholder="Note" value={form.note} onChange={e=>setForm({...form, note: e.target.value})} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Amount</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 6, padding: 8 }} type="number" step="0.01" value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} />
            <button style={{ background: '#2563eb', color: '#fff', padding: '8px 12px', borderRadius: 6, border: 'none' }} type="submit">Add</button>
          </div>
        </div>
      </div>
    </form>
  )
}
