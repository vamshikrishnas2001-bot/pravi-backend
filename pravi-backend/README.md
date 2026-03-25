# Pravi Technologies — Backend Deployment Guide
### Deploy in ~15 minutes. Zero cost. No credit card.

---

## What you're deploying
- **Express API** on Render (free tier)
- **MongoDB Atlas** database (free tier)
- Auth with JWT (secure login)
- Leads stored in MongoDB (no more localStorage)
- Admin CRUD + CSV export via real API

---

## STEP 1 — Upload backend to GitHub

1. Go to **github.com** → New repository
2. Name it `pravi-backend` → Create repository
3. On your computer, open a terminal in the `pravi-backend` folder and run:

```bash
git init
git add .
git commit -m "Initial backend"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/pravi-backend.git
git push -u origin main
```

> ⚠️  Make sure `.env` is NOT pushed. The `.gitignore` already excludes it.

---

## STEP 2 — Deploy to Render

1. Go to **render.com** → Sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your `pravi-backend` repository
4. Fill in these settings:

| Field | Value |
|-------|-------|
| Name | `pravi-backend` |
| Environment | `Node` |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Plan | **Free** |

5. Click **"Advanced"** → **"Add Environment Variable"** and add ALL of these:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://vamshikrishnas2001_db_user:Pravi@7122@pravi-db.bnnqsfp.mongodb.net/pravi?appName=pravi-db` |
| `JWT_SECRET` | `PraviTech_SuperSecret_2024_xK9mP2qR` |
| `ADMIN_NAME` | `Vamshi Krishna` |
| `ADMIN_EMAIL` | `vamshikrishnas2001@gmail.com` |
| `ADMIN_PASSWORD` | `Pravi@7122` |
| `CLIENT_URL` | `*` |

6. Click **"Create Web Service"**
7. Wait ~3 minutes for the first deploy
8. Copy your URL — it will look like: `https://pravi-backend.onrender.com`

---

## STEP 3 — Create your admin account (run once)

After Render deploys, open a terminal and run:

```bash
cd pravi-backend
cp .env.example .env        # create your local .env file
npm install
node seed.js                # creates admin in MongoDB
```

You should see:
```
✅  Connected to MongoDB
🎉  Admin created!
    Email:    vamshikrishnas2001@gmail.com
    Password: Pravi@7122
```

---

## STEP 4 — Update your frontend files

### In `js/login.js` — change line 4:
```javascript
const API_BASE = 'https://pravi-backend.onrender.com'; // ← your Render URL
```

### In `js/admin.js` — change line 4:
```javascript
const API_BASE = 'https://pravi-backend.onrender.com'; // ← your Render URL
```

Replace `pravi-backend.onrender.com` with whatever URL Render gave you.

---

## STEP 5 — Replace your frontend JS files

In your website folder (`pravi-technologies-website/js/`):
- Replace `login.js` with the new `login.js` from this folder
- Replace `admin.js` with the new `admin.js` from this folder

---

## STEP 6 — Test it

1. Open `admin-login.html` in a browser
2. Login with: `vamshikrishnas2001@gmail.com` / `Pravi@7122`
3. You should land on the admin panel ✅
4. Try the contact form on `index.html` — lead should appear in admin panel ✅

---

## STEP 7 — Update contact form in index.html

The contact form currently saves leads to `localStorage`. Add this to `submitForm()` in `main.js`:

```javascript
async function submitForm() {
  const name    = document.getElementById('fName').value.trim();
  const phone   = document.getElementById('fPhone').value.trim();
  const email   = document.getElementById('fEmail').value.trim();
  const project = document.getElementById('fProject').value;
  const message = document.getElementById('fMessage').value.trim();

  if (!name || !phone || !email) { alert('Please fill in all required fields.'); return; }
  if (!email.includes('@')) { alert('Please enter a valid email address.'); return; }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  try {
    const res = await fetch('https://pravi-backend.onrender.com/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, project, message })
    });
    const data = await res.json();
    if (res.ok) {
      btn.style.display = 'none';
      document.getElementById('formSuccess').classList.add('visible');
    } else {
      alert(data.error || 'Submission failed');
      btn.disabled = false;
      btn.innerHTML = 'Send Message';
    }
  } catch {
    alert('Network error. Please try again.');
    btn.disabled = false;
    btn.innerHTML = 'Send Message';
  }
}
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | None | Server health check |
| POST | `/api/auth/login` | None | Login, returns JWT token |
| GET | `/api/auth/me` | JWT | Verify token, get admin info |
| POST | `/api/auth/change-password` | JWT | Change admin password |
| POST | `/api/leads` | None | Submit contact form (public) |
| GET | `/api/leads` | JWT | List all leads (with search/filter) |
| GET | `/api/leads/export` | JWT | Download CSV |
| PUT | `/api/leads/:id` | JWT | Update a lead |
| DELETE | `/api/leads/:id` | JWT | Delete a lead |
| DELETE | `/api/leads` | JWT | Clear all leads |
| GET | `/api/content` | None | Get site CMS data (public) |
| PUT | `/api/content` | JWT | Save site CMS data |

---

## ⚠️  Important Notes

- **Render free tier sleeps after 15 min inactivity.** First request after sleep takes ~30 seconds to wake up. This is normal on free tier.
- **Change your password** after first login from the admin panel.
- Never share your `.env` file or commit it to GitHub.

---

## Files in this folder

```
pravi-backend/
├── server.js          ← main Express server
├── seed.js            ← run once to create admin
├── package.json
├── .env.example       ← copy to .env and fill in values
├── .gitignore
├── models/
│   ├── Admin.js
│   ├── Lead.js
│   └── SiteContent.js
├── routes/
│   ├── auth.js
│   ├── leads.js
│   └── content.js
├── middleware/
│   └── requireAuth.js
├── login.js           ← REPLACE your frontend js/login.js with this
└── admin.js           ← REPLACE your frontend js/admin.js with this
```
