import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'sk', label: 'Slovenčina', flag: '🇸🇰', short: 'SK' },
    { code: 'cs', label: 'Čeština', flag: '🇨🇿', short: 'CZ' },
    { code: 'en', label: 'English', flag: '🇬🇧', short: 'EN' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-electric-blue dark:to-vibrant-green text-white rounded-full font-poppins text-xs sm:text-sm font-semibold transition-all duration-300 shadow-lg hover:scale-105"
      >
        <span className="text-base">{currentLang.flag}</span>
        <span>{currentLang.short}</span>
        <span className="text-[10px] ml-1">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-charcoal-light border-2 border-electric-blue rounded-xl shadow-lg overflow-hidden z-50 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 font-poppins text-sm transition-colors ${
                i18n.language === lang.code
                  ? 'bg-electric-blue bg-opacity-20 text-electric-blue'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-charcoal'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
