const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ✅ CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// ✅ HEALTH CHECK (for UptimeRobot)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ✅ ROOT
app.get('/', (req, res) => {
  res.json({ status: 'Pravi Backend OK' });
});

// ✅ ROUTES
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/leads',  require('./routes/leads'));
app.use('/api/site',   require('./routes/site'));
app.use('/api/images', require('./routes/images'));

// ✅ MONGODB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ START SERVER — 0.0.0.0 is critical for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ PREVENT CRASH
process.on('uncaughtException', err => console.error('❌ Uncaught:', err));
process.on('unhandledRejection', err => console.error('❌ Rejection:', err));
