# 🎉 Mohammed & Ahmad BD - Camping & Party Organizer

A modern, interactive, pixel-style camping/party organizer website with cloud-based storage and bilingual support (Arabic/English).

## Features

### Frontend
- 🎂 **Birthday Theme** - Countdown timer to January 21, 2026
- 🌙 **Dark/Light Mode** - Toggle between themes
- 🌍 **Bilingual Support** - Arabic (RTL) and English
- ✨ **Pixel-Style Animations** - Glowing buttons, hover effects, particle animations
- 📋 **Category & Item Management** - Add, edit, delete categories and items
- ✅ **Claim/Unclaim System** - Guests can claim items with their name
- 👥 **Guest Registration** - Join the party with fun sparkle effects
- 🎊 **Confetti Celebrations** - Trigger confetti on title click
- 📥 **Bulk Import** - Import categories and items via JSON
- 📱 **Responsive Design** - Works on mobile and desktop

### Backend
- ☁️ **Cloud Storage** - Railway backend with SQLite database
- 🔗 **REST API** - Full CRUD operations for categories, items, and guests
- 🔄 **Auto-refresh** - Frontend polls every 30 seconds
- 🛡️ **CORS Enabled** - Ready for GitHub Pages deployment

## Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Deployment

### Backend to Railway

1. Create a new Railway project
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `node backend/server.js`
5. Deploy!

### Frontend to GitHub Pages

1. Install gh-pages (already installed):
```bash
cd frontend
npm install --save-dev gh-pages
```

2. Build and deploy:
```bash
npm run deploy
```

The site will be available at `https://yourusername.github.io/BD/`

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Items
- `GET /api/items/category/:categoryId` - Get items for a category
- `POST /api/items` - Create new item
- `PUT /api/items/:id/claim` - Claim/unclaim item
- `DELETE /api/items/:id` - Delete item

### Guests
- `GET /api/guests` - Get all guests
- `POST /api/guests` - Register new guest

### Import
- `POST /api/import` - Bulk import categories and items

## Import Data Format

```json
{
  "categories": [
    {
      "name_en": "Food",
      "name_ar": "الطعام",
      "icon": "🍖",
      "order_index": 1,
      "items": [
        { "name_en": "Burgers", "name_ar": "برجر" },
        { "name_en": "Hot Dogs", "name_ar": "سجق" }
      ]
    },
    {
      "name_en": "Drinks",
      "name_ar": "المشروبات",
      "icon": "🥤",
      "order_index": 2,
      "items": [
        { "name_en": "Water", "name_ar": "ماء" },
        { "name_en": "Juice", "name_ar": "عصير" }
      ]
    }
  ]
}
```

## Project Structure

```
BD/
├── backend/                 # Node.js + Express + SQLite
│   ├── routes/             # API routes
│   ├── database.js         # SQLite setup
│   ├── server.js           # Main server
│   └── package.json
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React Context (Language, User)
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # API utilities
│   ├── public/
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Technologies

- **Frontend**: React, Vite, CSS-in-JS
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Deployment**: Railway (Backend), GitHub Pages (Frontend)

## License

MIT License - Feel free to use this for your own events!

---

Made with ❤️ for Mohammed & Ahmad's Birthday Celebration!