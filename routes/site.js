const router = require('express').Router();
const Site   = require('../models/SiteContent');
const auth   = require('../middleware/requireAuth'); // make sure filename matches

// GET all sections → returns { branding: {}, hero: {}, ... }
router.get('/', async (req, res) => {
  try {
    const sections = await Site.find();

    const result = {};
    sections.forEach(s => {
      result[s.section] = s.data || {};
    });

    const defaults = {
      branding: {},
      hero: {},
      about: {},
      stats: {},
      contact: {},
      map: {},
      whatsapp: {},
      clients: {},
      testimonials: {},
      products: {},
      facility: {},
      gallery: {},
      beforeafter: {}
    };

    res.json({ ...defaults, ...result });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /publish — MUST be before /:section to avoid conflict
router.post('/publish', auth, async (req, res) => {
  res.json({ message: 'Published', timestamp: new Date().toISOString() });
});

// GET one section
router.get('/:section', async (req, res) => {
  try {
    const doc = await Site.findOne({ section: req.params.section });
    if (!doc) return res.status(404).json({ message: 'Section not found' });
    res.json(doc.data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT (save/update) one section — used by admin panel
router.put('/:section', auth, async (req, res) => {
  try {
    const doc = await Site.findOneAndUpdate(
      { section: req.params.section },
      { section: req.params.section, data: req.body },
      { upsert: true, new: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
