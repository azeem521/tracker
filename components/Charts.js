import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Charts({ entries = [] }) {
  const labels = [];
  const dataMap = {};
  entries.slice().reverse().forEach(e => {
    const d = new Date(e.date).toISOString().slice(0,10);
    if (!dataMap[d]) dataMap[d]=0;
    dataMap[d] += (e.kind === 'income' ? e.amount : -e.amount);
  });
  Object.keys(dataMap).sort().forEach(k=>labels.push(k));
  const data = labels.map(l=>dataMap[l]);
  return (
    <div style={{ marginBottom: 16 }}>
      <h3>Trend</h3>
      <div style={{ height: 240 }}>
        <Line data={{ labels, datasets: [{ label: 'Daily net', data, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.2)' }] }} />
      </div>
    </div>
  )
}
