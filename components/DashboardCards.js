export default function DashboardCards({ summary = {}, monthly = {}, charity = {}, categories = {}, recentCount = 0, zakatStatus = null }) {
  return (
    <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
      <div className="responsive-grid">
        <Card title="Balance" value={summary.balance || 0} />
        <Card title="Total Income (all)" value={summary.totalIncome || 0} />
        <Card title="Total Expense (all)" value={summary.totalExpense || 0} />
        <Card title="Income (this month)" value={monthly.income || 0} />
        <Card title="Expense (this month)" value={monthly.expense || 0} />
        <Card title="Charity (this month)" value={charity.donated || 0} subtitle={`Goal: ${charity.goal || 0}`} />
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <div className="card">
          <div style={{ fontSize: 12, color: '#6b7280' }}>Zakat</div>
          <div style={{ marginTop: 8, fontSize: 14 }}>{zakatStatus || 'Not checked'}</div>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, subtitle }) {
  return (
    <div className="card" style={{ minWidth: 160 }}>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{title}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: '#6b7280' }}>{subtitle}</div>}
    </div>
  )
}
