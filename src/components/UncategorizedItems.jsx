import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { api } from '../utils/api';

export default function UncategorizedItems() {
  const { language } = useLanguage();
  const { userName } = useUser();
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [priceInput, setPriceInput] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      const data = await api.items.getUncategorized();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      await api.items.add({
        category_id: null,
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

  return (
    <div className="category">
      <div className="category-header">
        <div className="category-title">
          <span className="category-icon">📦</span>
          <span>Uncategorized Items</span>
          <span className="item-count">{items.length}</span>
        </div>
        <div className="category-actions">
          <button className="action-btn add-btn" onClick={() => setShowAddForm(!showAddForm)}>
            ➕
          </button>
        </div>
      </div>

      {showAddForm && (
        <form className="add-item-form" onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="Item Name"
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

      <div className="items-list">
        {items.length === 0 ? (
          <p className="empty-message">No uncategorized items</p>
        ) : (
           items.map((item) => (
             <div
               key={item.id}
               className={`item ${item.claimed ? 'claimed' : ''}`}
             >
               <div className="item-info">
                 <span className="item-name">
                   {language === 'ar' ? item.name_ar : item.name_en}
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
              <div className="item-actions">
                {item.claimed && (
                  <span className="claimed-by">
                    ✓ {item.claimed_by}
                  </span>
                )}
                <button
                  className={`claim-btn ${item.claimed ? 'claimed' : ''}`}
                  onClick={() => handleClaim(item)}
                  disabled={item.claimed && item.claimed_by !== userName}
                >
                  {item.claimed ? '✓' : '🤝'}
                </button>
                <button
                  className="delete-item-btn"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}