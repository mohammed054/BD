import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCountdown } from '../hooks/useCountdown';
import { Confetti } from './Confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { language, setLanguage, isDark, setIsDark, t } = useLanguage();
  const timeLeft = useCountdown();
  const [showConfetti, setShowConfetti] = useState(false);
  const [titleClickCount, setTitleClickCount] = useState(0);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTitleClickCount(prev => prev + 1);
    
    if (titleClickCount >= 4) {
      setTitleClickCount(0);
    }
    
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const timeUnits = [
    { value: timeLeft.days, label: t.days },
    { value: timeLeft.hours, label: t.hours },
    { value: timeLeft.minutes, label: t.minutes },
    { value: timeLeft.seconds, label: t.seconds },
  ];

  const titleVariants = {
    hover: { scale: 1.05, rotate: -2 },
    tap: { scale: 0.95 },
  };

  const timeUnitVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  };

  const bounceVariants = {
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <header className="header">
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="title-section">
            <motion.h1 
              className="title" 
              onClick={triggerConfetti}
              variants={titleVariants}
              whileHover="hover"
              whileTap="tap"
              animate={showConfetti ? "bounce" : "normal"}
            >
              {titleClickCount >= 3 ? '🎂🎈🎉' : '🎉'} {t.title} {titleClickCount >= 3 ? '🎈🎂🎉' : '🔥'}
            </motion.h1>
            <motion.p 
              className="subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t.subtitle}
            </motion.p>
          </div>

          <motion.div 
            className="controls"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <motion.button 
              className="control-btn" 
              onClick={toggleLanguage}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {language === 'en' ? '🇸🇦 عربي' : '🇬🇧 English'}
            </motion.button>
            <motion.button 
              className="control-btn" 
              onClick={toggleTheme}
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9, rotate: -20 }}
            >
              {isDark ? '☀️' : '🌙'}
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="countdown-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.h2 
            className="countdown-label"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {t.countdown}
          </motion.h2>
          <div className="countdown">
            <AnimatePresence mode="popLayout">
              {timeUnits.map((unit, index) => (
                <motion.div
                  key={unit.label}
                  className="time-unit"
                  variants={timeUnitVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                  whileHover={{ scale: 1.1, rotate: [0, -2, 0] }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span 
                    className="time-value"
                    key={unit.value}
                    variants={bounceVariants}
                    animate={unit.value !== undefined ? "bounce" : "normal"}
                  >
                    {String(unit.value || 0).padStart(2, '0')}
                  </motion.span>
                  <span className="time-label">{unit.label}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </header>
    </>
  );
}
