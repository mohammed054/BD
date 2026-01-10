# Railway Deployment Configuration

## Deploy Backend to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up or log in

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your BD repository
   - Configure settings:
     - Build Command: `cd backend && npm install`
     - Start Command: `node backend/server.js`
     - Environment Variables: None needed (uses defaults)

3. **Get Backend URL**
   - After deployment, Railway will provide a URL like:
     `https://bd-backend.up.railway.app`

4. **Update Frontend API URL**
   - Edit `frontend/src/utils/api.js`
   - Update `API_BASE` with your Railway URL

## Deploy Frontend to GitHub Pages

1. **Update package.json**
   - Already configured with deploy script

2. **Add GitHub Pages Homepage**
   - Edit `frontend/package.json`:
     ```json
     "homepage": "https://[your-username].github.io/BD"
     ```

3. **Deploy**
   ```bash
   cd frontend
   npm run deploy
   ```

4. **Access Your Site**
   - Go to: `https://[your-username].github.io/BD`

## Environment Variables (Optional)

For Railway backend, you can optionally add:
- `PORT`: Default is 3000 (Railway auto-sets this)
- `DATABASE_URL`: Not needed (using SQLite file)

## Testing After Deployment

1. Test Backend:
   ```bash
   curl https://bd-backend.up.railway.app/api/health
   ```

2. Test Frontend:
   - Open your GitHub Pages URL
   - Test adding categories, items, guests
   - Test language toggle
   - Test dark/light mode

## Railway Dashboard

Monitor your backend at:
- View logs
- Check metrics
- Manage deployments
- Scale resources if needed