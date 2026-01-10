import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../utils/api';
import Category from './Category';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoryList() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name_ar: '', name_en: '', icon: '' });

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.categories.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    const interval = setInterval(fetchCategories, 30000);
    return () => clearInterval(interval);
  }, [fetchCategories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name_ar || !newCategory.name_en) return;

    try {
      await api.categories.add(newCategory);
      setNewCategory({ name_ar: '', name_en: '', icon: '' });
      setShowAddCategory(false);
      fetchCategories();
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category and all its items?')) return;
    try {
      await api.categories.delete(id);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const formVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      scale: 0.8
    },
    show: { 
      opacity: 1, 
      height: 'auto',
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="categories-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", delay: 0.2 }}
    >
      <motion.div 
        className="categories-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.h2
          animate={{ 
            textShadow: [
              "2px 2px 0 var(--accent-secondary)",
              "4px 4px 0 var(--accent-primary)",
              "2px 2px 0 var(--accent-secondary)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}
        >
          📋 Categories
        </motion.h2>
        <motion.button
          className={`edit-mode-btn ${editMode ? 'active' : ''}`}
          onClick={() => setEditMode(!editMode)}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: editMode ? 'var(--accent-success)' : 'var(--bg-card)',
            border: '3px solid var(--border-color)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'bold',
            minWidth: '48px',
            minHeight: '48px'
          }}
        >
          {editMode ? `✓ ${t.save}` : `✏️ ${t.edit}`}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {editMode && (
          <motion.div 
            className="category-actions-row"
            variants={formVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ marginBottom: '1rem' }}
          >
            <motion.button 
              className="add-category-btn" 
              onClick={() => setShowAddCategory(!showAddCategory)}
              whileHover={{ scale: 1.02, rotate: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                padding: '0.75rem 1.5rem', 
                background: 'var(--accent-primary)',
                border: '3px solid var(--accent-primary)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'bold',
                minHeight: '48px',
                width: '100%',
                color: 'var(--text-primary)'
              }}
            >
              ➕ {t.addCategory}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {showAddCategory && (
          <motion.form 
            className="add-category-form" 
            onSubmit={handleAddCategory}
            variants={formVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <motion.input
              type="text"
              placeholder="Category Name (English)"
              value={newCategory.name_en}
              onChange={(e) => setNewCategory({ ...newCategory, name_en: e.target.value })}
              className="category-input"
              required
              whileFocus={{ scale: 1.02 }}
            />
            <motion.input
              type="text"
              placeholder="اسم الفئة (عربي)"
              value={newCategory.name_ar}
              onChange={(e) => setNewCategory({ ...newCategory, name_ar: e.target.value })}
              className="category-input"
              required
              whileFocus={{ scale: 1.02 }}
            />
            <motion.input
              type="text"
              placeholder="📦 Icon (emoji)"
              value={newCategory.icon}
              onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
              className="category-input icon-input"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button 
              type="submit" 
              className="category-submit-btn"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              style={{ 
                padding: '0.75rem 1rem', 
                background: 'var(--accent-success)',
                border: '3px solid var(--accent-success)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 'bold',
                minWidth: '48px',
                minHeight: '48px'
              }}
            >
              ✓
            </motion.button>
            <motion.button 
              type="button" 
              className="category-cancel-btn"
              onClick={() => setShowAddCategory(false)}
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              style={{ 
                padding: '0.75rem 1rem', 
                background: 'var(--bg-card)',
                border: '3px solid var(--border-color)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                minWidth: '48px',
                minHeight: '48px'
              }}
            >
              ✕
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <motion.div 
        className="categories-list"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {categories.length === 0 ? (
          <motion.p 
            className="empty-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              📦 No categories yet! Add some gift categories! 🎁
            </motion.div>
          </motion.p>
        ) : (
          <AnimatePresence mode="popLayout">
            {categories.map((category) => (
              <Category
                key={category.id}
                category={category}
                editMode={editMode}
                onDelete={handleDeleteCategory}
              />
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
}
