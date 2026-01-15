import { useState, useEffect, useMemo } from 'react';
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
  const [guestTotals, setGuestTotals] = useState({});
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guestItems, setGuestItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [showSplit, setShowSplit] = useState(false);

  useEffect(() => {
    const fetchGuestTotals = async () => {
      const totals = {};
      for (const guest of PREDEFINED_GUESTS) {
        try {
          const totalData = await api.guests.getTotal(guest.name);
          totals[guest.id] = totalData?.total || 0;
        } catch {
          totals[guest.id] = 0;
        }
      }
      setGuestTotals(totals);
    };
    fetchGuestTotals();
  }, []);

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
      } catch (error) {
        console.error('Failed to fetch all items:', error);
      }
    };
    fetchAllItems();
  }, []);

  const splitCalculation = useMemo(() => {
    const totalAmount = allItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    const activeGuests = PREDEFINED_GUESTS.filter(guest =>
      guestTotals[guest.id] > 0 || guest.name === userName
    );
    const splitAmount = activeGuests.length > 0 ? totalAmount / activeGuests.length : 0;

    return {
      totalAmount,
      activeGuests,
      splitAmount,
      guestShares: PREDEFINED_GUESTS.map(guest => ({
        ...guest,
        share: splitAmount,
        personalTotal: guestTotals[guest.id] || 0,
        difference: (guestTotals[guest.id] || 0) - splitAmount
      }))
    };
  }, [allItems, guestTotals, userName]);

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
                <div className="guest-total" title="Split equally among all guests">
                  ${(guestTotals[guest.id] || 0).toFixed(2)}
                </div>
              </div>

              <div className="guest-arrow">→</div>
            </div>
          ))}
        </div>

        <button
          className="split-toggle-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowSplit(!showSplit);
          }}
        >
          {showSplit ? '🙈 Hide Split' : '💰 Show Split'}
        </button>

        {showSplit && (
          <div className="split-details">
            <div className="split-summary">
              <div className="split-row">
                <span>Total Items Cost:</span>
                <span className="split-value">${splitCalculation.totalAmount.toFixed(2)}</span>
              </div>
              <div className="split-row">
                <span>Active Guests:</span>
                <span className="split-value">{splitCalculation.activeGuests.length}</span>
              </div>
              <div className="split-row highlight">
                <span>Split per Guest:</span>
                <span className="split-value">${splitCalculation.splitAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="split-guests">
              {splitCalculation.guestShares.map(guest => (
                <div
                  key={guest.id}
                  className={`split-guest-item ${guest.name === userName ? 'current-user-item' : ''}`}
                >
                  <div className="split-guest-info">
                    <span className="split-guest-emoji">{getAvatarEmoji(guest.name)}</span>
                    <span className="split-guest-name">{guest.name}</span>
                  </div>
                  <div className="split-amounts">
                    <div className="split-personal">
                      Personal: ${guest.personalTotal.toFixed(2)}
                    </div>
                    <div className={`split-share ${guest.difference >= 0 ? 'owes' : 'gets'}`}>
                      {guest.difference >= 0
                        ? `Owes: $${guest.difference.toFixed(2)}`
                        : `Gets back: $${Math.abs(guest.difference).toFixed(2)}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
                  <div className="total-label">Split Total</div>
                  <div className="total-amount">
                    ${((guestTotals[selectedGuest.id] || 0)).toFixed(2)}
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
