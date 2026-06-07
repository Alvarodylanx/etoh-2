const express = require('express');
const router  = express.Router();
const db      = require('../database');

/* GET all active wanted posts (not expired) */
router.get('/', (req, res) => {
  const { city = '' } = req.query;
  let sql = `SELECT * FROM wanted_posts WHERE expires_at > datetime('now')`;
  const params = [];
  if (city) { sql += ' AND city = ?'; params.push(city); }
  sql += ' ORDER BY created_at DESC LIMIT 100';
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* POST a new wanted request */
router.post('/', (req, res) => {
  const { buyer_name, description, quantity, city, whatsapp } = req.body;
  if (!buyer_name || !description || !city || !whatsapp) {
    return res.status(400).json({ error: 'buyer_name, description, city and whatsapp are required.' });
  }
  if (!/^\+?[0-9\s]{6,20}$/.test(whatsapp.replace(/\s/g, ''))) {
    return res.status(400).json({ error: 'Invalid WhatsApp number.' });
  }
  db.run(
    `INSERT INTO wanted_posts (buyer_name, description, quantity, city, whatsapp) VALUES (?,?,?,?,?)`,
    [buyer_name.trim(), description.trim(), quantity?.trim() || null, city.trim(), whatsapp.trim()],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, buyer_name, description, city });
    }
  );
});

/* DELETE — poster can remove their own post by id + whatsapp proof */
router.delete('/:id', (req, res) => {
  const { whatsapp } = req.body;
  if (!whatsapp) return res.status(400).json({ error: 'whatsapp required.' });
  db.run(
    `DELETE FROM wanted_posts WHERE id = ? AND whatsapp = ?`,
    [req.params.id, whatsapp],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(403).json({ error: 'Not found or wrong number.' });
      res.json({ message: 'Post removed.' });
    }
  );
});

module.exports = router;
