import React from 'react';
import type { UserRanking } from '../../types/leaderboard';

interface UserRankingCardProps {
  ranking: UserRanking;
  userName: string;
}

const UserRankingCard: React.FC<UserRankingCardProps> = ({ ranking }) => {
  return (
    <div className="bg-gradient-to-r from-electric-blue to-vibrant-green p-[2px] rounded-xl sm:rounded-2xl shadow-neon-blue">
      <div className="bg-white dark:bg-charcoal rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-poppins font-bold text-light-text dark:text-white">
            📊 Tvoje Umiestnenie
          </h3>
          <span className="text-2xl sm:text-3xl font-poppins font-bold text-transparent bg-gradient-to-r from-electric-blue to-vibrant-green bg-clip-text">
            #{ranking.rank}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-400 font-poppins mb-1">Poradie</div>
            <div className="text-lg sm:text-xl font-poppins font-bold text-electric-blue">
              {ranking.rank}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-400 font-poppins mb-1">Z celkovo</div>
            <div className="text-lg sm:text-xl font-poppins font-bold text-vibrant-green">
              {ranking.totalPlayers.toLocaleString()}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-400 font-poppins mb-1">Percentil</div>
            <div className="text-lg sm:text-xl font-poppins font-bold text-warm-yellow">
              {ranking.percentile.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-electric-blue border-opacity-30">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-light-text-secondary dark:text-gray-300 font-poppins">Tvoje body:</span>
            <span className="text-xl sm:text-2xl font-poppins font-bold text-vibrant-green">
              {ranking.points.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRankingCard;
