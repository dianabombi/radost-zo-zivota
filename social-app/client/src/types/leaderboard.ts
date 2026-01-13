export type LeaderboardType = 'individual' | 'group' | 'community' | 'city';

export type CommunitySubcategory = 'schools' | 'neighborhoods' | 'parishes' | 'sports_clubs' | 'cultural_centers' | 'all';

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  level: number;
  rank: number;
  avatar?: string;
  city?: string;
  region?: string;
  country?: string;
  memberCount?: number; // For groups
}

export interface UserRanking {
  rank: number;
  totalPlayers: number;
  points: number;
  percentile: number;
}

export interface GlobalProgress {
  currentPlayers: number;
  targetPlayers: number; // 4 billion (half of humanity ~8 billion)
  percentage: number;
  milestone: string;
}

export interface LeaderboardData {
  type: LeaderboardType;
  entries: LeaderboardEntry[];
  userRanking?: UserRanking;
  globalProgress?: GlobalProgress;
  lastUpdated: string;
  communityFilter?: CommunitySubcategory;
  requiresLicense?: boolean;
  licenseStatus?: 'active' | 'inactive' | 'pending';
}
