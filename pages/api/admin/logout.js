export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `admin_auth=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`);
  return res.status(200).json({ ok: true });
}
