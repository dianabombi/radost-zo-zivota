import React from 'react';
import type { LeaderboardType } from '../../types/leaderboard';
import Button from '../ui/Button';

interface UnlockNotificationProps {
  competitionType: LeaderboardType;
  bonusPoints?: number;
  badge?: string;
  onClose: () => void;
  onViewLeaderboard: () => void;
}

const UnlockNotification: React.FC<UnlockNotificationProps> = ({
  competitionType,
  bonusPoints,
  badge,
  onClose,
  onViewLeaderboard,
}) => {
  const getCompetitionName = () => {
    switch (competitionType) {
      case 'community': return 'Komunitná Úroveň';
      case 'city': return 'Mestská Úroveň';
      default: return 'Nová Úroveň';
    }
  };

  const getCompetitionIcon = () => {
    switch (competitionType) {
      case 'community': return '🏘️';
      case 'city': return '🏙️';
      default: return '🏆';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-r from-light-magenta dark:from-warm-yellow to-vibrant-green p-[3px] rounded-2xl max-w-md w-full animate-pulse-slow">
        <div className="bg-charcoal rounded-2xl p-6 sm:p-8">
          <div className="text-center space-y-6">
            {/* Unlock Animation */}
            <div className="relative">
              <div className="text-7xl sm:text-8xl animate-bounce">
                {getCompetitionIcon()}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-light-magenta dark:bg-warm-yellow opacity-20 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Unlock Message */}
            <div>
              <div className="text-4xl sm:text-5xl mb-3">🔓</div>
              <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-transparent bg-gradient-to-r from-light-magenta dark:from-warm-yellow to-vibrant-green bg-clip-text mb-2">
                Nová Súťaž Odomknutá!
              </h3>
              <p className="text-white font-poppins text-lg sm:text-xl font-semibold mb-2">
                {getCompetitionName()}
              </p>
              <p className="text-gray-300 font-poppins text-sm sm:text-base">
                Gratulujem! Dosiahol si potrebný počet interakcií a odomkol si novú úroveň súťaže
              </p>
            </div>

            {/* Rewards */}
            <div className="bg-white dark:bg-charcoal-light border-2 border-light-blue dark:border-light-magenta dark:border-warm-yellow rounded-xl p-4">
              <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm mb-3">
                Odmeny za odomknutie:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {bonusPoints && (
                  <div className="bg-charcoal rounded-lg p-3">
                    <div className="text-2xl mb-1">💰</div>
                    <div className="text-vibrant-green font-poppins font-bold text-lg">
                      +{bonusPoints}
                    </div>
                    <div className="text-gray-400 font-poppins text-xs">bodov</div>
                  </div>
                )}
                {badge && (
                  <div className="bg-charcoal rounded-lg p-3">
                    <div className="text-2xl mb-1">{badge}</div>
                    <div className="text-light-magenta dark:text-warm-yellow font-poppins font-bold text-sm">
                      Nový odznak
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={onViewLeaderboard}
                variant="primary"
                className="w-full"
                glow
              >
                🏆 Zobraziť rebríček
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                ✅ Pokračovať
              </Button>
            </div>

            {/* Motivational Message */}
            <div className="pt-4 border-t border-light-magenta dark:border-warm-yellow border-opacity-20">
              <p className="text-gray-400 font-poppins text-xs sm:text-sm">
                🎯 Pokračuj v zbieraní interakcií a odomkni ďalšie súťaže!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockNotification;
