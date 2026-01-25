import React from 'react';
import Button from '../ui/Button';
import type { InteractionResult } from '../../services/interactionService';

interface InteractionSuccessProps {
  result: InteractionResult;
  onClose: () => void;
}

const InteractionSuccess: React.FC<InteractionSuccessProps> = ({ result, onClose }) => {
  return (
    <div className="bg-white dark:bg-charcoal-light border-2 border-vibrant-green rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-neon-green">
      <div className="text-center space-y-4 sm:space-y-6">
        {/* Success Icon */}
        <div className="text-6xl sm:text-7xl animate-bounce">
          ✅
        </div>

        {/* Title */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-transparent bg-gradient-to-r from-vibrant-green to-light-magenta dark:to-warm-yellow bg-clip-text mb-2">
            Interakcia úspešná!
          </h3>
          <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base">
            Tvoje stretnutie bolo overené
          </p>
        </div>

        {/* Points Earned */}
        <div className="bg-vibrant-green bg-opacity-10 border-2 border-vibrant-green rounded-xl p-6">
          <div className="text-5xl sm:text-6xl font-poppins font-black text-vibrant-green mb-2">
            +{result.pointsEarned}
          </div>
          <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm">
            {result.pointsEarned === 1 ? 'bod' : 'body'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-light-surface dark:bg-charcoal border-2 border-electric-blue rounded-lg p-4">
            <div className="text-2xl sm:text-3xl font-poppins font-bold text-electric-blue">
              {result.newTotalPoints}
            </div>
            <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs sm:text-sm">
              Celkové body
            </p>
          </div>
          <div className="bg-light-surface dark:bg-charcoal border-2 border-light-magenta dark:border-warm-yellow rounded-lg p-4">
            <div className="text-2xl sm:text-3xl font-poppins font-bold text-light-magenta dark:text-warm-yellow">
              {result.newLevel}
            </div>
            <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs sm:text-sm">
              Level
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-electric-blue bg-opacity-10 border border-electric-blue rounded-lg p-4">
          <p className="text-electric-blue font-poppins text-xs sm:text-sm">
            ℹ️ Individuálna interakcia úrovne 1 = 1 bod
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={onClose}
          variant="success"
          className="w-full"
          glow
        >
          Pokračovať
        </Button>

        <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs">
          Skóre tabuľka sa automaticky aktualizuje
        </p>
      </div>
    </div>
  );
};

export default InteractionSuccess;
