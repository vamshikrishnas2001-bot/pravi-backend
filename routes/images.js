const router = require('express').Router();
const Site = require('../models/SiteContent');
const auth = require('../middleware/requireAuth');

// POST /api/images/upload  — admin only
// Body: { section, key, image: 'data:image/...;base64,...' }
router.post('/upload', auth, async (req, res) => {
  try {
    const { section, key, image } = req.body;
    if (!section || !key || !image)
      return res.status(400).json({ message: 'section, key, and image required' });

    // Find existing section doc
    let doc = await Site.findOne({ section });
    if (!doc) doc = new Site({ section, data: {} });

    // Store image as base64 string inside the section data
    if (!doc.data) doc.data = {};
    doc.data[key] = image;
    doc.markModified('data');
    await doc.save();

    res.json({ url: image, section, key });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

module.exports = router;
