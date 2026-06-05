import dbConnect from '../../lib/mongoose';
import Entry from '../../models/Entry';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    const { from, to, kind, q } = req.query;
    const filter = {};
    if (from || to) filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
    if (kind) filter.kind = kind;
    if (q) filter.$or = [ { note: new RegExp(q, 'i') }, { category: new RegExp(q, 'i') } ];
    const entries = await Entry.find(filter).sort({ date: -1 }).limit(1000).lean();
    return res.status(200).json({ data: entries });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      const entry = await Entry.create(body);
      return res.status(201).json({ data: entry });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
