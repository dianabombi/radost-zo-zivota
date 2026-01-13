export type VerificationMethod = 'qr_code' | 'bluetooth' | 'email';
export type VerificationStatus = 'pending' | 'confirmed' | 'rejected' | 'expired';

export interface QRCodeData {
  code: string;
  userId: string;
  timestamp: number;
  expiresAt: number;
  isValid: boolean;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  distance: number; // in meters
  rssi: number; // signal strength
  isInRange: boolean;
}

export interface MeetingRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserEmail: string;
  toUserId: string;
  toUserName: string;
  toUserEmail: string;
  method: VerificationMethod;
  status: VerificationStatus;
  requestedAt: string;
  confirmedAt?: string;
  rejectedAt?: string;
  expiresAt: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  metadata?: {
    qrCode?: string;
    bluetoothDeviceId?: string;
    distance?: number;
  };
}

export interface Connection {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  connectedAt: string;
  method: VerificationMethod;
  meetingCount: number;
  lastMetAt: string;
  points: number; // Points earned from this connection
}

export interface VerificationStats {
  totalConnections: number;
  pendingRequests: number;
  confirmedToday: number;
  pointsEarned: number;
  favoriteMethod: VerificationMethod;
}
