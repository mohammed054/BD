import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { api } from '../utils/api';
import { Sparkles } from './Confetti';

export default function GuestList() {
  const { t, language } = useLanguage();
  const { userName, isRegistered, register } = useUser();
  const [guests, setGuests] = useState([]);
  const [newGuestName, setNewGuestName] = useState('');
  const [sparklePos, setSparklePos] = useState(null);

  useEffect(() => {
    fetchGuests();
    const interval = setInterval(fetchGuests, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchGuests = async () => {
    try {
      const data = await api.guests.getAll();
      setGuests(data);
    } catch (error) {
      console.error('Failed to fetch guests:', error);
    }
  };

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

  return (
    <>
      {sparklePos && <Sparkles x={sparklePos.x} y={sparklePos.y} />}
      <div className="guest-section">
        <h2>🎂 {t.guests} ({guests.length})</h2>

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
              <span className="guest-name">{guest.name}</span>
              {guest.name === userName && <span className="guest-badge">You</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}