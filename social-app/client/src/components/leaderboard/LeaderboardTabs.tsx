import React from 'react';
import type { LeaderboardType } from '../../types/leaderboard';
import type { UserProgression } from '../../types/progression';
import { COMPETITION_UNLOCKS } from '../../types/progression';

interface LeaderboardTabsProps {
  activeTab: LeaderboardType;
  onTabChange: (tab: LeaderboardType) => void;
  userProgression: UserProgression;
}

const tabs: { type: LeaderboardType; label: string; icon: string; requiresLicense?: boolean }[] = [
  { type: 'individual', label: 'Individuálne', icon: '👤' },
  { type: 'group', label: 'Skupiny', icon: '👥' },
  { type: 'community', label: 'Komunitná', icon: '🏘️', requiresLicense: true },
  { type: 'city', label: 'Mestská', icon: '🏙️', requiresLicense: true },
];

const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({ activeTab, onTabChange, userProgression }) => {
  const isTabUnlocked = (tabType: LeaderboardType): boolean => {
    return userProgression.unlockedCompetitions.includes(tabType);
  };

  const getRequiredInteractions = (tabType: LeaderboardType): number => {
    const competition = COMPETITION_UNLOCKS.find(c => c.type === tabType);
    return competition?.requiredInteractions || 0;
  };

  return (
    <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
      {tabs.map((tab) => {
        const isUnlocked = isTabUnlocked(tab.type);
        const requiredInteractions = getRequiredInteractions(tab.type);
        
        return (
          <button
            key={tab.type}
            onClick={() => onTabChange(tab.type)}
            disabled={!isUnlocked}
            className={`
              flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl
              font-poppins font-semibold text-xs sm:text-sm whitespace-nowrap
              transition-all duration-300 relative
              ${
                !isUnlocked
                  ? 'bg-charcoal border border-gray-600 text-gray-500 cursor-not-allowed opacity-60'
                  : activeTab === tab.type
                  ? 'bg-gradient-to-r from-electric-blue to-vibrant-green text-charcoal shadow-neon-blue'
                  : 'bg-charcoal-light text-gray-300 hover:text-white hover:bg-charcoal border border-electric-blue border-opacity-30'
              }
            `}
          >
            <span className="text-base sm:text-lg">
              {isUnlocked ? tab.icon : '🔒'}
            </span>
            <span>{tab.label}</span>
            {!isUnlocked && (
              <span className="absolute -top-1 -right-1 bg-light-magenta dark:bg-warm-yellow text-charcoal text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {requiredInteractions}
              </span>
            )}
            {tab.requiresLicense && isUnlocked && (
              <span className="absolute -top-1 -right-1 bg-vibrant-green text-charcoal text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                💰
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default LeaderboardTabs;
