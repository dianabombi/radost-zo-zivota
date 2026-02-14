import React, { useState } from 'react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface DemoModeProps {
  onInteraction: (points: number) => void;
}

const DemoMode: React.FC<DemoModeProps> = ({ onInteraction }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState<number | null>(null);

  // Cooldown period: 10 seconds between interactions
  const COOLDOWN_MS = 10000;

  const canInteract = () => {
    if (!lastInteractionTime) return true;
    return Date.now() - lastInteractionTime > COOLDOWN_MS;
  };

  const getRemainingCooldown = () => {
    if (!lastInteractionTime) return 0;
    const elapsed = Date.now() - lastInteractionTime;
    const remaining = Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));
    return remaining;
  };

  const handleDemoInteraction = async () => {
    if (!canInteract() || isProcessing) return;

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Award random points between 5-15
    const points = Math.floor(Math.random() * 11) + 5;
    
    setLastInteractionTime(Date.now());
    onInteraction(points);
    setIsProcessing(false);
  };

  const [cooldown, setCooldown] = useState(0);

  React.useEffect(() => {
    if (!lastInteractionTime) return;

    const interval = setInterval(() => {
      const remaining = getRemainingCooldown();
      setCooldown(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastInteractionTime]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-transparent bg-gradient-to-r from-light-magenta to-light-violet dark:from-warm-yellow dark:to-vibrant-green bg-clip-text mb-2">
          🎮 Demo Režim
        </h3>
        <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base">
          Testovací režim - získaj body bez overovania
        </p>
      </div>

      {/* Demo Mode Info */}
      <div className="bg-light-magenta dark:bg-warm-yellow bg-opacity-10 border-2 border-light-magenta dark:border-warm-yellow rounded-xl p-4 sm:p-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-3">🔧</div>
          <h4 className="text-light-magenta dark:text-warm-yellow font-poppins font-bold text-base sm:text-lg mb-2">
            Testovací Režim Aktívny
          </h4>
          <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-xs sm:text-sm">
            Tento režim je určený na testovanie aplikácie. Body sa prideľujú automaticky bez potreby overenia stretnutia.
          </p>
        </div>

        <div className="bg-white dark:bg-charcoal-light rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">👤</div>
            <div className="flex-1">
              <p className="text-light-text dark:text-white font-poppins font-semibold text-sm">
                {user?.nickname || 'Používateľ'}
              </p>
              <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs">
                Level {user?.level || 1} • {user?.points || 0} bodov
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-light-border dark:border-gray-600">
            <div className="flex items-start gap-2 text-xs text-light-text-secondary dark:text-gray-400">
              <span>ℹ️</span>
              <p className="font-poppins">
                Každá interakcia ti prinesie <strong className="text-vibrant-green">5-15 bodov</strong>. 
                Cooldown medzi interakciami: <strong>10 sekúnd</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interaction Button */}
      <div className="bg-white dark:bg-charcoal-light border-2 border-vibrant-green rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg shadow-light-green-soft dark:shadow-neon-green">
        <div className="text-center space-y-4">
          <div className="text-5xl sm:text-6xl mb-3 animate-bounce">
            🎯
          </div>
          
          {cooldown > 0 ? (
            <>
              <div className="text-3xl font-poppins font-bold text-light-magenta dark:text-warm-yellow">
                {cooldown}s
              </div>
              <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-sm">
                Počkaj {cooldown} sekúnd pred ďalšou interakciou
              </p>
              <Button
                onClick={handleDemoInteraction}
                variant="primary"
                className="w-full"
                disabled={true}
              >
                ⏳ Cooldown aktívny
              </Button>
            </>
          ) : (
            <>
              <p className="text-light-text dark:text-white font-poppins font-semibold text-base sm:text-lg">
                Pripravený na interakciu!
              </p>
              <Button
                onClick={handleDemoInteraction}
                variant="success"
                className="w-full"
                glow
                disabled={isProcessing}
              >
                {isProcessing ? '⏳ Spracovávam...' : '✨ Získať Body'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div className="flex-1">
            <p className="text-red-400 font-poppins text-xs sm:text-sm font-semibold mb-1">
              Dočasný Testovací Režim
            </p>
            <p className="text-red-400 font-poppins text-xs">
              Tento režim je aktívny len počas testovania. V produkčnej verzii budú body prideľované len po overení skutočného stretnutia.
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-light-surface dark:bg-charcoal rounded-xl p-4 sm:p-6 border border-light-border dark:border-gray-700">
        <h4 className="text-light-text dark:text-white font-poppins font-bold text-sm sm:text-base mb-3">
          📋 Ako to funguje:
        </h4>
        <ul className="space-y-2 text-light-text-secondary dark:text-gray-400 font-poppins text-xs sm:text-sm">
          <li className="flex items-start gap-2">
            <span className="text-vibrant-green">1.</span>
            <span>Klikni na tlačidlo "Získať Body"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-vibrant-green">2.</span>
            <span>Automaticky získaš 5-15 bodov</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-vibrant-green">3.</span>
            <span>Počkaj 10 sekúnd pred ďalšou interakciou</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-vibrant-green">4.</span>
            <span>Opakuj a sleduj svoj progres!</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DemoMode;
