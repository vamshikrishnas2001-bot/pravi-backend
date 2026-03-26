const mongoose = require('mongoose');

// One document per section, keyed by 'section' field
const SiteSchema = new mongoose.Schema({
  section: { type: String, unique: true, required: true },
  data:    { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Site', SiteSchema);
