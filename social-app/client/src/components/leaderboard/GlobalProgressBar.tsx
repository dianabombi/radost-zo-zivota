import React from 'react';
import type { GlobalProgress } from '../../types/leaderboard';

interface GlobalProgressBarProps {
  progress: GlobalProgress;
}

const GlobalProgressBar: React.FC<GlobalProgressBarProps> = ({ progress }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="bg-white dark:bg-charcoal-light border-2 border-light-pink dark:border-vibrant-green rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-light-pink-soft dark:shadow-neon-green">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg sm:text-xl font-poppins font-bold text-transparent bg-gradient-to-r from-vibrant-green to-warm-yellow bg-clip-text">
          🌍 Globálny Cieľ
        </h3>
        <span className="text-vibrant-green font-poppins font-bold text-sm sm:text-base">
          {progress.percentage.toFixed(4)}%
        </span>
      </div>

      <div className="mb-3">
        <div className="w-full bg-charcoal rounded-full h-4 sm:h-6 overflow-hidden border border-electric-blue">
          <div
            className="h-full bg-gradient-to-r from-vibrant-green to-warm-yellow transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${Math.min(progress.percentage, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs sm:text-sm font-poppins">
        <div>
          <span className="text-gray-400">Aktuálne: </span>
          <span className="text-vibrant-green font-bold">{formatNumber(progress.currentPlayers)}</span>
        </div>
        <div>
          <span className="text-gray-400">Cieľ: </span>
          <span className="text-warm-yellow font-bold">{formatNumber(progress.targetPlayers)}</span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-xs sm:text-sm">
          <span className="text-warm-yellow font-semibold">{progress.milestone}</span>
        </p>
      </div>
    </div>
  );
};

export default GlobalProgressBar;
