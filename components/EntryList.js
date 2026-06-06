export default function EntryList({ entries = [] }) {
  return (
    <div className="card">
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Entries</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.map(e => (
          <div key={e._id || Math.random()} className="entry-card" style={{ background: '#f9fafb' }}>
            <div className="entry-left">
              <div style={{ fontWeight: 700 }}>{e.kind}</div>
              <div className="small" style={{ color: '#6b7280' }}>{e.note || ''}</div>
              <div className="small" style={{ color: '#6b7280' }}>{new Date(e.date).toLocaleDateString()}</div>
            </div>
            <div className="entry-right">
              <div style={{ fontWeight: 700 }}>{e.kind}</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{e.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
