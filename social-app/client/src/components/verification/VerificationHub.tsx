import React, { useState } from 'react';
import type { MeetingRequest, Connection, VerificationMethod } from '../../types/verification';
import type { ExchangeFormData, Exchange } from '../../types/exchange';
import QRCodeGenerator from './QRCodeGenerator';
import BluetoothProximity from './BluetoothProximity';
import PendingRequests from './PendingRequests';
import ConnectionHistory from './ConnectionHistory';
import ExchangeForm from '../exchange/ExchangeForm';
import ExchangeSuccess from '../exchange/ExchangeSuccess';
import ExchangeHistory from '../exchange/ExchangeHistory';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

type ViewMode = 'methods' | 'pending' | 'history' | 'exchanges';
type FlowState = 'select_method' | 'verifying' | 'exchange_form' | 'success';

const VerificationHub: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('methods');
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);
  const [flowState, setFlowState] = useState<FlowState>('select_method');
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');
  const [lastExchange, setLastExchange] = useState<Exchange | null>(null);

  // Mock data - replace with real API calls later
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

  const handleConfirmRequest = (requestId: string) => {
    console.log('Confirming request:', requestId);
    // TODO: API call to confirm meeting
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    // TODO: API call to reject meeting
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

  const handleQRScan = (code: string) => {
    console.log('QR Code scanned:', code);
    // Simulate successful verification
    setVerifiedEmail('scanned.user@email.com');
    setFlowState('exchange_form');
  };

  const handleBluetoothConnect = (device: any) => {
    console.log('Bluetooth device connected:', device);
    // Simulate successful verification
    setVerifiedEmail('bluetooth.user@email.com');
    setFlowState('exchange_form');
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
          📬 Čakajúce ({mockPendingRequests.length})
          {mockPendingRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-warm-yellow rounded-full text-charcoal text-xs font-bold flex items-center justify-center">
              {mockPendingRequests.length}
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
        <div className="space-y-4 sm:space-y-6">
          {/* Method Selection */}
          {!selectedMethod ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* QR Code Method */}
              <button
                onClick={() => setSelectedMethod('qr_code')}
                className="bg-white dark:bg-charcoal-light border-2 border-light-purple dark:border-electric-blue rounded-xl p-4 sm:p-6 hover:shadow-lg hover:shadow-light-purple-soft dark:hover:shadow-neon-blue transition-all duration-300 group text-center"
              >
                <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform">
                  📱
                </div>
                <h3 className="text-base sm:text-lg font-poppins font-bold text-light-text dark:text-white mb-2">
                  QR Kód
                </h3>
                <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs sm:text-sm leading-tight">
                  Vygeneruj jednorazový kód alebo naskenuj kód druhej osoby
                </p>
              </button>

              {/* Bluetooth Method */}
              <button
                onClick={() => setSelectedMethod('bluetooth')}
                className="bg-white dark:bg-charcoal-light border-2 border-light-pink dark:border-vibrant-green rounded-xl p-4 sm:p-6 hover:shadow-lg hover:shadow-light-pink-soft dark:hover:shadow-neon-green transition-all duration-300 group text-center"
              >
                <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform">
                  📡
                </div>
                <h3 className="text-base sm:text-lg font-poppins font-bold text-light-text dark:text-white mb-2">
                  Bluetooth
                </h3>
                <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs sm:text-sm leading-tight">
                  Automatické overenie vzdialenosti do 5 metrov
                </p>
              </button>

            </div>
          ) : (
            <div className="bg-white dark:bg-charcoal-light border-2 border-light-purple dark:border-electric-blue rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg shadow-light-purple-soft dark:shadow-neon-blue">
              <Button
                onClick={() => setSelectedMethod(null)}
                variant="outline"
                className="mb-6 text-sm"
              >
                ← Späť na výber metódy
              </Button>

              {selectedMethod === 'qr_code' && user && (
                <QRCodeGenerator
                  userId={user.id}
                  onScan={handleQRScan}
                />
              )}

              {selectedMethod === 'bluetooth' && (
                <BluetoothProximity onDeviceFound={handleBluetoothConnect} />
              )}

            </div>
          )}
        </div>
      )}

      {viewMode === 'pending' && (
        <PendingRequests
          requests={mockPendingRequests}
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
