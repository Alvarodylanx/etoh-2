const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const db = require('../database');
const { requireAuth } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'etoh_dev_secret';
const TOKEN_TTL = '7d';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required.' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  const hash = await bcrypt.hash(password, 10);
  db.run(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name.trim(), email.trim().toLowerCase(), hash],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'An account with this email already exists.' });
        return res.status(500).json({ error: err.message });
      }
      const user = { id: this.lastID, email: email.trim().toLowerCase(), name: name.trim() };
      res.status(201).json({ token: makeToken(user), user });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  db.get('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'No account found with this email.' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Incorrect password.' });

    const safe = { id: user.id, email: user.email, name: user.name };
    res.json({ token: makeToken(safe), user: safe });
  });
});

router.get('/me', requireAuth, (req, res) => {
  db.get('SELECT id, name, email, whatsapp, profile_picture, bio, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  });
});

router.put('/profile', requireAuth, (req, res) => {
  upload.single('profile_picture')(req, res, (uploadErr) => {
    if (uploadErr) return res.status(400).json({ error: uploadErr.message });

    const { name, bio, whatsapp } = req.body;
    const profile_picture = req.file ? '/uploads/' + req.file.filename : undefined;

    const updates = [];
    const vals = [];
    if (name)            { updates.push('name = ?');            vals.push(name.trim()); }
    if (bio !== undefined) { updates.push('bio = ?');           vals.push(bio); }
    if (whatsapp !== undefined) { updates.push('whatsapp = ?'); vals.push(whatsapp); }
    if (profile_picture) { updates.push('profile_picture = ?'); vals.push(profile_picture); }

    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update.' });

    vals.push(req.user.id);
    db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, vals, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT id, name, email, whatsapp, profile_picture, bio FROM users WHERE id = ?', [req.user.id], (err2, user) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json(user);
      });
    });
  });
});

module.exports = router;
