// ============================================================
//  Pravi Admin Login — connects to real backend
//  Replace API_BASE with your Render URL after deploying
// ============================================================
const API_BASE = 'https://pravi-backend.onrender.com'; // ← UPDATE THIS after deploy

function togglePw() {
  const inp = document.getElementById('loginPass');
  const ico = document.getElementById('eyeIcon');
  if (inp.type === 'password') { inp.type = 'text';     ico.className = 'fa-solid fa-eye-slash'; }
  else                         { inp.type = 'password'; ico.className = 'fa-solid fa-eye';       }
}

function showToast(msg, isErr = false) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.querySelector('i').style.color = isErr ? '#ff6b6b' : '#00c9a7';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

async function doLogin() {
  const email    = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value.trim();
  const btn      = document.querySelector('.btn-login');

  if (!email || !password) { showToast('Please enter email and password.', true); return; }

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in…';

  try {
    const res  = await fetch(`${API_BASE}/api/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || 'Invalid credentials', true);
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> LOGIN TO ADMIN';
      return;
    }

    // Store JWT token
    const storage = document.getElementById('rememberMe').checked ? localStorage : sessionStorage;
    storage.setItem('pravi_token', data.token);
    storage.setItem('pravi_admin_name', data.name);

    showToast('Welcome back, ' + data.name + '! Redirecting…');
    setTimeout(() => window.location.href = 'admin-panel.html', 1400);

  } catch (err) {
    showToast('Cannot reach server. Check connection.', true);
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> LOGIN TO ADMIN';
  }
}

document.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
