const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const Admin  = require('../models/Admin');
const requireAuth = require("../middleware/requireAuth");

// ============================================================
// 🔐 LOGIN
// POST /api/auth/login
// ============================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 🔐 Create JWT Token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ SEND TOKEN (NO COOKIE)
    res.json({
      token,
      name: admin.name,
      email: admin.email
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// ============================================================
// 🔐 VERIFY ADMIN (USED BY FRONTEND)
// GET /api/auth/me
// ============================================================
router.get('/me', requireAuth, (req, res) => {
  res.json({
    name: req.admin.email
  });
});


module.exports = router;
