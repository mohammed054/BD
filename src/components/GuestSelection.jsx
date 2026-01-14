import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import './GuestSelection.css';

const PREDEFINED_GUESTS = [
  { id: 1, name: 'محمد مدثر' },
  { id: 2, name: 'احمد مدثر' },
  { id: 3, name: 'ورد علاء' },
  { id: 4, name: 'عمر طه' },
  { id: 5, name: 'احمد كنجو' },
  { id: 6, name: 'محمد عبدالحافظ' },
  { id: 7, name: 'عبدالله علي' }
];

export default function GuestSelection() {
  const { t } = useLanguage();
  const { register } = useUser();

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

  return (
    <div className="guest-selection">
      <div className="guest-selection-content">
        <h1 className="guest-selection-title">🎂 Who are you?</h1>
        <p className="guest-selection-subtitle">Select your guest to continue</p>

        <div className="guest-selection-list">
          {PREDEFINED_GUESTS.map((guest) => (
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
