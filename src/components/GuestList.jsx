import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { api } from '../utils/api';
import { Sparkles } from './Confetti';
import { motion, AnimatePresence } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      scale: 0.8
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
      scale: 0.8,
      transition: { duration: 0.2 }
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
      <motion.div 
        className="guest-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <motion.div 
          className="guest-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.h2
            animate={{ 
              textShadow: [
                "2px 2px 0 var(--accent-primary)",
                "4px 4px 0 var(--accent-secondary)",
                "2px 2px 0 var(--accent-primary)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}
          >
            🎂 {t.guests} ({guests.length})
          </motion.h2>
          <motion.button
            className={`edit-mode-btn ${editMode ? 'active' : ''}`}
            onClick={() => setEditMode(!editMode)}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            style={{ 
              padding: '0.5rem 1rem', 
              background: editMode ? 'var(--accent-success)' : 'var(--bg-card)',
              border: '3px solid var(--border-color)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'bold',
              minWidth: '48px',
              minHeight: '48px'
            }}
          >
            {editMode ? '✓ Done' : '✏️ Edit'}
          </motion.button>
        </motion.div>

        {!isRegistered && (
          <motion.form 
            className="guest-form" 
            onSubmit={handleJoin}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <motion.input
              type="text"
              placeholder={t.joinGuest}
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              className="guest-input"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button 
              type="submit" 
              className="guest-btn"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 {t.joinButton}
            </motion.button>
          </motion.form>
        )}

        <motion.div 
          className="guest-list"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence mode="popLayout">
            {guests.map((guest, index) => (
              <motion.div
                key={guest.id}
                className="guest-item"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02, 
                  x: 8,
                  boxShadow: "0 8px 32px rgba(255, 107, 157, 0.3)"
                }}
                layout
                exit="exit"
                style={{ cursor: 'pointer' }}
              >
                <motion.div 
                  className="guest-avatar"
                  style={{
                    fontSize: '2.5rem',
                    marginRight: '1rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                >
                  {getAvatarEmoji(guest.name)}
                </motion.div>
                
                <div className="guest-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <motion.div 
                    className="guest-name"
                    whileHover={{ scale: 1.05 }}
                    style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}
                  >
                    {guest.name}
                    {guest.name === userName && (
                      <motion.span 
                        className="guest-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        style={{ 
                          marginLeft: '0.5rem',
                          padding: '0.25rem 0.5rem',
                          background: 'var(--accent-success)',
                          color: 'var(--bg-primary)',
                          fontSize: '0.8rem',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}
                      >
                        You
                      </motion.span>
                    )}
                  </motion.div>
                  <motion.div 
                    className="guest-total"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      color: ['var(--accent-secondary)', 'var(--accent-primary)', 'var(--accent-secondary)']
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ fontSize: 'var(--font-size-base)', color: 'var(--accent-secondary)', fontWeight: 'bold' }}
                  >
                    ${(guestTotals[guest.id] || 0).toFixed(2)}
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {editMode && (
                    <motion.button
                      className="delete-guest-btn"
                      onClick={() => handleDeleteGuest(guest.id)}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.8 }}
                      style={{
                        padding: '0.5rem',
                        background: 'var(--accent-primary)',
                        color: 'var(--text-primary)',
                        border: '2px solid var(--accent-primary)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        minWidth: '40px',
                        minHeight: '40px'
                      }}
                    >
                      ✕
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {guests.length === 0 && (
            <motion.div 
              className="empty-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎈 No guests yet! Be the first to join! 🎈
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
