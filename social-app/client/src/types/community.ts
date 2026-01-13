export type CommunitySubcategory = 'schools' | 'neighborhoods' | 'parishes' | 'sports_clubs' | 'cultural_centers' | 'all';

export interface CommunityCategory {
  id: string;
  type: CommunitySubcategory;
  name: string;
  icon: string;
  description: string;
  memberCount: number;
}

export interface CommunityLicense {
  id: string;
  communityId: string;
  communityName: string;
  type: 'community' | 'city';
  status: 'active' | 'inactive' | 'pending';
  purchasedAt?: string;
  expiresAt?: string;
  price: number;
  features: string[];
}

export interface CommunityMembership {
  userId: string;
  communityId: string;
  communityName: string;
  category: CommunitySubcategory;
  role: 'member' | 'admin' | 'owner';
  joinedAt: string;
  canRepresent: boolean;
}

export const COMMUNITY_CATEGORIES: Record<CommunitySubcategory, { name: string; icon: string; description: string }> = {
  all: {
    name: 'Všetky komunity',
    icon: '🌐',
    description: 'Všetky typy komunít',
  },
  schools: {
    name: 'Školy',
    icon: '🎓',
    description: 'Základné, stredné a vysoké školy',
  },
  neighborhoods: {
    name: 'Sídliská',
    icon: '🏘️',
    description: 'Mestské časti a sídliská',
  },
  parishes: {
    name: 'Farnosti',
    icon: '⛪',
    description: 'Náboženské komunity a farnosti',
  },
  sports_clubs: {
    name: 'Športové kluby',
    icon: '⚽',
    description: 'Športové tímy a kluby',
  },
  cultural_centers: {
    name: 'Kultúrne centrá',
    icon: '🎭',
    description: 'Kultúrne a umelecké organizácie',
  },
};
