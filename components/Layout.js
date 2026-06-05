export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc' }}>
      <header style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Expance Tracker</div>
          <nav>
            <a style={{ fontSize: 13, color: '#4b5563', textDecoration: 'none' }}>Dashboard</a>
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 1024, margin: '0 auto', padding: 16 }}>{children}</main>
    </div>
  )
}