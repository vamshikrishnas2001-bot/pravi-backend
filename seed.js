// ============================================================
//  Run once to create the admin account in MongoDB:
//    node seed.js
// ============================================================
require('dotenv').config();
const mongoose = require('mongoose');
const Admin    = require('./models/Admin');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  Connected to MongoDB');

    const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (exists) {
      console.log('ℹ️   Admin already exists:', exists.email);
      process.exit(0);
    }

    await Admin.create({
      name:     process.env.ADMIN_NAME,
      email:    process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    console.log('🎉  Admin created!');
    console.log('    Email:   ', process.env.ADMIN_EMAIL);
    console.log('    Password:', process.env.ADMIN_PASSWORD);
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  }
})();
