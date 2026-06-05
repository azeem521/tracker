import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import EntryForm from '../components/EntryForm';
import EntryList from '../components/EntryList';
import DashboardCards from '../components/DashboardCards';
import Charts from '../components/Charts';

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({});

  async function load() {
    const res = await axios.get('/api/entries');
    setEntries(res.data.data || []);
    computeSummary(res.data.data || []);
  }

  function computeSummary(items) {
    const totalIncome = items.filter(i=>i.kind==='income').reduce((s,i)=>s+i.amount,0);
    const totalExpense = items.filter(i=>i.kind==='expense').reduce((s,i)=>s+i.amount,0);
    const balance = totalIncome - totalExpense;
    setSummary({ totalIncome, totalExpense, balance });
  }

  useEffect(()=>{ load(); },[]);

  return (
    <Layout>
      <h1>Expense Tracker</h1>
      <DashboardCards summary={summary} />
      <Charts entries={entries} />
      <EntryForm onSaved={load} />
      <EntryList entries={entries} onChanged={load} />
    </Layout>
  );
}
