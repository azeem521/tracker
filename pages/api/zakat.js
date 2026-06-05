import dbConnect from '../../lib/mongoose';
import Entry from '../../models/Entry';
import dayjs from 'dayjs';

// Simplified zakat checker: user provides threshold amount; server calculates if balance
// stayed above threshold for ~354 days (lunar year). This is a scaffold — adapt for real alerts.

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'POST') {
    const { threshold } = req.body;
    if (!threshold) return res.status(400).json({ error: 'threshold required' });
    // For scaffold: compute daily balances for last 400 days and find periods above threshold
    const end = dayjs();
    const start = end.subtract(400, 'day').toDate();
    const entries = await Entry.find({ date: { $gte: start } }).lean();
    // compute balance by day
    const map = {};
    entries.forEach(e => {
      const d = dayjs(e.date).format('YYYY-MM-DD');
      map[d] = (map[d] || 0) + (e.kind === 'income' ? e.amount : -e.amount);
    });
    const dates = [];
    let running = 0;
    for (let i = 0; i < 400; i++) {
      const d = end.subtract(i, 'day').format('YYYY-MM-DD');
      running += map[d] || 0;
      dates.unshift({ date: d, balance: running });
    }
    // find any span of 354 consecutive days where balance >= threshold on every day
    const L = dates.length;
    const windowLen = 354;
    let zakatDue = false;
    for (let i = 0; i + windowLen <= L; i++) {
      const win = dates.slice(i, i+windowLen);
      if (win.every(x => x.balance >= threshold)) {
        zakatDue = true;
        break;
      }
    }
    return res.status(200).json({ zakatDue });
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end();
}
