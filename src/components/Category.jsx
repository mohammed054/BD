import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { api } from '../utils/api';

export default function Category({ category, editMode, onDelete }) {
  const { t, language } = useLanguage();
  const { userName } = useUser();
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [priceInput, setPriceInput] = useState('');

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
      } else {
        await api.items.claim(item.id, true, userName);
      }
      await fetchItems();
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

  const handleUpdatePrice = async (itemId) => {
    try {
      await api.items.updatePrice(itemId, parseFloat(priceInput) || 0);
      setEditingPrice(null);
      setPriceInput('');
      fetchItems();
    } catch (error) {
      console.error('Failed to update price:', error);
    }
  };

  const categoryName = language === 'ar' ? category.name_ar : category.name_en;

  return (
    <div className="category">
      <div className="category-header" onClick={() => setExpanded(!expanded)}>
        <div className="category-title">
          <span className="category-icon">{category.icon || '📦'}</span>
          <span>{categoryName}</span>
          <span className="item-count">{items.length}</span>
        </div>
        <div className="category-actions" onClick={(e) => e.stopPropagation()}>
          {editMode && (
            <>
              <button className="action-btn add-btn" onClick={() => setShowAddForm(!showAddForm)}>
                ➕
              </button>
              <button className="action-btn delete-btn" onClick={() => onDelete(category.id)}>
                🗑️
              </button>
            </>
          )}
          <button className={`expand-btn ${expanded ? 'expanded' : ''}`}>
            {expanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <form className="add-item-form" onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder={t.itemName}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="item-input"
          />
          <input
            type="number"
            placeholder="Price"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            className="item-input"
            step="0.01"
            min="0"
          />
          <button type="submit" className="item-submit-btn">
            ✓
          </button>
          <button type="button" className="item-cancel-btn" onClick={() => setShowAddForm(false)}>
            ✕
          </button>
        </form>
      )}

      {expanded && (
        <div className="items-list">
          {items.length === 0 ? (
            <p className="empty-message">
              <div style={{ marginBottom: '1rem', fontSize: '3rem' }}>💝</div>
              No items yet! Add some gifts! 🎁
            </p>
          ) : (
            items.map((item) => (
               <div
                 key={item.id}
                 className={`item ${item.claimed ? 'claimed' : ''}`}
               >
                 <div className="item-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
<span className="item-name">
                      {language === 'ar' ? (item.name_ar || item.name_en || 'Unknown Item') : (item.name_en || item.name_ar || 'Unknown Item')}
                    </span>
                   {editingPrice === item.id ? (
                     <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                       <span>$</span>
                       <input
                         type="number"
                         className="item-input"
                         style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem', minWidth: '80px' }}
                         step="0.01"
                         min="0"
                         value={priceInput}
                         onChange={(e) => setPriceInput(e.target.value)}
                         autoFocus
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                             handleUpdatePrice(item.id);
                           } else if (e.key === 'Escape') {
                             setEditingPrice(null);
                             setPriceInput('');
                           }
                         }}
                       />
                       <button
                         className="item-submit-btn"
                         style={{ padding: '0.25rem 0.5rem', minWidth: '32px', minHeight: '32px' }}
                         onClick={() => handleUpdatePrice(item.id)}
                       >
                         ✓
                       </button>
                       <button
                         className="item-cancel-btn"
                         style={{ padding: '0.25rem 0.5rem', minWidth: '32px', minHeight: '32px' }}
                         onClick={() => {
                           setEditingPrice(null);
                           setPriceInput('');
                         }}
                       >
                         ✕
                       </button>
                     </div>
                   ) : (
                     <span
                       className="item-price"
                       style={{
                         cursor: parseFloat(item.price) === 0 ? 'pointer' : 'default',
                         textDecoration: parseFloat(item.price) === 0 ? 'underline dotted' : 'none',
                       }}
                       onClick={() => {
                         if (parseFloat(item.price) === 0) {
                           setEditingPrice(item.id);
                           setPriceInput('');
                         }
                       }}
                       title={parseFloat(item.price) === 0 ? 'Click to set price' : ''}
                     >
                       ${item.price || 0}
                     </span>
                   )}
                 </div>
<div className="item-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                   {item.claimed && (
                      <span className="claimed-by" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                        {item.claimed_by.length > 10 ? `${item.claimed_by.substring(0, 10)}...` : item.claimed_by}
                      </span>
                    )}
                    <button
                      className={`claim-btn ${item.claimed ? 'claimed' : ''}`}
                      onClick={() => handleClaim(item)}
                      disabled={item.claimed && item.claimed_by !== userName}
                      style={{ minWidth: '100px', minHeight: '40px', fontSize: '0.9rem', padding: '0 0.75rem' }}
                      title={item.claimed && item.claimed_by === userName ? 'Click to unclaim' : item.claimed ? `Claimed by ${item.claimed_by}` : 'Click to claim'}
                    >
                      {item.claimed ? (item.claimed_by === userName ? '🔄 Unclaim' : `🔒`) : '🤝 Claim'}
                    </button>
                   {editMode && (
                     <button
                       className="delete-item-btn"
                       onClick={() => handleDeleteItem(item.id)}
                       style={{ minWidth: '40px', minHeight: '44px' }}
                     >
                       ✕
                     </button>
                   )}
                 </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
