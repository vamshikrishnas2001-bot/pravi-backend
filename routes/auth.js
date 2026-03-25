const router      = require('express').Router();
const jwt         = require('jsonwebtoken');
const Admin       = require('../models/Admin');
const requireAuth = require('../middleware/requireAuth');

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin)
      return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await admin.comparePassword(password);
    if (!ok)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, name: admin.name, email: admin.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/auth/me  (verify token) ─────────────────────────
router.get('/me', requireAuth, (req, res) => {
  res.json({ id: req.admin.id, email: req.admin.email, name: req.admin.name });
});

// ── POST /api/auth/change-password ───────────────────────────
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: 'Both passwords required' });
    if (newPassword.length < 8)
      return res.status(400).json({ error: 'New password must be 8+ characters' });

    const admin = await Admin.findById(req.admin.id);
    const ok = await admin.comparePassword(currentPassword);
    if (!ok)
      return res.status(401).json({ error: 'Current password incorrect' });

    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// TEMP: create admin (remove later)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ name, email, password });

    res.json({ message: "Admin created successfully", admin });
  } catch (err) {
    res.status(500).json({ error: "Error creating admin" });
  }
});

module.exports = router;
