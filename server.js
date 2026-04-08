const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


// ✅ HEALTH ROUTE (VERY IMPORTANT)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// ✅ MIDDLEWARE
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));


// ✅ ROOT ROUTE
app.get('/', (req, res) => {
  res.json({ status: 'Pravi Backend OK' });
});


// ✅ START SERVER FIRST (CRITICAL)
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// ✅ LOAD ROUTES SAFELY (wrap in try)
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/leads', require('./routes/leads'));
  app.use('/api/site', require('./routes/site'));
  app.use('/api/images', require('./routes/images'));
} catch (err) {
  console.error('❌ Route load error:', err);
}


// ✅ CONNECT MONGO IN BACKGROUND
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));


// ✅ PREVENT CRASH
process.on('uncaughtException', err => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', err => {
  console.error('❌ Unhandled Rejection:', err);
});
