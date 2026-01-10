# Deployment Guide - Two Repos Setup

This project uses two separate repositories:
1. **BD-backend** (Railway) - Backend API with SQLite database
2. **BD** (GitHub Pages) - Frontend React application

## Architecture

```
Frontend (GitHub Pages)  →  Backend API (Railway)  →  SQLite Database
https://mohammed054.github.io/BD/  →  https://bd-backend.up.railway.app  →  database.sqlite
```

All data is saved in the backend database and shared across all users.

## Step 1: Deploy Backend to Railway

### Option A: Automatic (Recommended)

1. **Push BD-backend to GitHub**
   ```bash
   cd C:\Users\moham\OneDrive\Desktop\BD-backend
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Railway**
   - Go to https://railway.app
   - Sign up/Login
   - Click "New Project" → "Deploy from GitHub repo"
   - Select "BD-backend" repository
   - Click "Deploy Now"

3. **Get Backend URL**
   - Railway will provide a URL like: `https://bd-backend-production.up.railway.app`
   - Copy this URL (you'll need it for Step 3)

### Option B: Manual with Railway CLI

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. Deploy:
   ```bash
   cd C:\Users\moham\OneDrive\Desktop\BD-backend
   railway init
   railway up
   ```

### Test Backend

```bash
curl https://your-backend-url.railway.app/api/health
```

Should return: `{"status":"ok","timestamp":"..."}`

## Step 2: Deploy Frontend to GitHub Pages

### Update API URL

1. Edit `src/utils/api.js`:
   ```javascript
   const API_BASE = 'https://your-backend-url.railway.app/api';
   ```

2. Update `package.json` homepage:
   ```json
   "homepage": "https://mohammed054.github.io/BD"
   ```

### Automatic Deployment (GitHub Actions)

The `.github/workflows/deploy.yml` is already configured.

1. **Push BD to GitHub**
   ```bash
   cd C:\Users\moham\OneDrive\Desktop\BD
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to https://github.com/mohammed054/BD/settings/pages
   - Under "Build and deployment":
     - Source: GitHub Actions
   - Wait for first deployment to complete

3. **Access Your Site**
   - Go to: https://mohammed054.github.io/BD/

### Manual Deployment

```bash
cd C:\Users\moham\OneDrive\Desktop\BD
npm install
npm run build
npm run deploy
```

## Step 3: Connect Frontend to Backend

Make sure the API URL in `src/utils/api.js` matches your Railway backend URL:

```javascript
const API_BASE = 'https://bd-backend.up.railway.app/api';
```

Or your specific Railway URL.

## How It Works

### Data Persistence

1. User adds category/item → Frontend sends POST to Backend API
2. Backend saves to SQLite database on Railway
3. Database persists across all users and sessions
4. All users see the same data

### Real-time Updates

- Frontend polls backend every 30 seconds
- Connection status indicator shows sync status
- Changes are visible to all users automatically

### Data Safety

- SQLite database is stored on Railway filesystem
- Persists across deployments and restarts
- All users share the same database

## Troubleshooting

### Frontend shows "Cloud Sync Offline"

- Check backend is running: `curl https://your-backend-url/api/health`
- Check API URL is correct in `src/utils/api.js`
- Check CORS is enabled on backend (it is!)

### Changes not visible to others

- Make sure you're using Railway backend, not localhost
- Check connection status shows "Cloud Sync Active"
- Try refreshing the page

### Database not persisting

- Railway stores SQLite in project directory
- Ensure you're not using `/tmp` for database
- Database file should be `database.sqlite` in project root

### GitHub Pages not updating

- Check GitHub Actions tab in your repo
- Wait for deployment to complete (green checkmark)
- Clear browser cache

## Verification

1. Test both repos locally:
   ```bash
   # Backend
   cd BD-backend && npm start

   # Frontend (new terminal)
   cd BD && npm run dev
   ```

2. Add some categories/items locally

3. Deploy both to production

4. Visit https://mohammed054.github.io/BD/ from different browsers/devices
   - Should see the same data
   - Connection status should show "Cloud Sync Active"

## Important Notes

- Backend MUST be deployed for data persistence
- Local backend (localhost:3000) won't share data with others
- Railway free tier is sufficient for this app
- Database size is limited by Railway storage (500MB free tier)

## URLs After Deployment

- Frontend: https://mohammed054.github.io/BD/
- Backend: https://bd-backend.up.railway.app (or your Railway URL)
- API Docs: https://your-backend-url.railway.app/

## Support

For issues:
- Check Railway logs for backend errors
- Check browser console for frontend errors
- Check GitHub Actions for deployment errors