const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


// ✅ 1. FAST HEALTH CHECK (VERY IMPORTANT)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// ✅ 2. MIDDLEWARE
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));


// ✅ 3. ROOT ROUTE
app.get('/', (req, res) => {
  res.json({ status: 'Pravi Backend OK' });
});


// ✅ 4. API ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/site', require('./routes/site'));
app.use('/api/images', require('./routes/images'));


// ✅ 5. START SERVER IMMEDIATELY (CRITICAL FIX)
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// ✅ 6. CONNECT MONGODB IN BACKGROUND (NON-BLOCKING)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err);
  });
