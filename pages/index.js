import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import EntryForm from '../components/EntryForm';
import EntryList from '../components/EntryList';
import DashboardCards from '../components/DashboardCards';
// Charts removed — prefer actionable textual summaries

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({});
  const [charity, setCharity] = useState({ goal: 0, donated: 0 });
  const [zakatResult, setZakatResult] = useState(null);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()+1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  async function load() {
    const res = await axios.get('/api/entries');
    setEntries(res.data.data || []);
    computeSummary(res.data.data || []);
    try {
      const c = await axios.get('/api/charity');
      setCharity({ goal: c.data.goal || 0, donated: c.data.donated || 0 });
    } catch (e) { console.warn(e); }
  }

  function computeSummary(items) {
    const totalIncome = items.filter(i=>i.kind==='income').reduce((s,i)=>s+i.amount,0);
    const totalExpense = items.filter(i=>i.kind==='expense').reduce((s,i)=>s+i.amount,0);
    const balance = totalIncome - totalExpense;
    setSummary({ totalIncome, totalExpense, balance });
  }

  useEffect(()=>{ load(); },[]);

  async function checkZakat() {
    const threshold = Number(prompt('Enter threshold amount for zakat check'));
    if (!threshold) return;
    const res = await axios.post('/api/zakat', { threshold });
    setZakatResult(res.data.zakatDue ? 'Zakat likely due' : 'No zakat detected');
  }

  function computeForMonth(entries = [], month = selectedMonth, year = selectedYear) {
    const start = new Date(year, month-1, 1);
    const end = new Date(year, month, 0, 23,59,59);
    const monthItems = entries.filter(e => new Date(e.date) >= start && new Date(e.date) <= end);
    return {
      income: monthItems.filter(i=>i.kind==='income').reduce((s,i)=>s+i.amount,0),
      expense: monthItems.filter(i=>i.kind==='expense').reduce((s,i)=>s+i.amount,0),
      charity: monthItems.filter(i=>i.kind==='charity').reduce((s,i)=>s+i.amount,0),
      items: monthItems
    };
  }

  function computeForYear(entries = [], year = selectedYear) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23,59,59);
    const yearItems = entries.filter(e => new Date(e.date) >= start && new Date(e.date) <= end);
    return {
      income: yearItems.filter(i=>i.kind==='income').reduce((s,i)=>s+i.amount,0),
      expense: yearItems.filter(i=>i.kind==='expense').reduce((s,i)=>s+i.amount,0),
      charity: yearItems.filter(i=>i.kind==='charity').reduce((s,i)=>s+i.amount,0),
      items: yearItems
    };
  }

  return (
    <Layout>
      <DashboardCards summary={summary} monthly={computeMonthly(entries)} charity={charity} recentCount={(entries||[]).slice(0,10).length} zakatStatus={zakatResult} />
      <div className="app-main-grid">
        <div>
          <EntryForm onSaved={load} />
          <h3>Recent entries</h3>
          <EntryList entries={(entries||[]).slice(0,10)} />
        </div>
        <div>
          <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Select period</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <select value={selectedMonth} onChange={e=>setSelectedMonth(Number(e.target.value))}>
                {Array.from({length:12}).map((_,i)=> <option key={i+1} value={i+1}>{new Date(0,i).toLocaleString(undefined,{month:'long'})}</option>)}
              </select>
              <select value={selectedYear} onChange={e=>setSelectedYear(Number(e.target.value))}>
                {Array.from({length:6}).map((_,i)=> { const y = now.getFullYear()-2 + i; return <option key={y} value={y}>{y}</option> })}
              </select>
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 13 }}>Month: {selectedMonth}/{selectedYear}</div>
              <div>Income: {computeForMonth(entries, selectedMonth, selectedYear).income}</div>
              <div>Expense: {computeForMonth(entries, selectedMonth, selectedYear).expense}</div>
              <div>Charity: {computeForMonth(entries, selectedMonth, selectedYear).charity}</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Year overview ({selectedYear})</div>
            <div style={{ marginTop: 8 }}>
              <div>Income: {computeForYear(entries, selectedYear).income}</div>
              <div>Expense: {computeForYear(entries, selectedYear).expense}</div>
              <div>Charity: {computeForYear(entries, selectedYear).charity}</div>
            </div>
          </div>
          <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>This month details</div>
            <div style={{ marginTop: 8 }}>
              <div>Income: {computeMonthly(entries).income || 0}</div>
              <div>Expense: {computeMonthly(entries).expense || 0}</div>
              <div>Charity: {charity.donated || 0} / {charity.goal || 0}</div>
            </div>
          </div>
          <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Actions</div>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={load} style={{ padding: '8px 12px', borderRadius: 6 }}>Refresh data</button>
              <button onClick={checkZakat} style={{ padding: '8px 12px', borderRadius: 6 }}>Run Zakat check</button>
              <button onClick={() => { localStorage.removeItem('reminderDisabled'); localStorage.removeItem('reminderSnoozeUntil'); alert('Reminders reset'); }} style={{ padding: '8px 12px', borderRadius: 6 }}>Reset reminders</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function computeMonthly(entries = []) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23,59,59);
  const monthItems = entries.filter(e => new Date(e.date) >= start && new Date(e.date) <= end);
  return {
    income: monthItems.filter(i=>i.kind==='income').reduce((s,i)=>s+i.amount,0),
    expense: monthItems.filter(i=>i.kind==='expense').reduce((s,i)=>s+i.amount,0),
  };
}

