# 🚀 DEEVYA PORTFOLIO — DEPLOYMENT GUIDE

Your portfolio has a real backend. Follow these steps exactly and it will be live at deevyapatel.com in about 20 minutes.

---

## STEP 1 — Install dependencies

You already have Node.js/npm. Open your terminal inside the project folder and run:

```
npm install
```

That's it for local setup.

---

## STEP 2 — Get your Gmail App Password

This lets your portfolio send emails through deevyapatel2003@gmail.com WITHOUT exposing your real password.

1. Go to → https://myaccount.google.com/security
2. Make sure **2-Step Verification is ON** (required)
3. Search for "App passwords" at the top of that page
4. Click App passwords → Select app: **Mail** → Select device: **Other** → type "Portfolio"
5. Click **Generate** → Google gives you a **16-character password** like: `abcd efgh ijkl mnop`
6. Copy it (you only see it once!)
7. Open your `.env` file and paste it as `GMAIL_APP_PASS` (no spaces)

---

## STEP 3 — Get your Anthropic API Key

1. Go to → https://console.anthropic.com
2. Sign up for a free account
3. Click **API Keys** → **Create Key** → name it "Portfolio"
4. Copy the key (starts with `sk-ant-...`)
5. Paste it in `.env` as `ANTHROPIC_API_KEY`

---

## STEP 4 — Push to GitHub

1. Go to https://github.com/new → create a new repo called `deevya-portfolio` → set it to **Private**
2. In your terminal inside the project folder:

```
git init
git add .
git commit -m "initial portfolio"
git branch -M main
git remote add origin https://github.com/DeevyaPatel/deevya-portfolio.git
git push -u origin main
```

> ✅ The `.env` file is in `.gitignore` so your secrets stay safe and never go to GitHub.

---

## STEP 5 — Deploy on Netlify

1. Go to → https://netlify.com → sign up with your GitHub account
2. Click **Add new site** → **Import an existing project** → **GitHub**
3. Select your `deevya-portfolio` repo
4. Netlify auto-detects the settings from `netlify.toml` — don't change anything
5. Click **Deploy site** → wait ~1 minute → your site is live!

---

## STEP 6 — Add your secret keys to Netlify

This is the most important step — this is where the real `.env` values live in production.

1. In Netlify dashboard → your site → **Site configuration** → **Environment variables**
2. Click **Add a variable** for each of these:

| Key | Value |
|-----|-------|
| `GMAIL_USER` | `deevyapatel2003@gmail.com` |
| `GMAIL_APP_PASS` | your 16-char app password |
| `ANTHROPIC_API_KEY` | your `sk-ant-...` key |

3. After adding all 3 → go to **Deploys** → click **Trigger deploy** → **Deploy site**

---

## STEP 7 — Connect your GoDaddy domain

1. In Netlify → **Domain management** → **Add a domain** → type `deevyapatel.com`
2. Netlify shows you 4 nameservers — copy all of them
3. Log into GoDaddy → My Products → DNS next to `deevyapatel.com`
4. Scroll to **Nameservers** → Change → **Enter my own nameservers**
5. Paste all 4 Netlify nameservers → Save
6. Wait 10–30 minutes
7. Back in Netlify → **HTTPS** → click **Enable HTTPS** (free SSL)

---

## ✅ YOU'RE LIVE

- Anyone who goes to **deevyapatel.com** sees your portfolio
- Contact form sends a real email to **deevyapatel2003@gmail.com**
- The sender gets an auto-reply from you instantly
- AI chatbot works with your API key hidden on the server

---

## Project Structure

```
deevya-portfolio/
├── public/
│   └── index.html          ← your portfolio (frontend)
├── netlify/
│   └── functions/
│       ├── contact.js      ← contact form backend (sends email)
│       └── chat.js         ← AI chatbot backend (hides API key)
├── netlify.toml            ← Netlify config
├── package.json            ← dependencies
├── .env                    ← your secrets (NEVER commit this)
└── .gitignore              ← keeps .env out of GitHub
```
