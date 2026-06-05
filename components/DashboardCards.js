export default function DashboardCards({ summary = {} }) {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 220, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 12, color: '#6b7280' }}>Total Income</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{summary.totalIncome || 0}</div>
      </div>
      <div style={{ flex: 1, minWidth: 220, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 12, color: '#6b7280' }}>Total Expense</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{summary.totalExpense || 0}</div>
      </div>
      <div style={{ flex: 1, minWidth: 220, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 12, color: '#6b7280' }}>Balance</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{summary.balance || 0}</div>
      </div>
    </div>
  )
}
