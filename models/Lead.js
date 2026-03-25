const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  phone:   { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true, lowercase: true },
  project: { type: String, default: '' },
  message: { type: String, default: '' },
  status:  { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
