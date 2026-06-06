export default function handler(req, res) {
  const ADMIN_PASSWORD = process.env.REMOVE_CATEGORY_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Server misconfigured: missing admin password in env' });
  }

  if (req.method === 'GET') {
    const isAuth = req.cookies && req.cookies.admin_auth === '1';
    return res.status(200).json({ ok: !!isAuth });
  }

  if (req.method === 'POST') {
    const { password } = req.body || {};
    if (password === ADMIN_PASSWORD) {
      const maxAge = 60 * 60 * 24 * 30; // 30 days
      const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
      // HttpOnly so client JS cannot read the cookie; SameSite Lax for general use.
      res.setHeader('Set-Cookie', `admin_auth=1; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`);
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ ok: false });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
