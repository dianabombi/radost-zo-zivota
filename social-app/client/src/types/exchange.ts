export interface ExchangeItem {
  description: string;
  category?: string;
}

export interface Exchange {
  id: string;
  userId: string;
  userName: string;
  partnerEmail: string;
  partnerName?: string;
  partnerId?: string;
  whatIGave: ExchangeItem;
  whatIReceived: ExchangeItem;
  pointsEarned: number;
  verificationMethod: 'qr_code' | 'bluetooth' | 'email';
  verifiedAt: string;
  createdAt: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
  status: 'pending' | 'confirmed' | 'completed';
}

export interface ExchangeFormData {
  partnerEmail: string;
  whatIGave: string;
  whatIReceived: string;
}

export interface ExchangeStats {
  totalExchanges: number;
  totalPointsEarned: number;
  exchangesToday: number;
  favoriteCategory?: string;
  topPartners: Array<{
    email: string;
    name: string;
    count: number;
  }>;
}
