import React from 'react';
import type { UserProgression } from '../../types/progression';
import { LEVEL_MILESTONES } from '../../types/progression';

interface ProgressionTrackerProps {
  progression: UserProgression;
}

const ProgressionTracker: React.FC<ProgressionTrackerProps> = ({ progression }) => {
  const currentMilestone = LEVEL_MILESTONES.find(m => m.level === progression.currentLevel);
  const nextMilestone = LEVEL_MILESTONES.find(m => m.level === progression.currentLevel + 1);

  const progressToNext = nextMilestone
    ? ((progression.totalInteractions - (currentMilestone?.requiredInteractions || 0)) /
        (nextMilestone.requiredInteractions - (currentMilestone?.requiredInteractions || 0))) * 100
    : 100;

  return (
    <div className="bg-white dark:bg-charcoal-light border-2 border-light-purple dark:border-electric-blue rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-light-purple-soft dark:shadow-neon-blue">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-poppins font-bold text-light-text dark:text-white">
            📊 Tvoj Progres
          </h3>
          <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs sm:text-sm">
            Level {progression.currentLevel} - {currentMilestone?.title}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-poppins font-bold text-vibrant-green">
            {progression.totalInteractions}
          </div>
          <div className="text-gray-400 font-poppins text-xs">interakcií</div>
        </div>
      </div>

      {/* Progress Bar */}
      {nextMilestone && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-light-text-secondary dark:text-gray-300 font-poppins text-xs sm:text-sm">
              Do ďalšieho levelu:
            </span>
            <span className="text-light-magenta dark:text-warm-yellow font-poppins text-xs sm:text-sm font-semibold">
              {nextMilestone.requiredInteractions - progression.totalInteractions} interakcií
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-charcoal rounded-full h-3 sm:h-4 overflow-hidden border border-electric-blue">
            <div
              className="h-full bg-gradient-to-r from-vibrant-green to-light-magenta dark:to-warm-yellow transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${Math.min(progressToNext, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Next Unlock */}
      {progression.nextUnlock && (
        <div className="bg-gray-100 dark:bg-charcoal rounded-lg p-3 sm:p-4 border border-light-magenta dark:border-warm-yellow border-opacity-30">
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl">🔒</div>
            <div className="flex-1">
              <h4 className="text-light-text dark:text-white font-poppins font-semibold text-sm sm:text-base mb-1">
                Ďalšie odomknutie
              </h4>
              <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-xs sm:text-sm">
                <strong className="text-light-magenta dark:text-warm-yellow">
                  {progression.nextUnlock.type === 'community' && 'Komunitná úroveň'}
                  {progression.nextUnlock.type === 'city' && 'Mestská úroveň'}
                </strong>
                {' '}za {progression.nextUnlock.remainingInteractions} interakcií
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Unlocked Competitions */}
      <div className="mt-4 pt-4 border-t border-electric-blue border-opacity-20">
        <p className="text-gray-400 font-poppins text-xs sm:text-sm mb-2">
          Odomknuté súťaže ({progression.unlockedCompetitions.length}/6):
        </p>
        <div className="flex flex-wrap gap-2">
          {progression.unlockedCompetitions.map((comp) => (
            <div
              key={comp}
              className="bg-vibrant-green bg-opacity-20 border border-vibrant-green rounded-full px-3 py-1 text-xs font-poppins text-vibrant-green font-semibold"
            >
              {comp === 'individual' && 'Individuálne'}
              {comp === 'group' && 'Skupiny'}
              {comp === 'community' && 'Komunity'}
              {comp === 'city' && 'Mestá'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressionTracker;
