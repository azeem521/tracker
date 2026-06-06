import { useState } from 'react';
import axios from 'axios';

export default function EntryList({ entries = [], onChange }) {
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function removeEntry(id) {
    if (!confirm('Delete this entry?')) return;
    setBusyId(id);
    try {
      await axios.delete(`/api/entries/${id}`);
      onChange && onChange();
      try { const { showToast } = await import('./ToastContainer'); showToast('success', 'Entry deleted'); } catch(e){}
    } catch (e) {
      alert('Delete failed');
    } finally { setBusyId(null); }
  }

  return (
    <div className="card">
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Entries</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.map(e => (
          <div key={e._id || Math.random()} className="entry-card" style={{ background: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{e.kind} — {e.note || ''}</div>
              <div className="small" style={{ color: '#6b7280' }}>{new Date(e.date).toLocaleDateString()}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{e.amount}</div>
              <button onClick={()=>setEditing(e)} style={{ padding: '6px 10px', borderRadius: 6 }}>Edit</button>
              <button onClick={()=>removeEntry(e._id)} disabled={busyId===e._id} style={{ padding: '6px 10px', borderRadius: 6, background: '#fee2e2' }}>{busyId===e._id ? '...' : 'Delete'}</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <EditModal entry={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); onChange && onChange(); }} />
      )}
    </div>
  )
}

function EditModal({ entry, onClose, onSaved }) {
  const [form, setForm] = useState({ kind: entry.kind, date: new Date(entry.date).toISOString().slice(0,10), note: entry.note || '', amount: String(entry.amount || '') });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(()=>{ function onResize(){ setIsMobile(window.innerWidth<=480);} onResize(); window.addEventListener('resize', onResize); return ()=>window.removeEventListener('resize', onResize); }, []);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/entries/${entry._id}`, { ...form, amount: Number(form.amount), date: form.date });
      onSaved && onSaved();
      try { const { showToast } = await import('./ToastContainer'); showToast('success', 'Entry updated'); } catch(e){}
    } catch (err) {
      alert('Update failed');
    } finally { setLoading(false); }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', zIndex: 1200 }}>
      <form onSubmit={save} style={{ background: '#fff', padding: 16, borderRadius: isMobile ? '12px 12px 0 0' : 8, width: isMobile ? '100%' : 420 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Edit entry</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <select value={form.kind} onChange={e=>setForm({...form, kind: e.target.value})} style={{ flex: '1 1 140px' }}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="charity">Charity</option>
            <option value="saving">Saving</option>
          </select>
          <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} style={{ flex: '1 1 160px' }} />
        </div>
        <input placeholder="Note (optional)" value={form.note} onChange={e=>setForm({...form, note: e.target.value})} style={{ width: '100%', marginBottom: 8 }} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="number" step="0.01" value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} placeholder="Amount" style={{ flex: 1 }} />
          <button className="btn" type="submit" disabled={loading} style={{ padding: isMobile ? '12px 16px' : undefined }}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button type="button" onClick={onClose} style={{ padding: isMobile ? '12px 16px' : '6px 10px', borderRadius: 6 }}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
