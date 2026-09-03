import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTranslation, translations } from '../i18n/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const detectDefault = () => {
  const saved = localStorage.getItem('app-language');
  if (saved && translations[saved]) return saved;
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return translations[nav] ? nav : 'en';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(detectDefault);

  useEffect(() => {
    localStorage.setItem('app-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key, vars) => getTranslation(language, key, vars),
    [language]
  );

  const changeLanguage = (newLanguage) => setLanguage(newLanguage);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
