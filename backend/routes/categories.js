const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY order_index', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { name_ar, name_en, icon, order_index } = req.body;
  db.run(
    'INSERT INTO categories (name_ar, name_en, icon, order_index) VALUES (?, ?, ?, ?)',
    [name_ar, name_en, icon, order_index || 0],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name_ar, name_en, icon, order_index });
    }
  );
});

router.put('/:id', (req, res) => {
  const { name_ar, name_en, icon, order_index } = req.body;
  db.run(
    'UPDATE categories SET name_ar = ?, name_en = ?, icon = ?, order_index = ? WHERE id = ?',
    [name_ar, name_en, icon, order_index, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id, name_ar, name_en, icon, order_index });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM items WHERE category_id = ?', [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    db.run('DELETE FROM categories WHERE id = ?', [req.params.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Deleted' });
    });
  });
});

module.exports = router;