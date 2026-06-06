import dbConnect from '../../../lib/mongoose';
import Entry from '../../../models/Entry';

export default async function handler(req, res) {
  await dbConnect();

  const ADMIN_PASSWORD = process.env.REMOVE_CATEGORY_PASSWORD || process.env.ADMIN_PASSWORD;
  const provided = (req.headers['x-admin-password']) || (req.method === 'GET' ? req.query.password : req.body && req.body.password);
  const cookieAuth = req.cookies && req.cookies.admin_auth === '1';
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Server misconfigured: missing admin password in env' });
  }
  if (provided !== ADMIN_PASSWORD && !cookieAuth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    query: { id },
    method,
  } = req;

  if (method === 'GET') {
    const entry = await Entry.findById(id).lean();
    if (!entry) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ data: entry });
  }

  if (method === 'PUT') {
    try {
      const allowed = ['kind','date','note','amount','recurring'];
      const patch = {};
      for (const k of allowed) if (req.body[k] !== undefined) patch[k] = req.body[k];
      if (patch.amount !== undefined) patch.amount = Number(patch.amount);
      if (patch.date) patch.date = new Date(patch.date);
      const updated = await Entry.findByIdAndUpdate(id, patch, { new: true });
      return res.status(200).json({ data: updated });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  if (method === 'DELETE') {
    try {
      await Entry.findByIdAndDelete(id);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', ['GET','PUT','DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
