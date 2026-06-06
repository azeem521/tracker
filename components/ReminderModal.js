import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReminderModal({ open, setOpen }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ kind: 'expense', amount: '', note: '' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    tryOpen();
    function onResize() { setIsMobile(window.innerWidth <= 480); }
    onResize();
    window.addEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function tryOpen() {
    const disabled = localStorage.getItem('reminderDisabled') === 'true';
    const snooze = Number(localStorage.getItem('reminderSnoozeUntil') || 0);
    if (disabled) return;
    if (snooze && Date.now() < snooze) return;
    const h = new Date().getHours();
    if (h >= 18 || h < 6) {
      setShow(true);
      setOpen && setOpen(true);
      // ask for notification permission (best-effort)
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission().catch(()=>{});
      }
    }
  }

  async function submit(e) {
    e && e.preventDefault();
    setLoading(true);
    try {
    const payload = { ...form, amount: Number(form.amount), date: new Date() };
      await axios.post('/api/entries', payload);
      // small notification
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('Entry saved', { body: `${form.kind} ${form.amount}` });
      }
      setShow(false);
      setOpen && setOpen(false);
      try { const { showToast } = await import('./ToastContainer'); showToast('success', 'Entry saved'); } catch(e){}
      window.setTimeout(()=>window.location.reload(), 300);
    } catch (err) {
      console.error(err);
      alert('Failed to save entry');
    } finally {
      setLoading(false);
    }
  }

  function snooze(hours = 2) {
    const until = Date.now() + hours * 60 * 60 * 1000;
    localStorage.setItem('reminderSnoozeUntil', String(until));
    setShow(false);
    setOpen && setOpen(false);
  }

  function disableForever() {
    localStorage.setItem('reminderDisabled', 'true');
    setShow(false);
    setOpen && setOpen(false);
  }

  if (!show) return null;

  const sheetStyle = isMobile ? { width: '100%', borderRadius: '12px 12px 0 0', padding: 16 } : { width: 'min(420px, calc(100% - 32px))', borderRadius: 8, padding: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', zIndex: 60 }}>
      <div style={{ background: '#fff', ...sheetStyle }}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Quick reminder — Add today's entry</h3>
        <p style={{ marginTop: 0, marginBottom: 12, color: '#6b7280' }}>It's good to record income or expenses before sleeping.</p>
        <form onSubmit={submit}>
          <div style={{ display: 'grid', gap: 8 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Type</label>
              <select value={form.kind} onChange={e=>setForm({...form, kind: e.target.value})} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="charity">Charity</option>
                <option value="saving">Saving</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Amount</label>
              <input type="number" step="0.01" value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </div>
            {/* category removed */}
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Note</label>
              <input value={form.note} onChange={e=>setForm({...form, note: e.target.value})} placeholder="Note (optional)" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8, flexWrap: 'wrap' }}>
              <button type="button" onClick={()=>snooze(2)} style={{ background: '#f3f4f6', border: 'none', padding: isMobile ? '12px 16px' : '8px 12px', borderRadius: 8 }}>Snooze 2h</button>
              <button type="button" onClick={disableForever} style={{ background: '#fef2f2', border: 'none', padding: isMobile ? '12px 16px' : '8px 12px', borderRadius: 8, color: '#b91c1c' }}>Don't show</button>
              <button type="submit" disabled={loading} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: isMobile ? '12px 16px' : '8px 12px', borderRadius: 8 }}>Add</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
