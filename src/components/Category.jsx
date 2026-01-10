import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { api } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Category({ category, editMode, onDelete }) {
  const { t, language } = useLanguage();
  const { userName } = useUser();
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const data = await api.items.getByCategory(category.id);
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  }, [category.id]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      await api.items.add({
        category_id: category.id,
        name_ar: language === 'ar' ? newItemName : '',
        name_en: language === 'en' ? newItemName : '',
        price: parseFloat(newItemPrice) || 0,
      });
      setNewItemName('');
      setNewItemPrice('');
      setShowAddForm(false);
      fetchItems();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleClaim = async (item) => {
    try {
      if (item.claimed && item.claimed_by === userName) {
        await api.items.claim(item.id, false, null);
      } else if (!item.claimed) {
        await api.items.claim(item.id, true, userName);
      }
      fetchItems();
    } catch (error) {
      console.error('Failed to claim item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.items.delete(itemId);
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const categoryName = language === 'ar' ? category.name_ar : category.name_en;

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      scale: 0.9
    },
    show: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: {
      opacity: 0,
      x: 50,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="category"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      whileHover={{ 
        scale: 1.01,
        boxShadow: "0 12px 40px rgba(255, 217, 61, 0.2)"
      }}
      layout
    >
      <motion.div 
        className="category-header"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ 
          background: "linear-gradient(90deg, var(--bg-card) 0%, var(--bg-primary) 100%)"
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="category-title">
          <motion.span 
            className="category-icon"
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {category.icon || '📦'}
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
          >
            {categoryName}
          </motion.span>
          <motion.span 
            className="item-count"
            whileHover={{ scale: 1.2, rotate: 10 }}
            animate={{ 
              boxShadow: [
                "0 0 10px rgba(255, 107, 157, 0.3)",
                "0 0 20px rgba(255, 107, 157, 0.5)",
                "0 0 10px rgba(255, 107, 157, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {items.length}
          </motion.span>
        </div>
        <div className="category-actions" onClick={(e) => e.stopPropagation()}>
          <AnimatePresence mode="popLayout">
            {editMode && (
              <>
                <motion.button 
                  className="action-btn add-btn" 
                  onClick={() => setShowAddForm(!showAddForm)}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0, rotate: 180 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.8 }}
                >
                  ➕
                </motion.button>
                <motion.button 
                  className="action-btn delete-btn" 
                  onClick={() => onDelete(category.id)}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0, rotate: 180 }}
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  whileTap={{ scale: 0.8 }}
                >
                  🗑️
                </motion.button>
              </>
            )}
          </AnimatePresence>
          <motion.button 
            className={`expand-btn ${expanded ? 'expanded' : ''}`}
            animate={{ rotate: expanded ? 0 : -90 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            whileHover={{ scale: 1.2, rotate: expanded ? 10 : -80 }}
            whileTap={{ scale: 0.8 }}
          >
            ▼
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {showAddForm && (
          <motion.form 
            className="add-item-form" 
            onSubmit={handleAddItem}
            initial={{ 
              opacity: 0, 
              height: 0,
              scale: 0.9
            }}
            animate={{ 
              opacity: 1, 
              height: 'auto',
              scale: 1
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              scale: 0.9
            }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <motion.input
              type="text"
              placeholder={t.itemName}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="item-input"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.input
              type="number"
              placeholder="Price"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              className="item-input"
              step="0.01"
              min="0"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button 
              type="submit" 
              className="item-submit-btn"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              ✓
            </motion.button>
            <motion.button 
              type="button" 
              className="item-cancel-btn"
              onClick={() => setShowAddForm(false)}
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {expanded && (
          <motion.div 
            className="items-list"
            initial={{ 
              opacity: 0, 
              height: 0
            }}
            animate={{ 
              opacity: 1, 
              height: 'auto'
            }}
            exit={{ 
              opacity: 0, 
              height: 0
            }}
            transition={{ duration: 0.3 }}
          >
            {items.length === 0 ? (
              <motion.p 
                className="empty-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ 
                    x: [0, 10, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  💝 No items yet! Add some gifts! 🎁
                </motion.div>
              </motion.p>
            ) : (
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`item ${item.claimed ? 'claimed' : ''}`}
                    variants={itemVariants}
                    layout
                    drag={editMode ? false : "x"}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, info) => {
                      if (!editMode && !item.claimed && info.offset.x > 100) {
                        handleClaim(item);
                      }
                    }}
                    whileDrag={{ scale: 1.05, rotate: 5 }}
                    whileHover={{ 
                      scale: 1.02,
                      x: 8,
                      boxShadow: item.claimed 
                        ? "0 8px 32px rgba(107, 203, 119, 0.3)"
                        : "0 8px 32px rgba(255, 107, 157, 0.3)"
                    }}
                  >
                    <div className="item-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                      <motion.span 
                        className="item-name"
                        whileHover={{ scale: 1.02 }}
                      >
                        {language === 'ar' ? item.name_ar : item.name_en}
                      </motion.span>
                      <motion.span 
                        className="item-price"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          color: ['var(--accent-secondary)', 'var(--accent-cyan)', 'var(--accent-secondary)']
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        ${item.price || 0}
                      </motion.span>
                    </div>
                    <div className="item-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AnimatePresence mode="popLayout">
                        {item.claimed && (
                          <motion.span 
                            className="claimed-by"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            style={{ fontSize: 'var(--font-size-base)', color: 'var(--accent-success)', fontWeight: 'bold' }}
                          >
                            ✓ {item.claimed_by}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <motion.button
                        className={`claim-btn ${item.claimed ? 'claimed' : ''}`}
                        onClick={() => handleClaim(item)}
                        disabled={item.claimed && item.claimed_by !== userName}
                        whileHover={{ scale: 1.2, rotate: item.claimed ? 0 : -10 }}
                        whileTap={{ scale: 0.8 }}
                        animate={item.claimed ? {
                          boxShadow: [
                            "0 0 15px rgba(107, 203, 119, 0.3)",
                            "0 0 25px rgba(107, 203, 119, 0.5)",
                            "0 0 15px rgba(107, 203, 119, 0.3)"
                          ]
                        } : {
                          boxShadow: [
                            "0 0 15px rgba(255, 217, 61, 0.3)",
                            "0 0 25px rgba(255, 217, 61, 0.5)",
                            "0 0 15px rgba(255, 217, 61, 0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          padding: '0.5rem',
                          background: item.claimed ? 'var(--accent-success)' : 'var(--accent-secondary)',
                          border: `2px solid ${item.claimed ? 'var(--accent-success)' : 'var(--accent-secondary)'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          minWidth: '44px',
                          minHeight: '44px',
                          fontSize: '1.2rem'
                        }}
                      >
                        {item.claimed ? '✓' : '🤝'}
                      </motion.button>
                      <AnimatePresence>
                        {editMode && (
                          <motion.button
                            className="delete-item-btn"
                            onClick={() => handleDeleteItem(item.id)}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            whileTap={{ scale: 0.8 }}
                            style={{
                              padding: '0.5rem',
                              background: 'var(--bg-card)',
                              color: 'var(--text-primary)',
                              border: '2px solid var(--border-color)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              minWidth: '40px',
                              minHeight: '40px'
                            }}
                          >
                            ✕
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
