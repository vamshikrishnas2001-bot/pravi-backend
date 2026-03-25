const mongoose = require('mongoose');

// Flexible schema — stores entire site config as a single document
const contentSchema = new mongoose.Schema({
  key:   { type: String, default: 'site', unique: true },
  data:  { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', contentSchema);
