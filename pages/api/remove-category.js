import dbConnect from '../../lib/mongoose';
import Entry from '../../models/Entry';

// Utility endpoint to inspect and remove the legacy `category` field from existing entries.
// GET: returns count of documents that still contain `category`.
// POST: unsets `category` on all documents and returns the update summary.

export default async function handler(req, res) {
  await dbConnect();

  const ADMIN_PASSWORD = process.env.REMOVE_CATEGORY_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Server misconfigured: missing admin password in env' });
  }

  // Accept password via header `x-admin-password`, POST body `{ password }`, query `?password=`,
  // or an HttpOnly cookie `admin_auth` set by /api/admin/login.
  const provided = (req.headers['x-admin-password']) || (req.method === 'GET' ? req.query.password : req.body && req.body.password);
  const cookieAuth = req.cookies && req.cookies.admin_auth === '1';
  if (provided !== ADMIN_PASSWORD && !cookieAuth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const count = await Entry.countDocuments({ category: { $exists: true } });
    return res.status(200).json({ count });
  }

  if (req.method === 'POST') {
    try {
      const result = await Entry.updateMany({ category: { $exists: true } }, { $unset: { category: "" } });
      return res.status(200).json({ ok: true, result });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
}
