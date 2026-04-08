const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


// ✅ 1. FAST HEALTH CHECK (never fails)
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


// ✅ 4. ROUTES (keep as is)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/site', require('./routes/site'));
app.use('/api/images', require('./routes/images'));


// ✅ 5. EXPRESS ERROR HANDLER (prevents crash)
app.use((err, req, res, next) => {
  console.error('❌ Express Error:', err);
  res.status(500).send('Server Error');
});


// ✅ 6. START SERVER IMMEDIATELY
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// ✅ 7. CONNECT MONGODB SAFELY (non-blocking)
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('✅ MongoDB connected');
})
.catch(err => {
  console.error('❌ MongoDB error:', err);
});


// ✅ 8. GLOBAL ERROR HANDLERS (VERY IMPORTANT)
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});
