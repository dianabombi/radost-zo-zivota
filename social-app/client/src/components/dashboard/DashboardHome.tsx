import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardHomeProps {
  onNavigate: (view: 'leaderboard' | 'verification' | 'game' | 'privacy' | 'gdpr') => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Mock data - replace with real data from API
  const stats = {
    totalInteractions: 25,
    currentLevel: 2,
    rank: 5,
    totalPlayers: 1247,
    pointsToNextLevel: 25,
  };

  const quickActions = [
    {
      id: 'leaderboard',
      icon: '🏆',
      title: 'Skóre Tabuľky',
      description: 'Porovnaj sa s ostatnými',
      gradient: 'from-electric-blue to-vibrant-green',
      action: () => onNavigate('leaderboard'),
    },
    {
      id: 'verification-game',
      icon: '🤝🎮',
      title: 'Overenie Blízkosti → Hra',
      description: 'Stretni sa s ľuďmi a zbieraj body',
      gradient: 'from-vibrant-green to-light-magenta dark:to-warm-yellow',
      action: () => onNavigate('verification'),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-8 -mx-1 sm:mx-0">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-electric-blue via-vibrant-green to-light-magenta dark:to-warm-yellow p-[2px] sm:p-[3px] rounded-xl sm:rounded-3xl">
        <div className="bg-white dark:bg-deep-charcoal rounded-xl sm:rounded-3xl p-4 sm:p-8 md:p-10 relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-electric-blue rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-vibrant-green rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-light-magenta dark:bg-warm-yellow rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative z-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {/* Level */}
              <div className="bg-white dark:bg-charcoal-light border-2 border-electric-blue rounded-xl p-4 hover:shadow-neon-blue transition-all duration-300 group">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                  ⭐
                </div>
                <div className="text-2xl sm:text-3xl font-poppins font-bold text-electric-blue">
                  {stats.currentLevel}
                </div>
                <div className="text-gray-400 font-poppins text-xs sm:text-sm">
                  Level
                </div>
              </div>

              {/* Interactions */}
              <div className="bg-white dark:bg-charcoal-light border-2 border-light-pink dark:border-vibrant-green rounded-xl p-4 hover:shadow-lg hover:shadow-light-pink-soft dark:hover:shadow-neon-green transition-all duration-300 group">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                  🤝
                </div>
                <div className="text-2xl sm:text-3xl font-poppins font-bold text-vibrant-green">
                  {stats.totalInteractions}
                </div>
                <div className="text-gray-400 font-poppins text-xs sm:text-sm">
                  Interakcií
                </div>
              </div>

              {/* Rank */}
              <div className="bg-white dark:bg-charcoal-light border-2 border-light-blue dark:border-light-magenta dark:border-warm-yellow rounded-xl p-4 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-light-magenta-soft dark:shadow-neon-yellow transition-all duration-300 group">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                  🏆
                </div>
                <div className="text-2xl sm:text-3xl font-poppins font-bold text-light-magenta dark:text-warm-yellow">
                  #{stats.rank}
                </div>
                <div className="text-gray-400 font-poppins text-xs sm:text-sm">
                  Poradie
                </div>
              </div>

              {/* Points */}
              <div className="bg-white dark:bg-charcoal-light border-2 border-electric-blue rounded-xl p-4 hover:shadow-neon-blue transition-all duration-300 group">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                  💎
                </div>
                <div className="text-2xl sm:text-3xl font-poppins font-bold text-electric-blue">
                  {user?.points || 0}
                </div>
                <div className="text-gray-400 font-poppins text-xs sm:text-sm">
                  Bodov
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl sm:text-2xl font-poppins font-bold text-light-text dark:text-white mb-4 flex items-center gap-2">
          <span>⚡</span>
          <span>{t('dashboard.quickActions.title')}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="group relative overflow-hidden bg-white dark:bg-charcoal-light border-2 border-electric-blue rounded-lg sm:rounded-2xl p-4 sm:p-8 hover:shadow-neon-blue transition-all duration-300 text-left"
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="text-5xl sm:text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-poppins font-bold text-light-text dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-sm sm:text-base mb-4">
                  {action.description}
                </p>
                <div className="flex items-center gap-2 text-electric-blue font-poppins font-semibold text-sm group-hover:text-vibrant-green transition-colors">
                  <span>{t('dashboard.progress.title')}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Progress to Next Level */}
      <div className="bg-white dark:bg-charcoal-light border-2 border-light-magenta dark:border-warm-yellow rounded-lg sm:rounded-2xl p-4 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-poppins font-bold text-light-text dark:text-white">
            🎯 Progres do ďalšieho levelu
          </h3>
          <span className="text-vibrant-green font-poppins font-bold text-sm sm:text-base">
            {stats.pointsToNextLevel} interakcií
          </span>
        </div>
        
        <div className="bg-light-bg dark:bg-deep-charcoal rounded-full h-4 sm:h-6 overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-vibrant-green to-light-magenta dark:to-warm-yellow transition-all duration-1000 relative overflow-hidden"
            style={{ width: '50%' }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>

        <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs sm:text-sm text-center">
          Pokračuj v zbieraní interakcií a odomkni nové súťaže! 💪
        </p>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-electric-blue to-vibrant-green p-[2px] rounded-xl">
        <div className="bg-white dark:bg-charcoal rounded-xl p-6 text-center">
          <p className="text-light-text dark:text-white font-poppins text-base sm:text-lg italic mb-2">
            "Každé stretnutie je príležitosť na rast"
          </p>
          <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs sm:text-sm">
            - Hra na radosť zo života
          </p>
        </div>
      </div>

      {/* Legal & Info Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-poppins font-bold text-light-text dark:text-white mb-4 flex items-center gap-2">
          <span>📋</span>
          <span>Právne informácie</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Privacy Policy Button */}
          <button
            onClick={() => onNavigate('privacy')}
            className="group relative overflow-hidden bg-white dark:bg-charcoal-light border-2 border-electric-blue rounded-lg sm:rounded-xl p-6 hover:shadow-neon-blue transition-all duration-300 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue to-vibrant-green opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                🔒
              </div>
              <h3 className="text-lg font-poppins font-bold text-light-text dark:text-white mb-2">
                Privacy Policy
              </h3>
              <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-sm mb-3">
                Zásady ochrany osobných údajov
              </p>
              <div className="flex items-center gap-2 text-electric-blue font-poppins font-semibold text-sm group-hover:text-vibrant-green transition-colors">
                <span>Zobraziť</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </button>

          {/* GDPR Button */}
          <button
            onClick={() => onNavigate('gdpr')}
            className="group relative overflow-hidden bg-white dark:bg-charcoal-light border-2 border-vibrant-green rounded-lg sm:rounded-xl p-6 hover:shadow-neon-green transition-all duration-300 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-vibrant-green to-light-magenta dark:to-warm-yellow opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                🇪🇺
              </div>
              <h3 className="text-lg font-poppins font-bold text-light-text dark:text-white mb-2">
                GDPR
              </h3>
              <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-sm mb-3">
                Vaše práva a ochrana údajov
              </p>
              <div className="flex items-center gap-2 text-vibrant-green font-poppins font-semibold text-sm group-hover:text-light-magenta dark:text-warm-yellow transition-colors">
                <span>Zobraziť</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
