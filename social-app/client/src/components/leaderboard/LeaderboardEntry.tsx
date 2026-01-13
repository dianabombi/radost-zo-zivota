import React from 'react';
import type { LeaderboardEntry as LeaderboardEntryType } from '../../types/leaderboard';

interface LeaderboardEntryProps {
  entry: LeaderboardEntryType;
  isCurrentUser?: boolean;
}

const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({ entry, isCurrentUser }) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-warm-yellow';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-electric-blue';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div
      className={`bg-white dark:bg-charcoal-light border-2 ${
        isCurrentUser ? 'border-warm-yellow shadow-neon-yellow' : 'border-electric-blue'
      } rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:shadow-neon-blue transition-all duration-300 flex items-center gap-3 sm:gap-4`}
    >
      {/* Rank */}
      <div className={`flex-shrink-0 w-12 sm:w-16 text-center font-poppins font-bold text-base sm:text-lg ${getRankColor(entry.rank)}`}>
        {getRankIcon(entry.rank)}
      </div>

      {/* Avatar */}
      {entry.avatar ? (
        <img
          src={entry.avatar}
          alt={entry.name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-electric-blue"
        />
      ) : (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-electric-blue to-vibrant-green flex items-center justify-center text-white font-poppins font-bold text-sm sm:text-base">
          {entry.name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-poppins font-semibold text-sm sm:text-base text-white truncate">
            {entry.name}
            {isCurrentUser && <span className="text-vibrant-green ml-2">(Ty)</span>}
          </h4>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 font-poppins">
          <span>Level {entry.level}</span>
          {entry.city && <span>• {entry.city}</span>}
          {entry.memberCount !== undefined && <span>• {entry.memberCount} členov</span>}
        </div>
      </div>

      {/* Points */}
      <div className="flex-shrink-0 text-right">
        <h3 className="text-sm sm:text-base font-poppins font-bold text-light-text dark:text-white">
          {entry.points.toLocaleString()}
        </h3>
        <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs">bodov</p>
      </div>
    </div>
  );
};

export default LeaderboardEntry;
