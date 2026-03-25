const router      = require('express').Router();
const Lead        = require('../models/Lead');
const requireAuth = require('../middleware/requireAuth');

// ── POST /api/leads  (PUBLIC — from contact form on website) ──
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, project, message } = req.body;
    if (!name || !phone || !email)
      return res.status(400).json({ error: 'Name, phone and email are required' });
    if (!email.includes('@'))
      return res.status(400).json({ error: 'Invalid email address' });

    const lead = await Lead.create({ name, phone, email, project, message });
    res.status(201).json({ message: 'Thank you! We will contact you soon.', id: lead._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── All routes below require admin JWT ───────────────────────

// GET /api/leads  — list all with search & status filter
router.get('/', requireAuth, async (req, res) => {
  try {
    const { search = '', status = '', page = 1, limit = 100 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [{ name: re }, { email: re }, { phone: re }];
    }
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Lead.countDocuments(query);
    const newCount = await Lead.countDocuments({ status: 'New' });
    res.json({ leads, total, newCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/leads/export  — download CSV
router.get('/export', requireAuth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    const header = '#,Date,Name,Phone,Email,Project,Message,Status\n';
    const rows = leads.map((l, i) => [
      i + 1,
      `"${new Date(l.createdAt).toLocaleString('en-IN')}"`,
      `"${(l.name  || '').replace(/"/g,'""')}"`,
      `"${(l.phone || '').replace(/"/g,'""')}"`,
      `"${(l.email || '').replace(/"/g,'""')}"`,
      `"${(l.project || '').replace(/"/g,'""')}"`,
      `"${(l.message || '').replace(/"/g,'""')}"`,
      `"${l.status}"`
    ].join(','));
    const csv = header + rows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=pravi_leads.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/leads/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/leads/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { name, phone, email, project, message, status } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, project, message, status },
      { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/leads/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/leads  — clear ALL
router.delete('/', requireAuth, async (req, res) => {
  try {
    await Lead.deleteMany({});
    res.json({ message: 'All leads cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
