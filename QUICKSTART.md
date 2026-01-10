# Quick Start Guide

## Local Development

### 1. Start Backend
```bash
cd backend
npm install
npm start
```
Backend runs on http://localhost:3000

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## Testing the App

### Basic Workflow:
1. Open http://localhost:5173
2. Enter your name to join as a guest
3. Click "Edit" button to enter edit mode
4. Click "Add Category" to create categories
5. Expand a category and add items
6. Click "🤝" to claim items (shows green check with your name)
7. Toggle language with the language button
8. Toggle dark/light mode
9. Click the title for confetti!
10. Use "Import" button to bulk load data

### Importing Sample Data:
1. Click "📥 Import" button (bottom right)
2. Click "📝 Load Sample" button
3. Click "Import" button
4. Categories and items will be populated automatically

## Features to Test

✅ **Bilingual Support**
- Toggle between Arabic and English
- Check RTL layout in Arabic mode

✅ **Dark/Light Mode**
- Toggle sun/moon icon
- Verify colors change properly

✅ **Guest System**
- Join with a name
- See your name in guest list
- See "You" badge

✅ **Claim System**
- Claim items (shows green check)
- See claimed by name
- Unclaim your own items

✅ **Edit Mode**
- Add/delete categories
- Add/delete items
- Bulk import

✅ **Animations**
- Confetti on title click
- Sparkles on guest join
- Hover effects on buttons
- Glowing animations

## Troubleshooting

**Backend not responding?**
- Check backend is running on port 3000
- Run `curl http://localhost:3000/api/health`

**Frontend not connecting?**
- Check browser console for errors
- Verify API_BASE in frontend/src/utils/api.js

**Data not saving?**
- Check backend logs
- Verify SQLite database file exists

**Import not working?**
- Ensure JSON is valid format
- Check browser console for errors