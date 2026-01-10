import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    title: 'Mohammed & Ahmad BD',
    subtitle: '& Party Organizer',
    countdown: 'Countdown to Celebration',
    guests: 'Guests',
    addGuest: 'Join the Party!',
    joinGuest: 'Guest Name',
    joinButton: 'Join',
    editMode: 'Edit Mode',
    save: 'Save',
    cancel: 'Cancel',
    addCategory: 'Add Category',
    addItem: 'Add Item',
    delete: 'Delete',
    claim: 'Claim',
    unclaim: 'Unclaim',
    claimedBy: 'Claimed by',
    importData: 'Import Data',
    importPlaceholder: 'Paste JSON data here...',
    importButton: 'Import',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    noCategories: 'No categories yet. Add one!',
    noItems: 'No items yet. Add one!',
    edit: 'Edit',
    categoryName: 'Category Name',
    itemName: 'Item Name'
  },
  ar: {
    title: 'محمد وأحمد BD',
    subtitle: 'منظم التخييم والحفلة',
    countdown: 'العد التنازلي للاحتفال',
    guests: 'الضيوف',
    addGuest: 'انضم للحفلة!',
    joinGuest: 'اسم الضيف',
    joinButton: 'انضم',
    editMode: 'وضع التحرير',
    save: 'حفظ',
    cancel: 'إلغاء',
    addCategory: 'إضافة فئة',
    addItem: 'إضافة عنصر',
    delete: 'حذف',
    claim: 'حجز',
    unclaim: 'إلغاء الحجز',
    claimedBy: 'حجز بواسطة',
    importData: 'استيراد البيانات',
    importPlaceholder: 'الصق بيانات JSON هنا...',
    importButton: 'استيراد',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    days: 'أيام',
    hours: 'ساعات',
    minutes: 'دقائق',
    seconds: 'ثواني',
    noCategories: 'لا توجد فئات بعد. أضف واحدة!',
    noItems: 'لا توجد عناصر بعد. أضف واحداً!',
    edit: 'تعديل',
    categoryName: 'اسم الفئة',
    itemName: 'اسم العنصر'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDark);
  }, [isDark]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isDark, setIsDark, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}