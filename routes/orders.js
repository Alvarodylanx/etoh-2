const express = require('express');
const router = express.Router();
const db = require('../database');

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
});

module.exports = router;
