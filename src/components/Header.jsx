import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { useCountdown } from '../hooks/useCountdown';
import { Confetti } from './Confetti';

export default function Header() {
  const { language, setLanguage, isDark, setIsDark, t } = useLanguage();
  const { userName, logout } = useUser();
  const timeLeft = useCountdown();
  const [showConfetti, setShowConfetti] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const triggerConfetti = () => {
    setClickCount(prev => prev + 1);
    if (clickCount >= 2) {
      setShowConfetti(true);
      setClickCount(0);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const timeUnits = [
    { value: timeLeft.days, label: t.days },
    { value: timeLeft.hours, label: t.hours },
    { value: timeLeft.minutes, label: t.minutes },
    { value: timeLeft.seconds, label: t.seconds },
  ];

  return (
    <>
      {showConfetti && <Confetti />}
      <header className="header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="title" onClick={triggerConfetti}>
              🎉 {t.title} 🔥
            </h1>
            <p className="subtitle">{t.subtitle}</p>
          </div>

          <div className="controls">
            <button className="control-btn" onClick={toggleLanguage}>
              {language === 'en' ? '🇸🇦 عربي' : '🇬🇧 English'}
            </button>
            <button className="control-btn" onClick={logout}>
              🚪
            </button>
            <button className="control-btn" onClick={toggleTheme}>
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div className="countdown-container">
          <h2 className="countdown-label">{t.countdown}</h2>
          <div className="countdown">
            {timeUnits.map((unit, index) => (
              <div key={unit.label} className="time-unit">
                <span className="time-value">
                  {String(unit.value || 0).padStart(2, '0')}
                </span>
                <span className="time-label">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
