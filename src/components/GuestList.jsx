import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { api } from '../utils/api';
import { Sparkles } from './Confetti';

export default function GuestList() {
  const { t } = useLanguage();
  const { userName, isRegistered, register } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [guests, setGuests] = useState([]);
  const [guestTotals, setGuestTotals] = useState({});
  const [newGuestName, setNewGuestName] = useState('');
  const [sparklePos, setSparklePos] = useState(null);

  const fetchGuests = useCallback(async () => {
    try {
      const data = await api.guests.getAll();
      setGuests(data);
      
      const totals = {};
      for (const guest of data) {
        try {
          const totalData = await api.guests.getTotal(guest.id);
          totals[guest.id] = totalData.total;
        } catch {
          totals[guest.id] = 0;
        }
      }
      setGuestTotals(totals);
    } catch (error) {
      console.error('Failed to fetch guests:', error);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
    const interval = setInterval(fetchGuests, 30000);
    return () => clearInterval(interval);
  }, [fetchGuests]);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const button = e.target;
    const rect = button.getBoundingClientRect();
    setSparklePos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

    try {
      await api.guests.add(newGuestName);
      register(newGuestName);
      setNewGuestName('');
      fetchGuests();
      setTimeout(() => setSparklePos(null), 1000);
    } catch (error) {
      console.error('Failed to add guest:', error);
    }
  };

  const handleDeleteGuest = async (guestId) => {
    try {
      await api.guests.delete(guestId);
      fetchGuests();
    } catch (error) {
      console.error('Failed to delete guest:', error);
    }
  };

  const getAvatarEmoji = (name) => {
    const emojis = ['🎨', '🎭', '🎪', '🎢', '🎡', '🎠', '🎯', '🎱', '🎳', '🎮', '🎲', '🎰', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return emojis[Math.abs(hash) % emojis.length];
  };

  return (
    <>
      {sparklePos && <Sparkles x={sparklePos.x} y={sparklePos.y} />}
      <div className="guest-section">
        <div className="guest-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}>
            🎂 {t.guests} ({guests.length})
          </h2>
          <button
            className={`edit-mode-btn ${editMode ? 'active' : ''}`}
            onClick={() => setEditMode(!editMode)}
            style={{ padding: '0.5rem 1rem', minWidth: '48px', minHeight: '48px' }}
          >
            {editMode ? '✓ Done' : '✏️ Edit'}
          </button>
        </div>

        {!isRegistered && (
          <form className="guest-form" onSubmit={handleJoin}>
            <input
              type="text"
              placeholder={t.joinGuest}
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              className="guest-input"
            />
            <button type="submit" className="guest-btn">
              🚀 {t.joinButton}
            </button>
          </form>
        )}

        <div className="guest-list">
          {guests.map((guest) => (
            <div key={guest.id} className="guest-item">
              <div className="guest-avatar" style={{ fontSize: '2.5rem', marginRight: '1rem' }}>
                {getAvatarEmoji(guest.name)}
              </div>
              
              <div className="guest-info" style={{ flex: 1 }}>
                <div className="guest-name">
                  {guest.name}
                  {guest.name === userName && <span className="guest-badge">You</span>}
                </div>
                <div className="guest-total">
                  ${(guestTotals[guest.id] || 0).toFixed(2)}
                </div>
              </div>
              
              {editMode && (
                <button
                  className="delete-guest-btn"
                  onClick={() => handleDeleteGuest(guest.id)}
                  style={{ minWidth: '40px', minHeight: '40px' }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          {guests.length === 0 && (
            <p className="empty-message">
              <div style={{ marginBottom: '1rem', fontSize: '3rem' }}>🎈</div>
              No guests yet! Be the first to join! 🎈
            </p>
          )}
        </div>
      </div>
    </>
  );
}
