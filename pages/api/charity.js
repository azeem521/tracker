import dbConnect from '../../lib/mongoose';
import CharityGoal from '../../models/CharityGoal';
import Entry from '../../models/Entry';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth()+1;
    const year = parseInt(req.query.year) || now.getFullYear();
    const goal = await CharityGoal.findOne({ month, year }).lean();
    const start = new Date(year, month-1, 1);
    const end = new Date(year, month, 0, 23,59,59);
    const donated = await Entry.aggregate([
      { $match: { kind: 'charity', date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const total = donated[0]?.total || 0;
    return res.status(200).json({ goal: goal?.goal || 0, donated: total });
  }

  if (req.method === 'POST') {
    const { month, year, goal } = req.body;
    const doc = await CharityGoal.findOneAndUpdate({ month, year }, { goal }, { upsert: true, new: true });
    return res.status(200).json({ data: doc });
  }
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
}
