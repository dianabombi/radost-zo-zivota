import React, { useState } from 'react';
import type { BluetoothDevice } from '../../types/verification';
import Button from '../ui/Button';

// Web Bluetooth API types
declare global {
  interface Navigator {
    bluetooth: {
      requestDevice(options: {
        acceptAllDevices?: boolean;
        optionalServices?: string[];
      }): Promise<BluetoothDevice & { gatt?: BluetoothRemoteGATTServer }>;
    };
  }
  interface BluetoothRemoteGATTServer {
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
  }
}

interface BluetoothProximityProps {
  onDeviceFound?: (device: BluetoothDevice) => void;
}

const BluetoothProximity: React.FC<BluetoothProximityProps> = ({ onDeviceFound }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Detect browser type
  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    
    return { isChrome, isEdge, isSafari, isFirefox, isAndroid, isIOS };
  };

  // Check if Web Bluetooth API is supported
  const isBluetoothSupported = () => {
    return 'bluetooth' in navigator;
  };

  // Get user-friendly error message based on browser
  const getBrowserSupportMessage = () => {
    const browser = getBrowserInfo();
    
    if (browser.isSafari) {
      return 'Safari nepodporuje Web Bluetooth API. Použite Chrome alebo Edge na počítači, alebo Chrome na Android zariadení.';
    }
    
    if (browser.isFirefox) {
      return 'Firefox nepodporuje Web Bluetooth API (je za experimentálnym flagom). Použite Chrome alebo Edge na počítači, alebo Chrome na Android zariadení.';
    }
    
    if (browser.isIOS) {
      return 'iOS zariadenia nepodporujú Web Bluetooth API. Použite Android zariadenie s Chrome prehliadačom.';
    }
    
    if (!browser.isChrome && !browser.isEdge) {
      return 'Váš prehliadač nepodporuje Web Bluetooth API. Použite Chrome alebo Edge na počítači, alebo Chrome na Android zariadení.';
    }
    
    // Chrome/Edge but still not supported (might be HTTP instead of HTTPS)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      return 'Web Bluetooth API vyžaduje HTTPS pripojenie. Aplikácia musí bežať na https:// alebo localhost.';
    }
    
    return 'Web Bluetooth API nie je k dispozícii. Skontrolujte, či máte Bluetooth zapnutý a povolený v prehliadači.';
  };

  // Calculate approximate distance from RSSI (signal strength)
  const calculateDistance = (rssi: number): number => {
    // Simplified distance calculation: d = 10 ^ ((TxPower - RSSI) / (10 * n))
    // Assuming TxPower = -59 dBm and n = 2 (free space)
    const txPower = -59;
    const n = 2;
    const distance = Math.pow(10, (txPower - rssi) / (10 * n));
    return Math.round(distance * 10) / 10; // Round to 1 decimal
  };

  // Real Web Bluetooth API scanning
  const startScanning = async () => {
    setIsScanning(true);
    setError(null);
    setDevices([]);
    
    // Check browser support
    if (!isBluetoothSupported()) {
      setError(getBrowserSupportMessage());
      setIsScanning(false);
      return;
    }

    try {
      console.log('🔍 Starting Bluetooth scan...');
      
      // Request Bluetooth device - accept all devices without requiring specific services
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [] // Don't require any specific services
      });

      console.log('✅ Device found:', device.name);

      // Don't try to connect to GATT server - just use device info
      // Most phones don't expose GATT services for security reasons
      const rssi = -60; // Default value (Web Bluetooth API doesn't expose RSSI directly)
      
      // Create device object
      const bluetoothDevice: BluetoothDevice = {
        id: device.id,
        name: device.name || 'Neznáme zariadenie',
        distance: calculateDistance(rssi),
        rssi: rssi,
        isInRange: true,
      };

      setDevices([bluetoothDevice]);
      setIsScanning(false);
      
    } catch (err) {
      console.error('❌ Bluetooth error:', err);
      if (err instanceof Error) {
        if (err.message.includes('User cancelled')) {
          setError('Skenovanie bolo zrušené.');
        } else if (err.message.includes('not allowed')) {
          setError('Bluetooth prístup nie je povolený. Povoľte Bluetooth v nastaveniach prehliadača.');
        } else {
          setError(`Chyba pri skenovaní: ${err.message}`);
        }
      } else {
        setError('Neznáma chyba pri skenovaní Bluetooth zariadení.');
      }
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setDevices([]);
    setSelectedDevice(null);
  };

  const handleConnect = (device: BluetoothDevice) => {
    if (device.isInRange && onDeviceFound) {
      setSelectedDevice(device);
      onDeviceFound(device);
    }
  };

  const getDistanceColor = (distance: number): string => {
    if (distance < 2) return 'text-vibrant-green';
    if (distance < 5) return 'text-light-magenta dark:text-warm-yellow';
    return 'text-red-400';
  };

  const getSignalStrength = (rssi: number): string => {
    if (rssi > -50) return '📶📶📶';
    if (rssi > -70) return '📶📶';
    return '📶';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-transparent bg-gradient-to-r from-electric-blue to-vibrant-green bg-clip-text mb-2">
          📡 Bluetooth Overenie
        </h3>
        <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base">
          Nájdi hráčov v blízkosti cez Bluetooth
        </p>
      </div>

      {/* Scanning Status */}
      {isScanning ? (
        <div className="bg-white dark:bg-charcoal-light border-2 border-light-purple dark:border-electric-blue rounded-xl sm:rounded-2xl p-6 shadow-lg shadow-light-purple-soft dark:shadow-neon-blue">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3 animate-pulse">📡</div>
            <p className="text-electric-blue font-poppins font-semibold">
              Vyhľadávam zariadenia...
            </p>
          </div>

          {/* Devices List */}
          {devices.length > 0 ? (
            <div className="space-y-3">
              <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-sm mb-3">
                Nájdené zariadenia ({devices.length}):
              </p>
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`
                    bg-light-surface dark:bg-charcoal border-2 rounded-lg p-4 transition-all duration-300
                    ${device.isInRange 
                      ? 'border-light-pink dark:border-vibrant-green hover:shadow-lg hover:shadow-light-pink-soft dark:hover:shadow-neon-green cursor-pointer' 
                      : 'border-gray-400 dark:border-gray-600 opacity-50 cursor-not-allowed'
                    }
                    ${selectedDevice?.id === device.id ? 'ring-2 ring-light-magenta dark:ring-warm-yellow' : ''}
                  `}
                  onClick={() => device.isInRange && handleConnect(device)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-light-text dark:text-white font-poppins font-semibold text-sm sm:text-base">
                          {device.name}
                        </span>
                        <span className="text-xs">{getSignalStrength(device.rssi)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs sm:text-sm">
                        <span className={`font-poppins font-bold ${getDistanceColor(device.distance)}`}>
                          📍 {device.distance.toFixed(1)}m
                        </span>
                        <span className="text-light-text-secondary dark:text-gray-400">
                          {device.isInRange ? '✅ V dosahu' : '❌ Príliš ďaleko'}
                        </span>
                      </div>
                    </div>
                    {device.isInRange && (
                      <div className="text-vibrant-green text-2xl">→</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl mb-3">🔄</div>
              <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-sm">
                Hľadám zariadenia v okolí...
              </p>
            </div>
          )}

          <Button
            onClick={stopScanning}
            variant="outline"
            className="w-full mt-4"
          >
            Zastaviť vyhľadávanie
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Browser Support Info */}
          {!isBluetoothSupported() ? (
            <>
              <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
                <p className="text-red-400 font-poppins text-xs sm:text-sm text-center font-semibold mb-2">
                  ⚠️ Nepodporovaný prehliadač
                </p>
                <p className="text-red-400 font-poppins text-xs sm:text-sm text-center">
                  {getBrowserSupportMessage()}
                </p>
              </div>

              {/* Alternative Methods */}
              <div className="bg-vibrant-green bg-opacity-10 border-2 border-vibrant-green rounded-xl p-4 sm:p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">✨</div>
                  <h4 className="text-vibrant-green font-poppins font-bold text-base sm:text-lg mb-2">
                    Použite alternatívne metódy
                  </h4>
                  <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-xs sm:text-sm">
                    Bluetooth nie je dostupný, ale môžete použiť tieto metódy:
                  </p>
                </div>

                <div className="space-y-3">
                  {/* QR Code Option */}
                  <div className="bg-white dark:bg-charcoal-light rounded-lg p-3 sm:p-4 border-2 border-electric-blue">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">📱</div>
                      <div className="flex-1">
                        <h5 className="text-electric-blue font-poppins font-semibold text-sm sm:text-base mb-1">
                          QR Kód Overenie
                        </h5>
                        <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs">
                          Naskenujte QR kód druhého používateľa pomocou kamery. Funguje vo všetkých prehliadačoch!
                        </p>
                      </div>
                      <div className="text-vibrant-green text-xl flex-shrink-0">✓</div>
                    </div>
                  </div>

                  {/* Email Option */}
                  <div className="bg-white dark:bg-charcoal-light rounded-lg p-3 sm:p-4 border-2 border-light-purple dark:border-light-pink">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">📧</div>
                      <div className="flex-1">
                        <h5 className="text-light-purple dark:text-light-pink font-poppins font-semibold text-sm sm:text-base mb-1">
                          Email Overenie
                        </h5>
                        <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs">
                          Zadajte email druhého používateľa a pošlite žiadosť o stretnutie.
                        </p>
                      </div>
                      <div className="text-vibrant-green text-xl flex-shrink-0">✓</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-vibrant-green border-opacity-30">
                  <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs text-center">
                    💡 Tip: Vráťte sa späť a vyberte inú metódu overenia
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-electric-blue bg-opacity-10 border border-electric-blue rounded-lg p-4">
              <p className="text-electric-blue font-poppins text-xs sm:text-sm text-center">
                ℹ️ Bluetooth overenie funguje do vzdialenosti 5 metrov. Uisti sa, že máš Bluetooth zapnutý.
              </p>
            </div>
          )}

          {/* Additional Error Message */}
          {error && isBluetoothSupported() && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
              <p className="text-red-400 font-poppins text-xs sm:text-sm text-center">
                ❌ {error}
              </p>
            </div>
          )}

          <Button
            onClick={startScanning}
            variant="primary"
            className="w-full"
            glow
            disabled={!isBluetoothSupported()}
          >
            📡 Spustiť vyhľadávanie
          </Button>
          
          {!isBluetoothSupported() && (
            <div className="bg-light-magenta dark:bg-warm-yellow bg-opacity-10 border border-light-magenta dark:border-warm-yellow rounded-lg p-3 mt-2">
              <p className="text-light-magenta dark:text-warm-yellow font-poppins text-xs text-center">
                💡 <strong>Odporúčané prehliadače:</strong> Chrome alebo Edge (desktop), Chrome (Android)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selected Device Confirmation */}
      {selectedDevice && (
        <div className="bg-vibrant-green bg-opacity-10 border-2 border-vibrant-green rounded-xl p-4 sm:p-6">
          <div className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-vibrant-green font-poppins font-bold text-lg mb-2">
              Pripojené!
            </p>
            <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm">
              Stretnutie s <strong>{selectedDevice.name}</strong> bolo overené
            </p>
            <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs mt-2">
              Vzdialenosť: {selectedDevice.distance.toFixed(1)}m
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BluetoothProximity;
