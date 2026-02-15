import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../ui/Button';
import LanguageSwitcher from '../ui/LanguageSwitcher';

type ViewMode = 'home' | 'leaderboard' | 'verification' | 'game' | 'privacy' | 'gdpr' | 'cookies';

interface HeaderProps {
  title?: string;
  className?: string;
  viewMode?: ViewMode;
  onViewChange?: (view: ViewMode) => void;
}

const Header: React.FC<HeaderProps> = ({
  className = '',
  viewMode = 'home',
  onViewChange,
}) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { toggleTheme } = useTheme();

  return (
    <header className={`pt-2 pb-4 sm:pt-3 sm:pb-6 mb-6 sm:mb-8 ${className}`}>

      {/* Navigation Buttons */}
      {onViewChange && (
        <div className="flex justify-start gap-3 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => onViewChange('home')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-poppins font-semibold text-sm sm:text-base transition-all ${
              viewMode === 'home'
                ? 'bg-electric-blue text-white border-2 border-electric-blue shadow-neon-blue'
                : 'bg-transparent text-vibrant-green border-2 border-vibrant-green hover:bg-vibrant-green hover:bg-opacity-10'
            }`}
          >
            🏠 {t('nav.home')}
          </button>
          <button
            onClick={() => onViewChange('leaderboard')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-poppins font-semibold text-sm sm:text-base transition-all ${
              viewMode === 'leaderboard'
                ? 'bg-electric-blue text-white border-2 border-electric-blue shadow-neon-blue'
                : 'bg-transparent text-vibrant-green border-2 border-vibrant-green hover:bg-vibrant-green hover:bg-opacity-10'
            }`}
          >
            🏆 {t('nav.leaderboard')}
          </button>
          <button
            onClick={() => onViewChange(viewMode === 'verification' ? 'game' : 'verification')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-poppins font-semibold text-sm sm:text-base transition-all ${
              viewMode === 'verification' || viewMode === 'game'
                ? 'bg-electric-blue text-white border-2 border-electric-blue shadow-neon-blue'
                : 'bg-transparent text-vibrant-green border-2 border-vibrant-green hover:bg-vibrant-green hover:bg-opacity-10'
            }`}
          >
            {viewMode === 'game' ? '✅' : '🎮'} {viewMode === 'game' ? t('nav.verification') : t('nav.game')}
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
        {/* Title & Subtitle with Logo */}
        <div className="flex-1 order-1 lg:order-1 w-full lg:w-auto">
          <div className="flex flex-col items-start gap-2 sm:gap-3">
            {/* Logo on top */}
            <img 
              src="/logoRadost.png" 
              alt="Hra na radosť zo života logo" 
              className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain"
            />
            {/* Title below logo */}
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-poppins font-black text-transparent bg-gradient-to-r from-electric-blue via-vibrant-green to-light-magenta dark:to-warm-yellow bg-clip-text mb-1 sm:mb-2 leading-tight">
                Hra na radosť<br />zo života
              </h1>
              <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base md:text-lg opacity-90 tracking-wide mt-2">
                {t('app.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Welcome Message - Middle */}
        {user && (
          <div className="flex-shrink-0 order-2 w-full lg:w-auto text-center">
            <p className="font-poppins text-lg sm:text-xl md:text-2xl text-electric-blue dark:text-vibrant-green mb-2">
              Vitaj späť, <span className="font-bold text-light-magenta dark:text-warm-yellow">{user.nickname}</span>! 👋
            </p>
            <p className="font-poppins text-sm sm:text-base md:text-lg text-light-text-secondary dark:text-gray-300 opacity-80">
              Pripravený na ďalšie dobrodružstvo?
            </p>
          </div>
        )}

        {/* User Profile - Right */}
        {user && (
          <div className="flex-shrink-0 order-3 w-full lg:w-auto">
            <div className="bg-light-surface dark:bg-charcoal-light border-2 border-light-magenta dark:border-warm-yellow rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-light-magenta-soft dark:shadow-neon-yellow w-full lg:min-w-[280px]">
              {/* Language Switcher & Theme Toggle */}
              <div className="flex justify-end items-center gap-2 mb-3">
                <LanguageSwitcher />
                <button
                  onClick={toggleTheme}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 bg-electric-blue dark:bg-light-magenta dark:bg-warm-yellow text-white dark:text-deep-charcoal hover:bg-opacity-80 text-base shadow-lg"
                  aria-label="Toggle theme"
                >
                  <span className="hidden dark:inline">☀️</span>
                  <span className="inline dark:hidden">🌙</span>
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-electric-blue to-vibrant-green rounded-full flex items-center justify-center text-lg sm:text-xl font-bold text-white flex-shrink-0 ring-2 ring-light-magenta dark:ring-warm-yellow ring-offset-2 ring-offset-charcoal-light">
                  {user.nickname.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-poppins font-bold text-light-magenta dark:text-warm-yellow">
                    {user.nickname}
                  </h3>
                  <p className="font-poppins text-xs text-light-text-secondary dark:text-gray-300">
                    Level {user.level} • {user.points} bodov
                  </p>
                  {user.city && (
                    <p className="font-poppins text-xs opacity-75 text-light-text-secondary dark:text-gray-300">
                      📍 {user.city}, {user.region}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-light-bg dark:bg-deep-charcoal rounded-lg p-2">
                  <div className="text-electric-blue font-bold text-lg">{user.level}</div>
                  <div className="text-xs font-poppins text-light-text-secondary dark:text-gray-300">Úroveň</div>
                </div>
                <div className="bg-light-bg dark:bg-deep-charcoal rounded-lg p-2">
                  <div className="text-vibrant-green font-bold text-lg">{user.points}</div>
                  <div className="text-xs font-poppins text-light-text-secondary dark:text-gray-300">Body</div>
                </div>
                <div className="bg-light-bg dark:bg-deep-charcoal rounded-lg p-2">
                  <div className="text-light-magenta dark:text-warm-yellow font-bold text-lg">0</div>
                  <div className="text-xs font-poppins text-light-text-secondary dark:text-gray-300">Dní</div>
                </div>
              </div>

              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="w-full text-vibrant-green border-vibrant-green hover:bg-vibrant-green hover:text-charcoal text-xs"
              >
                🚪 Odhlásiť sa
              </Button>
            </div>
          </div>
        )}
        
      </div>
    </header>
  );
};

export default Header;
