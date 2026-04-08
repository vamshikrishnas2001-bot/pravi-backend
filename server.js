const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/site', require('./routes/site'));
app.use('/api/images', require('./routes/images'));

// Test routes
app.get('/', (req, res) => {
  res.json({ status: 'Pravi Backend OK' });
});

app.get('/health', (req, res) => {
  res.send('OK');
});

// PORT
const PORT = process.env.PORT || 5000;

// ✅ Connect DB FIRST, then start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err);
  });
