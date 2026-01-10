import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCountdown } from '../hooks/useCountdown';
import { Confetti } from './Confetti';

export default function Header() {
  const { language, setLanguage, isDark, setIsDark, t } = useLanguage();
  const timeLeft = useCountdown();
  const [showConfetti, setShowConfetti] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

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
            <button className="control-btn" onClick={toggleTheme}>
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div className="countdown-container">
          <h2 className="countdown-label">{t.countdown}</h2>
          <div className="countdown">
            <div className="time-unit">
              <span className="time-value">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="time-label">{t.days}</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-unit">
              <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="time-label">{t.hours}</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-unit">
              <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="time-label">{t.minutes}</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-unit">
              <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="time-label">{t.seconds}</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}