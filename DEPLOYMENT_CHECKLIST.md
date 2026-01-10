# Quick Deployment Checklist

## Before You Deploy

- [ ] Backend code pushed to `https://github.com/mohammed054/BD-backend`
- [ ] Frontend code pushed to `https://github.com/mohammed054/BD`
- [ ] API_BASE in frontend matches Railway backend URL
- [ ] package.json homepage set correctly

## Deploy Backend to Railway

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select `BD-backend` repo
4. Deploy
5. Copy backend URL (e.g., `https://bd-backend.up.railway.app`)

## Update Frontend API URL

Edit `src/utils/api.js`:
```javascript
const API_BASE = 'https://bd-backend.up.railway.app/api'; // Replace with your URL
```

## Deploy Frontend to GitHub Pages

1. Go to https://github.com/mohammed054/BD/settings/pages
2. Source: GitHub Actions
3. Push code to main branch

## Test Everything

```bash
# Test backend health
curl https://your-backend-url.railway.app/api/health

# Open frontend
https://mohammed054.github.io/BD/
```

## Verification

- [ ] Backend health check returns `{"status":"ok"}`
- [ ] Frontend loads without errors
- [ ] Connection status shows "Cloud Sync Active"
- [ ] Can add categories/items
- [ ] Data persists on page refresh
- [ ] Data visible to other users

## What Gets Saved in Cloud

✅ Categories (names, icons, order)
✅ Items (names, claimed status, claimed by)
✅ Guests (names, join time)

All stored in Railway SQLite database, shared across all users!