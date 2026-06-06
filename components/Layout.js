import { useEffect, useState } from 'react';
import ReminderModal from './ReminderModal';

export default function Layout({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check server-side cookie for admin auth
    fetch('/api/admin/login')
      .then(r => r.json())
      .then(data => {
        if (!data.ok) setAuthOpen(true);
      })
      .catch(() => setAuthOpen(true))
      .finally(() => setChecking(false));
  }, []);

  async function submitPassword(e) {
    e && e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      if (res.ok) {
        const body = await res.json();
        if (body.ok) {
          setAuthOpen(false);
          setLoading(false);
          return;
        }
      }
      setError('Invalid password');
      setLoading(false);
    } catch (e) {
      setError('Network error');
      setLoading(false);
    }
  }

  if (checking) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Checking...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc' }}>
      <header style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Expense Tracker</div>
          <nav>
            <a style={{ fontSize: 13, color: '#4b5563', textDecoration: 'none' }}>Dashboard</a>
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 1024, margin: '0 auto', padding: 16 }}>{children}</main>
      <ReminderModal open={modalOpen} setOpen={setModalOpen} />

      {authOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={submitPassword} style={{ background: '#fff', padding: 24, borderRadius: 10, width: 'min(520px, 92%)', boxShadow: '0 12px 48px rgba(2,6,23,0.2)' }} aria-labelledby="unlock-title">
            <div id="unlock-title" style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Unlock Expense Tracker</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Enter your password to continue. This device will remain unlocked until the cookie expires.</div>

            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Password</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input autoFocus aria-label="Password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" type={showPassword ? 'text' : 'password'} style={{ flex: 1, padding: '10px 12px', marginBottom: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <button type="button" onClick={()=>setShowPassword(s=>!s)} style={{ padding: '8px 10px', borderRadius: 8, background: '#f3f4f6', border: '1px solid #e5e7eb' }}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>

            {error && <div role="alert" style={{ color: 'red', marginTop: 6 }}>{error}</div>}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button type="submit" className="btn" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>{loading ? 'Unlocking...' : 'Unlock'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}