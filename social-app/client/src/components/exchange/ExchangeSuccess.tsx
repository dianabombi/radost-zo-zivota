import React from 'react';
import Button from '../ui/Button';

interface ExchangeSuccessProps {
  pointsEarned: number;
  partnerEmail: string;
  onClose: () => void;
  onViewHistory: () => void;
}

const ExchangeSuccess: React.FC<ExchangeSuccessProps> = ({
  pointsEarned,
  partnerEmail,
  onClose,
  onViewHistory,
}) => {
  return (
    <div className="bg-gradient-to-r from-vibrant-green to-light-magenta dark:to-warm-yellow p-[2px] rounded-xl sm:rounded-2xl">
      <div className="bg-charcoal rounded-xl sm:rounded-2xl p-6 sm:p-8">
        <div className="text-center space-y-6">
          {/* Success Animation */}
          <div className="relative">
            <div className="text-7xl sm:text-8xl animate-bounce">🎉</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-vibrant-green opacity-20 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Success Message */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-transparent bg-gradient-to-r from-vibrant-green to-light-magenta dark:to-warm-yellow bg-clip-text mb-2">
              Výmena Zaznamenaná!
            </h3>
            <p className="text-gray-300 font-poppins text-sm sm:text-base">
              Úspešne si zaznamenal/a výmenu s <strong className="text-white">{partnerEmail}</strong>
            </p>
          </div>

          {/* Points Earned */}
          <div className="bg-charcoal-light border-2 border-vibrant-green rounded-xl p-6">
            <p className="text-gray-300 font-poppins text-sm mb-2">
              Získané body:
            </p>
            <div className="text-5xl sm:text-6xl font-poppins font-bold text-transparent bg-gradient-to-r from-vibrant-green to-light-magenta dark:to-warm-yellow bg-clip-text">
              +{pointsEarned}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-charcoal-light rounded-lg p-3">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-vibrant-green font-poppins font-bold text-sm">
                Level Up
              </div>
            </div>
            <div className="bg-charcoal-light rounded-lg p-3">
              <div className="text-2xl mb-1">📈</div>
              <div className="text-electric-blue font-poppins font-bold text-sm">
                Rebríček
              </div>
            </div>
            <div className="bg-charcoal-light rounded-lg p-3">
              <div className="text-2xl mb-1">🤝</div>
              <div className="text-light-magenta dark:text-warm-yellow font-poppins font-bold text-sm">
                Spojenie
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={onViewHistory}
              variant="primary"
              className="w-full"
              glow
            >
              📝 Zobraziť históriu výmen
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              ✅ Hotovo
            </Button>
          </div>

          {/* Motivational Message */}
          <div className="pt-4 border-t border-electric-blue border-opacity-20">
            <p className="text-gray-400 font-poppins text-xs sm:text-sm">
              💪 Skvelá práca! Pokračuj v stretávaní ľudí a zbieraní bodov
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeSuccess;
