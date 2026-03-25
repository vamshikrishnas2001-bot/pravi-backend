// ============================================================
//  Pravi Technologies — Express Server
//  Routes: /api/auth  /api/leads  /api/content  /api/health
// ============================================================
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const mongoose = require('mongoose');

const authRoutes    = require('./routes/auth');
const leadsRoutes   = require('./routes/leads');
const contentRoutes = require('./routes/content');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ── DB Connection ────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => { console.error('❌  MongoDB error:', err.message); process.exit(1); });

// ── Routes ───────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: new Date() }));
app.use('/api/auth',    authRoutes);
app.use('/api/leads',   leadsRoutes);
app.use('/api/content', contentRoutes);

// ── 404 fallback ─────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ─────────────────────────────────────
app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));
