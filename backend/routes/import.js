const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/', (req, res) => {
  const { categories } = req.body;
  const results = { categoriesAdded: 0, itemsAdded: 0, errors: [] };

  if (!Array.isArray(categories)) {
    return res.status(400).json({ error: 'Categories must be an array' });
  }

  db.serialize(() => {
    categories.forEach((cat, catIndex) => {
      db.run(
        'INSERT INTO categories (name_ar, name_en, icon, order_index) VALUES (?, ?, ?, ?)',
        [cat.name_ar || '', cat.name_en || '', cat.icon || '', cat.order_index || 0],
        function(err) {
          if (err) {
            results.errors.push(`Category ${catIndex}: ${err.message}`);
            return;
          }
          results.categoriesAdded++;

          if (Array.isArray(cat.items)) {
            cat.items.forEach((item) => {
              db.run(
                'INSERT INTO items (category_id, name_ar, name_en) VALUES (?, ?, ?)',
                [this.lastID, item.name_ar || '', item.name_en || ''],
                function(err) {
                  if (err) {
                    results.errors.push(`Item in category ${cat.name_en}: ${err.message}`);
                    return;
                  }
                  results.itemsAdded++;
                }
              );
            });
          }
        }
      );
    });

    setTimeout(() => {
      res.json(results);
    }, 500);
  });
});

module.exports = router;