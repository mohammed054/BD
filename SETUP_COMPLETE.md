# Mohammed & Ahmad BD - Complete Setup Guide

## Overview

Two separate repositories work together to provide a cloud-connected party organizer:

1. **BD-backend** - API + SQLite Database (deployed to Railway)
2. **BD** - Frontend React App (deployed to GitHub Pages)

## Current Status

✅ Backend code: `C:\Users\moham\OneDrive\Desktop\BD-backend`
✅ Frontend code: `C:\Users\moham\OneDrive\Desktop\BD`
✅ Backend repo: `https://github.com/mohammed054/BD-backend`
✅ Frontend repo: `https://github.com/mohammed054/BD`

## Deployment Steps

### Step 1: Deploy Backend (Railway)

```bash
cd C:\Users\moham\OneDrive\Desktop\BD-backend
git add .
git commit -m "Deploy backend to Railway"
git push origin main
```

Then:
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select "BD-backend"
4. Deploy
5. Copy the Railway URL (e.g., `https://bd-backend.up.railway.app`)

### Step 2: Update Frontend API URL

Edit `C:\Users\moham\OneDrive\Desktop\BD\src\utils\api.js`:

```javascript
const API_BASE = 'https://bd-backend.up.railway.app/api'; // Your Railway URL
```

### Step 3: Deploy Frontend (GitHub Pages)

```bash
cd C:\Users\moham\OneDrive\Desktop\BD
git add .
git commit -m "Update frontend with connection status"
git push origin main
```

Then:
1. Go to https://github.com/mohammed054/BD/settings/pages
2. Source: GitHub Actions
3. Wait for deployment

## How Data Persistence Works

```
User A adds item → API call to Railway → Saved in SQLite
                ↑
                ↓
User B visits site → API call to Railway ← Retrieves all items
```

- All data lives in Railway's SQLite database
- Frontend is stateless (just displays data from backend)
- Any user can add/edit and all see changes
- Connection status shows sync status

## Features

### Frontend Features
- Birthday countdown (Jan 21, 2026)
- Bilingual (Arabic RTL + English)
- Dark/light mode
- Category & item management
- Guest registration
- Claim/unclaim items
- Bulk JSON import
- Pixel-style animations
- Connection status indicator

### Backend Features
- RESTful API
- SQLite persistent storage
- CORS enabled
- Health checks

## Testing Checklist

### Local Testing

```bash
# Terminal 1 - Backend
cd C:\Users\moham\OneDrive\Desktop\BD-backend
npm start

# Terminal 2 - Frontend
cd C:\Users\moham\OneDrive\Desktop\BD
npm run dev
```

Test:
- [ ] Open http://localhost:5173
- [ ] Add category
- [ ] Add item
- [ ] Claim item
- [ ] Register guest
- [ ] Toggle language
- [ ] Toggle dark mode
- [ ] Import sample data
- [ ] Check connection status

### Production Testing

- [ ] Deploy backend to Railway
- [ ] Get backend URL
- [ ] Update frontend API URL
- [ ] Deploy frontend to GitHub Pages
- [ ] Visit https://mohammed054.github.io/BD/
- [ ] Test all features work
- [ ] Open in different browser
- [ ] Verify data is shared

## Sample Data Import

Click "📥 Import" → "📝 Load Sample" → "Import"

Pre-loaded categories:
- Food & BBQ 🍖
- Drinks 🥤
- Snacks 🍿
- Camping Gear ⛺
- Music & Entertainment 🎵
- Decorations 🎈
- Utensils & Supplies 🍽️

## Important Notes

### Data Persistence
- ✅ All data saved in Railway SQLite database
- ✅ Shared across all users
- ✅ Persists across deployments
- ❌ Local data (localhost) not shared

### Connection Status
- 🟢 "Cloud Sync Active" - Connected to Railway backend
- 🔴 "Cloud Sync Offline" - Backend unreachable

### Troubleshooting

**Connection status offline:**
- Check backend URL is correct
- Test: `curl https://your-backend-url/api/health`
- Check Railway logs

**Changes not visible to others:**
- Verify using Railway backend URL (not localhost)
- Check connection status
- Clear browser cache

**GitHub Pages not updating:**
- Check GitHub Actions for errors
- Wait for deployment to complete
- Check Pages settings

## URLs

- Frontend: https://mohammed054.github.io/BD/
- Backend: [Your Railway URL]
- GitHub: https://github.com/mohammed054/BD

## Contact & Support

For deployment issues:
- Railway: https://railway.app/app
- GitHub Actions: https://github.com/mohammed054/BD/actions
- Backend Repo: https://github.com/mohammed054/BD-backend

---

Made with ❤️ for Mohammed & Ahmad's Birthday Celebration!