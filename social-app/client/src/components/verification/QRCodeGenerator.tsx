import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { QRCodeData } from '../../types/verification';
import Button from '../ui/Button';

interface QRCodeGeneratorProps {
  userId: string;
  onScan: (scannedUserId: string) => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ userId, onScan }) => {
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  const generateQRCode = () => {
    const timestamp = Date.now();
    const expiresAt = timestamp + 5 * 60 * 1000; // 5 minutes
    const code = `MEET-${userId}-${timestamp}-${Math.random().toString(36).substring(7)}`;
    
    const newQRData: QRCodeData = {
      code,
      userId,
      timestamp,
      expiresAt,
      isValid: true,
    };
    
    setQrData(newQRData);
    setTimeLeft(300); // 5 minutes in seconds
  };

  useEffect(() => {
    if (!qrData) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((qrData.expiresAt - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        setQrData(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [qrData]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleScan = () => {
    if (scannedCode && onScan) {
      onScan(scannedCode);
      setScannedCode('');
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-transparent bg-gradient-to-r from-electric-blue to-vibrant-green bg-clip-text mb-2">
          📱 QR Kód Overenie
        </h3>
        <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base">
          Vygeneruj jednorazový QR kód alebo naskenuj kód druhej osoby
        </p>
      </div>

      {/* QR Code Display */}
      {qrData ? (
        <div className="bg-white dark:bg-charcoal-light border-2 border-electric-blue rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-neon-blue">
          <div className="flex flex-col items-center space-y-4">
            {/* QR Code with Screenshot Protection */}
            <div 
              className="bg-white p-6 rounded-xl relative select-none"
              style={{ 
                WebkitUserSelect: 'none',
                userSelect: 'none',
                WebkitTouchCallout: 'none',
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <QRCodeSVG
                value={qrData.code}
                size={256}
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#000000"
              />
              {/* Screenshot warning watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <span className="text-black font-bold text-xs rotate-[-30deg] whitespace-nowrap">
                  🔒 CHRÁNENÉ 🔒
                </span>
              </div>
            </div>
            
            {/* Screenshot protection notice */}
            <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg px-3 py-2 mt-2">
              <p className="text-red-400 font-poppins text-xs text-center">
                ⚠️ Screenshoty sú zakázané - kód je jednorazový
              </p>
            </div>

            {/* Timer */}
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-poppins font-bold text-light-magenta dark:text-warm-yellow mb-2">
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-400 text-xs sm:text-sm font-poppins">
                Kód vyprší o {formatTime(timeLeft)}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-charcoal rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-vibrant-green to-light-magenta dark:to-warm-yellow transition-all duration-1000"
                style={{ width: `${(timeLeft / 300) * 100}%` }}
              />
            </div>

            {/* Info */}
            <div className="bg-light-purple bg-opacity-10 dark:bg-electric-blue dark:bg-opacity-10 border border-light-purple dark:border-electric-blue rounded-lg p-4 w-full">
              <p className="text-light-purple dark:text-electric-blue font-poppins text-xs sm:text-sm text-center">
                ℹ️ Druhá osoba musí naskenovat tento kód do 5 minút
              </p>
            </div>

            <Button
              onClick={() => setQrData(null)}
              variant="outline"
              className="w-full"
            >
              Zrušiť kód
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={generateQRCode}
          variant="primary"
          className="w-full"
          glow
        >
          🎯 Vygenerovať QR Kód
        </Button>
      )}

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-electric-blue opacity-30" />
        <span className="text-gray-400 font-poppins text-sm">ALEBO</span>
        <div className="flex-1 h-px bg-electric-blue opacity-30" />
      </div>

      {/* Scanner */}
      {isScanning ? (
        <div className="bg-white dark:bg-charcoal-light border-2 border-vibrant-green rounded-xl sm:rounded-2xl p-6 shadow-neon-green">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-3">📷</div>
              <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm">
                Naskenuj QR kód druhej osoby
              </p>
            </div>

            {/* Mock Scanner Input */}
            <input
              type="text"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              placeholder="Zadaj alebo naskenuj kód..."
              className="w-full bg-charcoal border-2 border-vibrant-green rounded-lg px-4 py-3 text-white font-poppins focus:outline-none focus:border-light-magenta dark:border-warm-yellow transition-colors"
            />

            <div className="flex gap-3">
              <Button
                onClick={handleScan}
                variant="success"
                className="flex-1"
                disabled={!scannedCode}
              >
                ✅ Potvrdiť
              </Button>
              <Button
                onClick={() => {
                  setIsScanning(false);
                  setScannedCode('');
                }}
                variant="outline"
                className="flex-1"
              >
                Zrušiť
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsScanning(true)}
          variant="success"
          className="w-full"
        >
          📷 Naskenovať QR Kód
        </Button>
      )}
    </div>
  );
};

export default QRCodeGenerator;
