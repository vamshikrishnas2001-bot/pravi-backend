const mongoose = require('mongoose');
const contentSchema = new mongoose.Schema({
  section: { type: String, unique: true },  // ← CHANGED from 'key'
  data:    { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });
module.exports = mongoose.model('SiteContent', contentSchema);
