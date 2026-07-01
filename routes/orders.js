const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireAuth } = require('../middleware/auth');

router.get('/', (req, res) => {
  const sql = `
    SELECT o.*, p.product_name, p.price_cfa, s.vendor_name
    FROM orders o
    JOIN products p ON o.product_id = p.id
    JOIN stands s ON p.stand_id = s.id
    ORDER BY o.order_date DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { product_id, buyer_name, target_city, target_quarter, near_landmark } = req.body;
  if (!product_id || !buyer_name || !target_city || !target_quarter || !near_landmark) {
    return res.status(400).json({ error: 'All delivery fields are required' });
  }
  db.run(
    'INSERT INTO orders (product_id, buyer_name, target_city, target_quarter, near_landmark) VALUES (?, ?, ?, ?, ?)',
    [product_id, buyer_name, target_city, target_quarter, near_landmark],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        product_id,
        buyer_name,
        target_city,
        target_quarter,
        near_landmark,
        message: 'Order placed successfully! The seller will contact you soon.'
      });
    }
  );

router.get('/mine', requireAuth, (req, res) => {
  const sql = `
    SELECT o.*, p.product_name, p.price_cfa, s.vendor_name
    FROM orders o
    JOIN products p ON o.product_id = p.id
    JOIN stands s ON p.stand_id = s.id
    WHERE s.user_id = ?
    ORDER BY o.order_date DESC
  `;
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.put('/:id/status', requireAuth, (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'delivered', 'cancelled'];
  
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  
  // Verify ownership before updating
  const checkSql = `
    SELECT s.user_id 
    FROM orders o
    JOIN products p ON o.product_id = p.id
    JOIN stands s ON p.stand_id = s.id
    WHERE o.id = ?
  `;
  
  db.get(checkSql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Order not found' });
    if (row.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized to update this order' });
    
    db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(updateErr) {
      if (updateErr) return res.status(500).json({ error: updateErr.message });
      res.json({ message: 'Order status updated', status });
    });
  });
});

module.exports = router;
