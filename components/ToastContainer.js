import { useEffect, useState } from 'react';

let globalShow;

export function showToast(type, message, timeout = 3000) {
  if (globalShow) globalShow({ type, message, timeout });
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    globalShow = (t) => {
      const id = Math.random().toString(36).slice(2,9);
      setToasts(s => [...s, { id, ...t }]);
      setTimeout(() => {
        setToasts(s => s.filter(x => x.id !== id));
      }, t.timeout || 3000);
    };
    return () => { globalShow = null; };
  }, []);

  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} role="status" aria-live="polite" style={{
          minWidth: 200,
          maxWidth: 320,
          padding: '10px 14px',
          borderRadius: 10,
          color: '#fff',
          background: t.type === 'error' ? '#dc2626' : (t.type === 'warning' ? '#f59e0b' : '#16a34a'),
          boxShadow: '0 8px 24px rgba(2,6,23,0.2)',
          transform: 'translateY(0)',
          animation: 'toast-in 360ms ease'
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.type === 'error' ? 'Error' : t.type === 'warning' ? 'Notice' : 'Success'}</div>
          <div style={{ fontSize: 14 }}>{t.message}</div>
        </div>
      ))}

      <style>{`@keyframes toast-in { from { opacity: 0; transform: translateY(10px) scale(0.98);} to { opacity: 1; transform: translateY(0) scale(1);} }`}</style>
    </div>
  );
}

export { globalShow as _globalShow };
