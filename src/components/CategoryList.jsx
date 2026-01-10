import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../utils/api';
import Category from './Category';

export default function CategoryList() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name_ar: '', name_en: '', icon: '' });

  useEffect(() => {
    fetchCategories();
    const interval = setInterval(fetchCategories, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.categories.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

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

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2>📋 Categories</h2>
        <button
          className={`edit-mode-btn ${editMode ? 'active' : ''}`}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? `✓ ${t.save}` : `✏️ ${t.edit}`}
        </button>
      </div>

      {editMode && (
        <div className="category-actions-row">
          <button className="add-category-btn" onClick={() => setShowAddCategory(!showAddCategory)}>
            ➕ {t.addCategory}
          </button>
        </div>
      )}

      {showAddCategory && (
        <form className="add-category-form" onSubmit={handleAddCategory}>
          <input
            type="text"
            placeholder="Category Name (English)"
            value={newCategory.name_en}
            onChange={(e) => setNewCategory({ ...newCategory, name_en: e.target.value })}
            className="category-input"
            required
          />
          <input
            type="text"
            placeholder="اسم الفئة (عربي)"
            value={newCategory.name_ar}
            onChange={(e) => setNewCategory({ ...newCategory, name_ar: e.target.value })}
            className="category-input"
            required
          />
          <input
            type="text"
            placeholder="📦 Icon (emoji)"
            value={newCategory.icon}
            onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
            className="category-input icon-input"
          />
          <button type="submit" className="category-submit-btn">
            ✓
          </button>
          <button type="button" className="category-cancel-btn" onClick={() => setShowAddCategory(false)}>
            ✕
          </button>
        </form>
      )}

      <div className="categories-list">
        {categories.length === 0 ? (
          <p className="empty-message">{t.noCategories}</p>
        ) : (
          categories.map((category) => (
            <Category
              key={category.id}
              category={category}
              editMode={editMode}
              onDelete={handleDeleteCategory}
            />
          ))
        )}
      </div>
    </div>
  );
}