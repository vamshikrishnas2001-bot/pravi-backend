const router      = require('express').Router();
const SiteContent = require('../models/SiteContent');
const requireAuth = require('../middleware/requireAuth');

// GET /api/content  (PUBLIC — website reads this)
router.get('/', async (req, res) => {
  try {
    let doc = await SiteContent.findOne({ key: 'site' });
    if (!doc) {
      // Return sensible defaults if never saved yet
      return res.json(getDefaults());
    }
    res.json(doc.data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/content  (ADMIN ONLY — admin panel saves here)
router.put('/', requireAuth, async (req, res) => {
  try {
    const data = req.body;
    await SiteContent.findOneAndUpdate(
      { key: 'site' },
      { key: 'site', data },
      { upsert: true, new: true }
    );
    res.json({ message: 'Site content saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

function getDefaults() {
  return {
    branding: {
      companyName: 'PRAVI',
      tagline: 'Technologies',
      footerTagline: 'Innovative lighting solutions trusted across India since 2012. Your space, brilliantly lit.'
    },
    hero: {
      eyebrow: 'Premium Lighting',
      titleLine1: 'INNOVATIVE',
      titleLine2: 'LIGHTING',
      titleLine3Accent: 'SOLUTIONS',
      description: 'Transforming spaces with cutting-edge lighting design. From architectural to decorative — we illuminate your world.',
      btnPrimary: 'Explore Products',
      btnSecondary: 'Get a Quote',
    },
    stats: {
      s1: { num: 500, suffix: '+', label: 'Projects Done' },
      s2: { num: 50,  suffix: '+', label: 'Industry Partners' },
      s3: { num: 12,  suffix: 'yrs', label: 'In Business' },
      s4: { num: 80,  suffix: '%', label: 'Client Retention' },
    },
    contact: {
      phone: '+91 98765 43210',
      email: 'info@pravitechnologies.com',
      address: 'No. 45, 2nd Floor, Hosur Road, Electronic City, Bengaluru – 560100',
      hours: 'Mon – Sat: 9:00 AM – 6:00 PM',
      facebook: '#', instagram: '#', linkedin: '#', youtube: '#'
    },
    whatsapp: {
      enabled: true,
      phone: '+919876543210',
      message: "Hello Pravi Technologies! I'm interested in your lighting solutions.",
      tooltip: 'Chat with us on WhatsApp!',
      position: 'bottom-right'
    }
  };
}

module.exports = router;
