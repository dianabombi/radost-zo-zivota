export interface GroupMember {
  userId: string;
  userName: string;
  userEmail: string;
  role: 'leader' | 'member';
  joinedAt: string;
  isVerified: boolean;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: GroupMember[];
  createdBy: string;
  createdAt: string;
  totalPoints: number;
  totalInteractions: number;
  isActive: boolean;
}

export interface GroupVerification {
  groupId: string;
  verificationId: string;
  requiredMembers: number;
  verifiedMembers: string[];
  status: 'pending' | 'verified' | 'failed';
  verifiedAt?: string;
  proximityMethod: 'qr_code' | 'bluetooth' | 'email';
}

export interface GroupInteraction {
  id: string;
  groupId: string;
  participatingMembers: string[];
  targetType: 'individual' | 'group';
  targetId?: string;
  points: number;
  verificationMethod: 'qr_code' | 'bluetooth' | 'email';
  completedAt: string;
  exchangeDetails?: {
    whatGave: string;
    whatReceived: string;
  };
}
