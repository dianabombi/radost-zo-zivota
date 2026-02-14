import React, { useState, useEffect } from 'react';
import type { MeetingRequest, Connection, VerificationMethod } from '../../types/verification';
import type { ExchangeFormData, Exchange } from '../../types/exchange';
import SimpleExchange from './SimpleExchange';
import PendingRequests from './PendingRequests';
import ConnectionHistory from './ConnectionHistory';
import ExchangeForm from '../exchange/ExchangeForm';
import ExchangeSuccess from '../exchange/ExchangeSuccess';
import ExchangeHistory from '../exchange/ExchangeHistory';
import InteractionSuccess from './InteractionSuccess';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { submitInteraction } from '../../services/interactionService';
import type { InteractionResult } from '../../services/interactionService';
import { 
  getPendingRequests, 
  confirmMeetingRequest, 
  rejectMeetingRequest,
  subscribeToPendingRequests 
} from '../../services/meetingRequestService';
import type { MeetingRequest as DBMeetingRequest } from '../../services/meetingRequestService';

type ViewMode = 'methods' | 'pending' | 'history' | 'exchanges';
type FlowState = 'select_method' | 'verifying' | 'exchange_form' | 'success';

const VerificationHub: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('methods');
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);
  const [flowState, setFlowState] = useState<FlowState>('select_method');
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');
  const [lastExchange, setLastExchange] = useState<Exchange | null>(null);
  const [interactionResult, setInteractionResult] = useState<InteractionResult | null>(null);
  const [pendingRequests, setPendingRequests] = useState<MeetingRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Fetch pending requests on mount and subscribe to real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const fetchRequests = async () => {
      setIsLoadingRequests(true);
      const requests = await getPendingRequests(user.id);
      
      // Convert DB format to component format
      const formattedRequests: MeetingRequest[] = requests.map((req: DBMeetingRequest) => ({
        id: req.id,
        fromUserId: req.from_user_id,
        fromUserName: req.from_user?.nickname || 'Unknown User',
        fromUserEmail: req.from_user?.email || '',
        toUserId: req.to_user_id,
        toUserName: user.nickname || '',
        toUserEmail: user.email,
        method: req.method,
        status: req.status,
        requestedAt: req.created_at,
        expiresAt: req.expires_at,
        metadata: req.metadata ? { distance: req.distance } : undefined,
      }));
      
      setPendingRequests(formattedRequests);
      setIsLoadingRequests(false);
    };

    fetchRequests();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToPendingRequests(user.id, (requests) => {
      const formattedRequests: MeetingRequest[] = requests.map((req: DBMeetingRequest) => ({
        id: req.id,
        fromUserId: req.from_user_id,
        fromUserName: req.from_user?.nickname || 'Unknown User',
        fromUserEmail: req.from_user?.email || '',
        toUserId: req.to_user_id,
        toUserName: user.nickname || '',
        toUserEmail: user.email,
        method: req.method,
        status: req.status,
        requestedAt: req.created_at,
        expiresAt: req.expires_at,
        metadata: req.metadata ? { distance: req.distance } : undefined,
      }));
      
      setPendingRequests(formattedRequests);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.id, user?.nickname, user?.email]);

  // Mock data for demo fallback
  const mockPendingRequests: MeetingRequest[] = [
    {
      id: 'req-1',
      fromUserId: 'user-123',
      fromUserName: 'Ján Novák',
      fromUserEmail: 'jan.novak@email.com',
      toUserId: user?.id || '',
      toUserName: user?.nickname || '',
      toUserEmail: user?.email || '',
      method: 'email',
      status: 'pending',
      requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'req-2',
      fromUserId: 'user-456',
      fromUserName: 'Mária Kováčová',
      fromUserEmail: 'maria.kovacova@email.com',
      toUserId: user?.id || '',
      toUserName: user?.nickname || '',
      toUserEmail: user?.email || '',
      method: 'qr_code',
      status: 'pending',
      requestedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000).toISOString(),
      metadata: {
        distance: 2.3,
      },
    },
  ];

  const mockConnections: Connection[] = [
    {
      id: 'conn-1',
      userId: 'user-789',
      userName: 'Peter Horváth',
      userEmail: 'peter.horvath@email.com',
      connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      method: 'qr_code',
      meetingCount: 3,
      lastMetAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      points: 150,
    },
    {
      id: 'conn-2',
      userId: 'user-101',
      userName: 'Eva Szabová',
      userEmail: 'eva.szabova@email.com',
      connectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      method: 'bluetooth',
      meetingCount: 1,
      lastMetAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      points: 50,
    },
  ];

  const handleConfirmRequest = async (requestId: string) => {
    console.log('Confirming request:', requestId);
    
    const result = await confirmMeetingRequest(requestId);
    
    if (result.success) {
      // Remove from pending list
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      
      // TODO: Create interaction record and award points
      console.log('Meeting request confirmed successfully');
    } else {
      console.error('Failed to confirm request:', result.error);
      alert(result.error || 'Nepodarilo sa potvrdiť žiadosť');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    console.log('Rejecting request:', requestId);
    
    const result = await rejectMeetingRequest(requestId);
    
    if (result.success) {
      // Remove from pending list
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      console.log('Meeting request rejected successfully');
    } else {
      console.error('Failed to reject request:', result.error);
      alert(result.error || 'Nepodarilo sa odmietnuť žiadosť');
    }
  };

  const mockExchanges: Exchange[] = [
    {
      id: 'ex-1',
      userId: user?.id || '',
      userName: user?.nickname || '',
      partnerEmail: 'jan.novak@email.com',
      partnerName: 'Ján Novák',
      whatIGave: { description: 'Pomohol som s programovaním React aplikácie' },
      whatIReceived: { description: 'Dostal som kontakt na dizajnéra' },
      pointsEarned: 50,
      verificationMethod: 'qr_code',
      verifiedAt: '2024-12-25T10:30:00Z',
      createdAt: '2024-12-25T10:35:00Z',
      status: 'completed',
    },
  ];

  const handleQRScan = async (code: string) => {
    console.log('QR Code scanned:', code);
    
    if (!user) return;
    
    // Validate and parse QR code format: MEET-{userId}-{timestamp}-{random}
    const qrParts = code.split('-');
    if (qrParts.length !== 4 || qrParts[0] !== 'MEET') {
      setInteractionResult({
        success: false,
        message: 'Neplatný QR kód. Skontrolujte formát kódu.',
        points: 0,
      });
      return;
    }
    
    const scannedUserId = qrParts[1];
    const timestamp = parseInt(qrParts[2]);
    const expiresAt = timestamp + 5 * 60 * 1000; // 5 minutes
    
    // Check if user is scanning their own code
    if (scannedUserId === user.id) {
      setInteractionResult({
        success: false,
        message: 'Nemôžete naskenovať svoj vlastný QR kód.',
        points: 0,
      });
      return;
    }
    
    // Check if code is expired
    if (Date.now() > expiresAt) {
      setInteractionResult({
        success: false,
        message: 'QR kód vypršal. Požiadajte o nový kód.',
        points: 0,
      });
      return;
    }
    
    // Submit individual interaction
    const result = await submitInteraction({
      userId: user.id,
      verificationMethod: 'qr_code',
      interactionType: 'individual',
      levelType: 'individual',
      metadata: {
        qrCode: code,
        scannedUserId: scannedUserId,
        timestamp: timestamp,
      },
    });
    setInteractionResult(result);
    
    if (result.success) {
      // Show success with points earned
      setVerifiedEmail(`user-${scannedUserId}@verified.com`);
      setFlowState('success');
      
      // Reload page to refresh user data
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleBluetoothConnect = async (device: any) => {
    console.log('Bluetooth device connected:', device);
    
    if (!user) return;
    
    // Submit individual interaction
    const result = await submitInteraction({
      userId: user.id,
      verificationMethod: 'bluetooth',
      interactionType: 'individual',
      levelType: 'individual',
      metadata: {
        distance: device.distance,
        deviceId: device.id,
      },
    });
    setInteractionResult(result);
    
    if (result.success) {
      // Show success with points earned
      setVerifiedEmail('bluetooth.user@email.com');
      setFlowState('success');
      
      // Reload page to refresh user data
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleSimpleExchange = async (data: { whatIGave: string; whatIGot: string }) => {
    console.log('Simple exchange:', data);
    
    if (!user) return;
    
    // Submit simple exchange - 1 point per interaction
    const result = await submitInteraction({
      userId: user.id,
      verificationMethod: 'simple_exchange' as any,
      interactionType: 'individual',
      levelType: 'individual',
      metadata: {
        whatIGave: data.whatIGave,
        whatIGot: data.whatIGot,
      } as any,
    });
    setInteractionResult(result);
    
    if (result.success) {
      // Show success with points earned
      setFlowState('success');
      
      // Reload page to refresh user data
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };


  const handleExchangeSubmit = (data: ExchangeFormData) => {
    console.log('Exchange submitted:', data);
    
    // Create exchange record
    const newExchange: Exchange = {
      id: `ex-${Date.now()}`,
      userId: user?.id || '',
      userName: user?.nickname || '',
      partnerEmail: data.partnerEmail,
      whatIGave: { description: data.whatIGave },
      whatIReceived: { description: data.whatIReceived },
      pointsEarned: 50,
      verificationMethod: selectedMethod || 'email',
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'completed',
    };
    
    setLastExchange(newExchange);
    setFlowState('success');
    
    // TODO: API call to save exchange and award points
  };

  const handleExchangeCancel = () => {
    setFlowState('select_method');
    setSelectedMethod(null);
    setVerifiedEmail('');
  };

  const handleSuccessClose = () => {
    setFlowState('select_method');
    setSelectedMethod(null);
    setVerifiedEmail('');
    setLastExchange(null);
  };

  const handleViewHistory = () => {
    setViewMode('exchanges');
    setFlowState('select_method');
    setSelectedMethod(null);
    setVerifiedEmail('');
    setLastExchange(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold text-transparent bg-gradient-to-r from-electric-blue to-vibrant-green bg-clip-text mb-2">
          🤝 Overenie Blízkosti
        </h2>
        <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base">
          Potvrď stretnutia s ľuďmi a získaj body
        </p>
      </div>

      {/* View Mode - Dropdown for Mobile, Tabs for Desktop */}
      {/* Mobile Dropdown */}
      <div className="sm:hidden">
        <select
          value={viewMode}
          onChange={(e) => {
            const value = e.target.value as ViewMode;
            setViewMode(value);
            if (value === 'methods') setSelectedMethod(null);
          }}
          className="w-full bg-charcoal-light border-2 border-electric-blue rounded-xl px-4 py-3 text-white font-poppins font-semibold text-sm focus:outline-none focus:border-vibrant-green transition-colors appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300D9FF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '20px',
          }}
        >
          <option value="methods">🎯 Nové Overenie</option>
          <option value="pending">📬 Čakajúce ({mockPendingRequests.length})</option>
          <option value="history">🤝 Spojenia ({mockConnections.length})</option>
          <option value="exchanges">📝 Výmeny ({mockExchanges.length})</option>
        </select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:flex gap-2 pb-2">
        <Button
          onClick={() => {
            setViewMode('methods');
            setSelectedMethod(null);
          }}
          variant={viewMode === 'methods' ? 'primary' : 'outline'}
          className="text-sm whitespace-nowrap"
          glow={viewMode === 'methods'}
        >
          🎯 Nové Overenie
        </Button>
        <Button
          onClick={() => setViewMode('pending')}
          variant={viewMode === 'pending' ? 'primary' : 'outline'}
          className="text-sm whitespace-nowrap relative"
          glow={viewMode === 'pending'}
        >
          📬 Čakajúce ({pendingRequests.length})
          {pendingRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-light-magenta dark:bg-warm-yellow rounded-full text-charcoal text-xs font-bold flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </Button>
        <Button
          onClick={() => setViewMode('history')}
          variant={viewMode === 'history' ? 'primary' : 'outline'}
          className="text-sm whitespace-nowrap"
          glow={viewMode === 'history'}
        >
          🤝 Spojenia ({mockConnections.length})
        </Button>
        <Button
          onClick={() => setViewMode('exchanges')}
          variant={viewMode === 'exchanges' ? 'primary' : 'outline'}
          className="text-sm whitespace-nowrap"
          glow={viewMode === 'exchanges'}
        >
          📝 Výmeny ({mockExchanges.length})
        </Button>
      </div>

      {/* Content */}
      {viewMode === 'methods' && flowState === 'success' && interactionResult && !lastExchange && (
        <InteractionSuccess
          result={interactionResult}
          onClose={handleSuccessClose}
        />
      )}

      {viewMode === 'methods' && flowState === 'success' && lastExchange && (
        <ExchangeSuccess
          pointsEarned={lastExchange.pointsEarned}
          partnerEmail={lastExchange.partnerEmail}
          onClose={handleSuccessClose}
          onViewHistory={handleViewHistory}
        />
      )}

      {viewMode === 'methods' && flowState === 'exchange_form' && selectedMethod && (
        <ExchangeForm
          verificationMethod={selectedMethod}
          prefilledEmail={verifiedEmail}
          onSubmit={handleExchangeSubmit}
          onCancel={handleExchangeCancel}
        />
      )}

      {viewMode === 'methods' && flowState === 'select_method' && (
        <SimpleExchange onSubmit={handleSimpleExchange} />
      )}

      {viewMode === 'pending' && (
        <PendingRequests
          requests={pendingRequests}
          onConfirm={handleConfirmRequest}
          onReject={handleRejectRequest}
        />
      )}

      {viewMode === 'history' && (
        <ConnectionHistory connections={mockConnections} />
      )}

      {viewMode === 'exchanges' && (
        <ExchangeHistory exchanges={mockExchanges} />
      )}
    </div>
  );
};

export default VerificationHub;
