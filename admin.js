// ============================================================
//  Pravi Admin Panel — API-connected version
//  Replace API_BASE with your Render URL after deploying
// ============================================================
const API_BASE = 'https://pravi-backend.onrender.com'; // ← UPDATE THIS after deploy

// ── Auth helper ───────────────────────────────────────────────
function getToken() {
  return localStorage.getItem('pravi_token') || sessionStorage.getItem('pravi_token');
}
function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() };
}
// Redirect to login if no token
(async function checkAuth() {
  const token = getToken();
  if (!token) { window.location.href = 'admin-login.html'; return; }
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, { headers: authHeaders() });
    if (!res.ok) { localStorage.clear(); sessionStorage.clear(); window.location.href = 'admin-login.html'; }
    const data = await res.json();
    document.querySelectorAll('.admin-name').forEach(el => el.textContent = data.name);
  } catch { /* server might be waking up on Render free tier */ }
})();

// ── Panel navigation ──────────────────────────────────────────
function showPanel(id, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  if (el) el.classList.add('active');
  const titles = {
    dashboard:'DASHBOARD', leads:'LEADS & QUOTE REQUESTS', branding:'BRANDING & SEO',
    hero:'HERO SECTION', about:'ABOUT SECTION', products:'PRODUCTS', facility:'FACILITY IMAGES',
    gallery:'PROJECT GALLERY', 'before-after':'BEFORE & AFTER', clients:'CLIENTS',
    testimonials:'TESTIMONIALS', stats:'STATS NUMBERS', map:'MAP & LOCATION',
    contact:'CONTACT INFO', whatsapp:'WHATSAPP WIDGET'
  };
  document.getElementById('topbarTitle').textContent = titles[id] || id.toUpperCase();
  if (window.innerWidth <= 800) document.getElementById('sidebar').classList.remove('open');
  if (id === 'leads') renderLeads();
}
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

function save() { showToast('Changes saved successfully!'); }
function publishAll() {
  showToast('Site published! Live changes applied.');
  document.querySelector('.topbar-badge').style.borderColor = 'var(--teal)';
}
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
function openModal(name)  { document.getElementById('modal-' + name).classList.add('open'); }
function closeModal(name) { document.getElementById('modal-' + name).classList.remove('open'); }
function removeItem(el) {
  const item = el.closest('.list-item') || el;
  item.style.opacity = '0'; item.style.transform = 'scale(0.95)'; item.style.transition = 'all 0.2s';
  setTimeout(() => item.remove(), 200);
}
function switchTab(el)    { document.querySelectorAll('.tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); }
function editFeature(el)  { openModal('feature'); }

function addBAPair() {
  const list = document.getElementById('baPairList');
  const n = document.createElement('div'); n.className = 'ba-pair';
  n.innerHTML = `<div><div class="card-title" style="font-size:12px;margin-bottom:8px"><i class="fa-solid fa-circle" style="color:var(--muted)"></i> BEFORE Image</div><div class="upload-zone"><input type="file" accept="image/*"/><i class="fa-solid fa-cloud-arrow-up"></i><strong>Upload Before</strong><p>Current state</p></div></div><div class="arr"><i class="fa-solid fa-arrow-right"></i></div><div><div class="card-title" style="font-size:12px;margin-bottom:8px"><i class="fa-solid fa-circle" style="color:var(--teal)"></i> AFTER Image</div><div class="upload-zone"><input type="file" accept="image/*"/><i class="fa-solid fa-cloud-arrow-up"></i><strong>Upload After</strong><p>Transformed result</p></div></div>`;
  list.appendChild(n); showToast('New pair added!');
}
function handleFacilityUpload(input) {
  const grid = document.getElementById('facilityImgGrid');
  Array.from(input.files).forEach(file => {
    const r = new FileReader();
    r.onload = e => {
      const div = document.createElement('div'); div.className = 'img-thumb';
      div.innerHTML = `<img src="${e.target.result}" alt=""/><button class="img-remove" onclick="removeItem(this.parentNode)"><i class="fa-solid fa-xmark"></i></button>`;
      grid.appendChild(div);
    }; r.readAsDataURL(file);
  });
  showToast(`${input.files.length} image(s) added`);
}
function handleGalleryUpload(input) {
  const grid = document.getElementById('galleryImgGrid');
  Array.from(input.files).forEach(file => {
    const r = new FileReader();
    r.onload = e => {
      const div = document.createElement('div'); div.className = 'img-thumb';
      div.innerHTML = `<img src="${e.target.result}" alt=""/><button class="img-remove" onclick="removeItem(this.parentNode)"><i class="fa-solid fa-xmark"></i></button>`;
      grid.appendChild(div);
    }; r.readAsDataURL(file);
  });
  showToast(`${input.files.length} image(s) added`);
}
function previewUpload(input, zoneId) {
  const r = new FileReader();
  r.onload = e => {
    const zone = document.getElementById(zoneId);
    zone.style.backgroundImage = `url(${e.target.result})`;
    zone.style.backgroundSize = 'cover'; zone.style.backgroundPosition = 'center';
    zone.querySelector('i').style.display = 'none';
    zone.querySelector('strong').textContent = 'Image selected ✓';
    zone.querySelector('p').textContent = input.files[0].name;
  };
  if (input.files[0]) r.readAsDataURL(input.files[0]);
}
function saveWhatsApp() {
  const phone   = document.getElementById('waPhone').value;
  const tooltip = document.getElementById('waTooltip').value;
  document.getElementById('waPhonePreview').textContent   = phone;
  document.getElementById('waTooltipPreview').textContent = tooltip;
  showToast('WhatsApp settings saved!');
}
document.querySelectorAll('.modal-bg').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});
document.getElementById('waPhone').addEventListener('input',   function() { document.getElementById('waPhonePreview').textContent   = this.value; });
document.getElementById('waTooltip').addEventListener('input', function() { document.getElementById('waTooltipPreview').textContent = this.value; });

// ── Logout ────────────────────────────────────────────────────
function adminLogout() {
  localStorage.removeItem('pravi_token');
  sessionStorage.removeItem('pravi_token');
  window.location.href = 'admin-login.html';
}

// ============================================================
//  LEADS MANAGEMENT — now uses real API
// ============================================================
let leadsCache = [];

async function fetchLeads() {
  try {
    const search = (document.getElementById('leadsSearch') || {}).value || '';
    const status = (document.getElementById('leadsStatusFilter') || {}).value || '';
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);

    const res  = await fetch(`${API_BASE}/api/leads?${params}`, { headers: authHeaders() });
    const data = await res.json();
    leadsCache = data.leads || [];
    return data;
  } catch (err) {
    showToast('Error loading leads');
    return { leads: [], total: 0, newCount: 0 };
  }
}

async function updateLeadsBadge() {
  try {
    const res  = await fetch(`${API_BASE}/api/leads`, { headers: authHeaders() });
    const data = await res.json();
    const badge    = document.getElementById('leadsNavBadge');
    const dashCount = document.getElementById('dashLeadCount');
    const countEl  = document.getElementById('leadsCount');
    if (badge) { badge.textContent = data.total || 0; badge.style.display = data.total ? 'inline' : 'none'; }
    if (dashCount) dashCount.textContent = data.total || 0;
    if (countEl) countEl.textContent = `(${data.total} total, ${data.newCount} new)`;
  } catch {}
}

async function renderLeads() {
  const tbody = document.getElementById('leadsTableBody');
  const empty = document.getElementById('leadsEmpty');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:2rem">Loading…</td></tr>';

  const data = await fetchLeads();
  updateLeadsBadge();
  const leads = data.leads || [];

  if (leads.length === 0) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  const statusClass = { New: 'new', Contacted: 'contacted', Closed: 'closed' };
  tbody.innerHTML = leads.map((l, i) => `
    <tr>
      <td style="color:var(--muted)">${i + 1}</td>
      <td style="font-size:11px;color:var(--muted);white-space:nowrap">${new Date(l.createdAt).toLocaleString('en-IN')}</td>
      <td style="font-weight:500">${esc(l.name)}</td>
      <td>${esc(l.phone)}</td>
      <td style="color:var(--teal)">${esc(l.email)}</td>
      <td style="color:var(--muted)">${esc(l.project || '—')}</td>
      <td title="${esc(l.message || '')}" style="color:var(--muted);font-size:12px">${esc((l.message || '').substring(0, 40))}${(l.message || '').length > 40 ? '…' : ''}</td>
      <td><span class="lead-status ${statusClass[l.status] || 'new'}">${l.status || 'New'}</span></td>
      <td>
        <div style="display:flex;gap:5px">
          <button class="icon-btn" title="Edit"   onclick="editLead('${l._id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="icon-btn del" title="Delete" onclick="deleteLead('${l._id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function filterLeads() { renderLeads(); }

async function editLead(id) {
  const lead = leadsCache.find(x => x._id === id);
  if (!lead) return;
  document.getElementById('editLeadId').value      = id;
  document.getElementById('editLeadName').value    = lead.name    || '';
  document.getElementById('editLeadPhone').value   = lead.phone   || '';
  document.getElementById('editLeadEmail').value   = lead.email   || '';
  document.getElementById('editLeadProject').value = lead.project || '';
  document.getElementById('editLeadMessage').value = lead.message || '';
  document.getElementById('editLeadStatus').value  = lead.status  || 'New';
  openModal('lead');
}

async function saveLeadEdit() {
  const id = document.getElementById('editLeadId').value;
  const body = {
    name:    document.getElementById('editLeadName').value,
    phone:   document.getElementById('editLeadPhone').value,
    email:   document.getElementById('editLeadEmail').value,
    project: document.getElementById('editLeadProject').value,
    message: document.getElementById('editLeadMessage').value,
    status:  document.getElementById('editLeadStatus').value,
  };
  try {
    const res = await fetch(`${API_BASE}/api/leads/${id}`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error();
    closeModal('lead');
    renderLeads();
    showToast('Lead updated!');
  } catch { showToast('Error saving lead'); }
}

async function deleteLead(id) {
  if (!confirm('Delete this lead? This cannot be undone.')) return;
  try {
    await fetch(`${API_BASE}/api/leads/${id}`, { method: 'DELETE', headers: authHeaders() });
    renderLeads();
    showToast('Lead deleted.');
  } catch { showToast('Error deleting lead'); }
}

async function clearAllLeads() {
  if (!confirm('Delete ALL leads? This cannot be undone.')) return;
  try {
    await fetch(`${API_BASE}/api/leads`, { method: 'DELETE', headers: authHeaders() });
    renderLeads();
    showToast('All leads cleared.');
  } catch { showToast('Error clearing leads'); }
}

function downloadLeadsCSV() {
  window.location.href = `${API_BASE}/api/leads/export?token=${getToken()}`;
  // Fallback if above doesn't work due to auth header:
  fetch(`${API_BASE}/api/leads/export`, { headers: authHeaders() })
    .then(r => r.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'pravi_leads.csv'; a.click();
      URL.revokeObjectURL(url);
      showToast('CSV downloaded!');
    })
    .catch(() => showToast('Export failed'));
}

// Init on load
updateLeadsBadge();
