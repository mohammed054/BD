import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { api } from '../utils/api';
import './GuestSelection.css';

export default function GuestSelection() {
  const { t } = useLanguage();
  const { register } = useUser();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await api.guests.getAll();
        setGuests(data);
      } catch (error) {
        console.error('Failed to fetch guests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  const getAvatarEmoji = (name) => {
    const emojis = ['🎨', '🎭', '🎪', '🎢', '🎡', '🎠', '🎯', '🎱', '🎳', '🎮', '🎲', '🎰', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return emojis[Math.abs(hash) % emojis.length];
  };

  const handleGuestSelect = (guest) => {
    register(guest.name);
  };

  if (loading) {
    return (
      <div className="guest-selection">
        <div className="guest-selection-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="guest-selection">
      <div className="guest-selection-content">
        <h1 className="guest-selection-title">🎂 Who are you?</h1>
        <p className="guest-selection-subtitle">Select your guest to continue</p>

        <div className="guest-selection-list">
          {guests.map((guest) => (
            <button
              key={guest.id}
              className="guest-selection-item"
              onClick={() => handleGuestSelect(guest)}
            >
              <div className="guest-selection-avatar">
                {getAvatarEmoji(guest.name)}
              </div>
              <span className="guest-selection-name">{guest.name}</span>
              <span className="guest-selection-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
