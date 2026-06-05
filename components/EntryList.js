export default function EntryList({ entries = [] }) {
  return (
    <div style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderRadius: 8, padding: 12 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Entries</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', fontSize: 13, color: '#6b7280' }}><th>Date</th><th>Kind</th><th>Category</th><th>Note</th><th style={{ textAlign: 'right' }}>Amount</th></tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr key={e._id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '8px 0' }}>{new Date(e.date).toLocaleDateString()}</td>
                <td>{e.kind}</td>
                <td>{e.category}</td>
                <td>{e.note}</td>
                <td style={{ textAlign: 'right' }}>{e.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
