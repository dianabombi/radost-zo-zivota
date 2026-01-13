import React, { useState } from 'react';
import type { BluetoothDevice } from '../../types/verification';
import Button from '../ui/Button';

interface BluetoothProximityProps {
  onDeviceFound?: (device: BluetoothDevice) => void;
}

const BluetoothProximity: React.FC<BluetoothProximityProps> = ({ onDeviceFound }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);

  // Mock Bluetooth scanning - In production, use Web Bluetooth API
  const startScanning = () => {
    setIsScanning(true);
    
    // Simulate finding devices
    setTimeout(() => {
      const mockDevices: BluetoothDevice[] = [
        {
          id: 'device-1',
          name: 'Hráč v blízkosti',
          distance: 1.2,
          rssi: -45,
          isInRange: true,
        },
        {
          id: 'device-2',
          name: 'Ďalší hráč',
          distance: 3.5,
          rssi: -65,
          isInRange: true,
        },
        {
          id: 'device-3',
          name: 'Vzdialený hráč',
          distance: 8.0,
          rssi: -85,
          isInRange: false,
        },
      ];
      setDevices(mockDevices);
    }, 2000);
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
    if (distance < 5) return 'text-warm-yellow';
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
                    ${selectedDevice?.id === device.id ? 'ring-2 ring-warm-yellow' : ''}
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
          <div className="bg-electric-blue bg-opacity-10 border border-electric-blue rounded-lg p-4">
            <p className="text-electric-blue font-poppins text-xs sm:text-sm text-center">
              ℹ️ Bluetooth overenie funguje do vzdialenosti 5 metrov. Uisti sa, že máš Bluetooth zapnutý.
            </p>
          </div>

          <Button
            onClick={startScanning}
            variant="primary"
            className="w-full"
            glow
          >
            📡 Spustiť vyhľadávanie
          </Button>
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
