import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { api } from '../utils/api';
import './GuestList.css';

const PREDEFINED_GUESTS = [
  { id: 1, name: 'محمد مدثر' },
  { id: 2, name: 'احمد مدثر' },
  { id: 3, name: 'ورد علاء' },
  { id: 4, name: 'عمر طه' },
  { id: 5, name: 'احمد كنجو' },
  { id: 6, name: 'محمد عبدالحافظ' },
  { id: 7, name: 'عبدالله علي' }
];

export default function GuestList() {
  const { userName, logout } = useUser();
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guestItems, setGuestItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [splitTotal, setSplitTotal] = useState(0);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const [categoriesData, itemsData] = await Promise.all([
          api.categories.getAll(),
          api.items.getUncategorized()
        ]);

        let allItemsList = [...(itemsData || [])];

        const categoryItemsPromises = (categoriesData || []).map(cat =>
          api.items.getByCategory(cat.id).catch(() => [])
        );
        const allCategoryItems = await Promise.all(categoryItemsPromises);

        allCategoryItems.forEach(catItems => {
          allItemsList.push(...catItems);
        });

        setAllItems(allItemsList);
        const total = allItemsList.reduce((sum, item) => sum + (item.price || 0), 0);
        setSplitTotal(total / 7);
      } catch (error) {
        console.error('Failed to fetch all items:', error);
      }
    };
    fetchAllItems();
  }, []);

  const getAvatarEmoji = (name) => {
    const emojis = ['🎨', '🎭', '🎪', '🎢', '🎡', '🎠', '🎯', '🎱', '🎳', '🎮', '🎲', '🎰', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return emojis[Math.abs(hash) % emojis.length];
  };

  const handleGuestClick = async (guest) => {
    setLoadingItems(true);
    setSelectedGuest(guest);
    setGuestItems([]);
    
    try {
      const [categoriesData, itemsData] = await Promise.all([
        api.categories.getAll(),
        api.items.getUncategorized()
      ]);

      const claimedItems = (itemsData || []).filter(item => item.claimed && item.claimed_by === guest.name);
      
      const categoryItemsPromises = (categoriesData || []).map(cat => 
        api.items.getByCategory(cat.id).catch(() => [])
      );
      const allCategoryItems = await Promise.all(categoryItemsPromises);
      
      allCategoryItems.forEach(catItems => {
        const claimedCatItems = (catItems || []).filter(item => item.claimed && item.claimed_by === guest.name);
        claimedItems.push(...claimedCatItems);
      });

      setGuestItems(claimedItems);
    } catch (error) {
      console.error('Failed to fetch guest items:', error);
      setGuestItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  return (
    <>
      <div className="guest-section">
        <div className="guest-header">
          <h2>🎂 Guests</h2>
          <div className="current-user">
            <span className="user-emoji">👤</span>
            <span className="user-name">{userName}</span>
          </div>
        </div>

        <div className="guest-list">
          {PREDEFINED_GUESTS.map((guest) => (
            <div
              key={guest.id}
              className={`guest-item ${guest.name === userName ? 'current-user-item' : ''}`}
              onClick={() => handleGuestClick(guest)}
            >
              <div className="guest-avatar">
                {getAvatarEmoji(guest.name)}
              </div>

              <div className="guest-info">
                <div className="guest-name">
                  {guest.name}
                  {guest.name === userName && <span className="guest-badge">You</span>}
                </div>
                <div className="guest-total" title="Split share">
                  ${splitTotal.toFixed(2)}
                </div>
              </div>

              <div className="guest-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      {selectedGuest && (
        <div className="guest-modal-overlay" onClick={() => setSelectedGuest(null)}>
          <div className="guest-modal" onClick={(e) => e.stopPropagation()}>
            <div className="guest-modal-header">
              <div className="modal-title">
                <span className="modal-emoji">{getAvatarEmoji(selectedGuest.name)}</span>
                <h3>{selectedGuest.name}'s Items</h3>
              </div>
              <button className="close-modal-btn" onClick={() => setSelectedGuest(null)}>
                ✕
              </button>
            </div>

            {loadingItems ? (
              <div className="empty-state">
                <div className="loading-spinner">⏳</div>
                <p>Loading items...</p>
              </div>
            ) : guestItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-emoji">🎈</div>
                <p>No items claimed yet</p>
              </div>
            ) : (
              <div className="guest-items-list">
                {guestItems.map((item) => (
                  <div key={item.id} className="guest-item-preview">
                    <div className="item-info">
                      <span className="item-name">
                        {(item.name_en || item.name_ar || 'Unknown Item')?.toString?.() || 'Unknown Item'}
                      </span>
                    </div>
                    <div className="item-price-wrapper">
                      <span className="item-price">${parseFloat(item.price || 0).toFixed(2)}</span>
                    </div>
                  </div>
                ))}

                <div className="guest-total-summary">
                  <div className="total-label">Claimed Total</div>
                  <div className="total-amount">
                    ${guestItems.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
