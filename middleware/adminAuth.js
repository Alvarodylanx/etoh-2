function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  const expected = process.env.ADMIN_PASSWORD || 'etoh_admin_2024';
  if (!key || key !== expected) {
    return res.status(401).json({ error: 'Admin access denied.' });
  }
  next();
}

module.exports = { requireAdmin };
