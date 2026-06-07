const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.get('/', (req, res) => {
  db.all('SELECT * FROM stands ORDER BY creation_date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/mine', requireAuth, (req, res) => {
  const sql = `
    SELECT s.*, COUNT(p.id) as product_count
    FROM stands s
    LEFT JOIN products p ON p.stand_id = s.id
    WHERE s.user_id = ?
    GROUP BY s.id
    ORDER BY s.creation_date DESC
  `;
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM stands WHERE id = ?', [req.params.id], (err, stand) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!stand) return res.status(404).json({ error: 'Stand not found' });
    db.all('SELECT * FROM products WHERE stand_id = ? ORDER BY id DESC', [req.params.id], (err2, products) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ stand, products });
    });
  });
});

router.post('/', requireAuth, (req, res) => {
  const { vendor_name, phone_number, stand_description, city } = req.body;
  if (!vendor_name || !phone_number) {
    return res.status(400).json({ error: 'Stand name and phone number are required.' });
  }
  db.run(
    'INSERT INTO stands (user_id, vendor_name, phone_number, stand_description, city) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, vendor_name.trim(), phone_number.trim(), stand_description || '', city || 'Douala'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, vendor_name, phone_number, stand_description });
    }
  );
});

router.put('/:id', requireAuth, (req, res) => {
  db.get('SELECT * FROM stands WHERE id = ?', [req.params.id], (err, stand) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!stand) return res.status(404).json({ error: 'Stand not found.' });
    if (stand.user_id !== req.user.id) return res.status(403).json({ error: 'You do not own this stand.' });

    const { vendor_name, phone_number, stand_description } = req.body;
    db.run(
      'UPDATE stands SET vendor_name = ?, phone_number = ?, stand_description = ? WHERE id = ?',
      [vendor_name || stand.vendor_name, phone_number || stand.phone_number, stand_description ?? stand.stand_description, req.params.id],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: 'Stand updated.' });
      }
    );
  });
});

router.put('/:id/availability', requireAuth, (req, res) => {
  const { availability } = req.body;
  const allowed = ['open', 'away', 'closed'];
  if (!allowed.includes(availability)) return res.status(400).json({ error: 'Invalid availability value.' });
  db.get('SELECT * FROM stands WHERE id = ?', [req.params.id], (err, stand) => {
    if (err || !stand) return res.status(404).json({ error: 'Stand not found.' });
    if (stand.user_id !== req.user.id) return res.status(403).json({ error: 'You do not own this stand.' });
    db.run('UPDATE stands SET availability = ? WHERE id = ?', [availability, req.params.id], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ availability });
    });
  });
});

router.delete('/:id', requireAuth, (req, res) => {
  db.get('SELECT * FROM stands WHERE id = ?', [req.params.id], (err, stand) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!stand) return res.status(404).json({ error: 'Stand not found.' });
    if (stand.user_id !== req.user.id) return res.status(403).json({ error: 'You do not own this stand.' });

    db.run('DELETE FROM stands WHERE id = ?', [req.params.id], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Stand deleted.' });
    });
  });
});

module.exports = router;
