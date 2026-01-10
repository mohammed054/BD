# Backend Deployed at bd-backend.up.railway.app

Your backend is now live! 🎉

## Current Status

- **Backend URL**: https://bd-backend.up.railway.app
- **Frontend API**: Already configured to point to this URL
- **Target Port**: 3000 (or Railway's PORT env variable)

## Troubleshooting 404 Error

If you're seeing 404 errors:

### 1. Check Railway Deployment Status

Go to: https://railway.app/project/[your-project-id]/service/[service-name]

Look for:
- Green checkmark (deployment successful)
- Red X (deployment failed)
- Yellow spinner (still deploying)

### 2. View Railway Logs

In Railway dashboard:
1. Click on your BD-backend service
2. Click "Logs" tab
3. Look for errors or startup messages

Expected log output:
```
Connected to SQLite database
Server running on port [PORT]
```

### 3. Check Port Configuration

Make sure Railway networking is configured:
- **Public Networking**: Enabled
- **Target Port**: 3000
- **Environment**: Production

### 4. Verify Database

Railway should show:
- Database file exists: `database.sqlite`
- Tables created: categories, items, guests

### 5. Test Endpoints

Try these commands:

```bash
# Root endpoint
curl https://bd-backend.up.railway.app/

# Health check
curl https://bd-backend.up.railway.app/api/health

# Get categories
curl https://bd-backend.up.railway.app/api/categories

# Get guests
curl https://bd-backend.up.railway.app/api/guests
```

## Common Issues & Solutions

### Issue: "Application not found" (404)

**Cause**: Deployment not complete or incorrect port

**Solutions**:
1. Wait 2-3 minutes for deployment to finish
2. Check if build completed successfully in Railway dashboard
3. Verify environment variable `PORT` is set (Railway sets this automatically)
4. Check logs for startup errors

### Issue: Database not persisting

**Cause**: Database path or permissions

**Solution**:
- Ensure `database.sqlite` is in project root
- Don't use `/tmp` or temporary directories

### Issue: CORS errors

**Cause**: CORS not configured

**Solution**:
Already handled in server.js with `app.use(cors())`

## Backend Health Expected Response

**Success**:
```json
{"status":"ok","timestamp":"2024-01-10T..."}
```

**Error**:
```json
{"status":"error","code":404,"message":"Application not found","request_id":"..."}
```

## Frontend Connection

Frontend is already configured at:
```
API_BASE = 'https://bd-backend.up.railway.app/api'
```

When backend is working, frontend will show:
- 🟢 "Cloud Sync Active"
- "Updated [time]"
- All data persists and syncs

## Next Steps

1. **Verify backend is working**:
   - Check Railway logs
   - Test curl commands
   - Ensure no errors

2. **Deploy frontend** (already ready):
   - Push to GitHub
   - GitHub Actions will auto-deploy
   - Access at: https://mohammed054.github.io/BD/

3. **Test full flow**:
   - Visit frontend
   - Add categories/items
   - Check connection status
   - Open in different browser
   - Verify data is shared

## Railway Dashboard Links

- **Project**: https://railway.app
- **Logs**: [Click your service → Logs]
- **Settings**: [Click your service → Settings]
- **Metrics**: [Click your service → Metrics]
- **Deployments**: [Click your service → Deployments]

## Need Help?

Check Railway docs: https://docs.railway.app

Or check:
- Railway deployment logs
- Build logs (if build failed)
- Runtime logs (if app crashes)

---

**Remember**: Backend MUST be running for data persistence! Without backend, data won't be saved or shared across users.