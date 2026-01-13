import type { LeaderboardType } from './leaderboard';

export interface CompetitionUnlock {
  type: LeaderboardType;
  requiredInteractions: number;
  isUnlocked: boolean;
  isAlwaysUnlocked: boolean;
  icon: string;
  label: string;
  description: string;
}

export interface UserProgression {
  totalInteractions: number;
  currentLevel: number;
  unlockedCompetitions: LeaderboardType[];
  nextUnlock?: {
    type: LeaderboardType;
    requiredInteractions: number;
    remainingInteractions: number;
  };
}

export interface LevelMilestone {
  level: number;
  requiredInteractions: number;
  rewards: {
    unlocksCompetition?: LeaderboardType;
    bonusPoints?: number;
    badge?: string;
  };
  title: string;
  description: string;
}

export const COMPETITION_UNLOCKS: CompetitionUnlock[] = [
  {
    type: 'individual',
    requiredInteractions: 0,
    isUnlocked: true,
    isAlwaysUnlocked: true,
    icon: '👤',
    label: 'Individuálne',
    description: 'Vždy odomknuté - chodím sám a zoznamujem sa',
  },
  {
    type: 'group',
    requiredInteractions: 0,
    isUnlocked: true,
    isAlwaysUnlocked: true,
    icon: '👥',
    label: 'Skupiny',
    description: 'Vždy odomknuté - chodíme min. dvaja a zoznamujeme sa',
  },
  {
    type: 'community',
    requiredInteractions: 20,
    isUnlocked: false,
    isAlwaysUnlocked: false,
    icon: '🏘️',
    label: 'Komunitná',
    description: 'Odomkne sa po 20 interakciách - školy, sídliská, farnosti...',
  },
  {
    type: 'city',
    requiredInteractions: 40,
    isUnlocked: false,
    isAlwaysUnlocked: false,
    icon: '🏙️',
    label: 'Mestská',
    description: 'Odomkne sa po 40 interakciách - reprezentuj svoje mesto',
  },
];

export const LEVEL_MILESTONES: LevelMilestone[] = [
  {
    level: 1,
    requiredInteractions: 0,
    rewards: {},
    title: 'Začiatočník',
    description: 'Začínaš svoju cestu - individuálna a skupinová úroveň',
  },
  {
    level: 2,
    requiredInteractions: 20,
    rewards: {
      unlocksCompetition: 'community',
      bonusPoints: 100,
      badge: '🏘️',
    },
    title: 'Komunitný hráč',
    description: 'Odomkol si komunitnú úroveň - školy, sídliská, farnosti!',
  },
  {
    level: 3,
    requiredInteractions: 40,
    rewards: {
      unlocksCompetition: 'city',
      bonusPoints: 250,
      badge: '🏙️',
    },
    title: 'Mestský reprezentant',
    description: 'Odomkol si mestskú úroveň - reprezentuj svoje mesto!',
  },
];

export interface LicenseRequirement {
  type: 'community' | 'city';
  isRequired: boolean;
  hasLicense: boolean;
  price?: number;
}

export function calculateUserProgression(totalInteractions: number): UserProgression {
  const unlockedCompetitions: LeaderboardType[] = ['individual', 'group'];
  let currentLevel = 1;
  let nextUnlock: UserProgression['nextUnlock'] = undefined;

  // Determine unlocked competitions and current level
  for (const unlock of COMPETITION_UNLOCKS) {
    if (unlock.isAlwaysUnlocked || totalInteractions >= unlock.requiredInteractions) {
      if (!unlockedCompetitions.includes(unlock.type)) {
        unlockedCompetitions.push(unlock.type);
      }
    }
  }

  // Find current level
  for (const milestone of LEVEL_MILESTONES) {
    if (totalInteractions >= milestone.requiredInteractions) {
      currentLevel = milestone.level;
    }
  }

  // Find next unlock
  for (const unlock of COMPETITION_UNLOCKS) {
    if (!unlock.isAlwaysUnlocked && totalInteractions < unlock.requiredInteractions) {
      nextUnlock = {
        type: unlock.type,
        requiredInteractions: unlock.requiredInteractions,
        remainingInteractions: unlock.requiredInteractions - totalInteractions,
      };
      break;
    }
  }

  return {
    totalInteractions,
    currentLevel,
    unlockedCompetitions,
    nextUnlock,
  };
}
