const router    = require('express').Router();
const jwt       = require('jsonwebtoken');
const Admin     = require('../models/Admin');
const requireAuth = require('../middleware/requireAuth');

// ─── POST /api/auth/login ───────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await admin.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, name: admin.name });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/auth/verify ───────────────────────────────────────────────────
router.get('/verify', requireAuth, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

module.exports = router;
