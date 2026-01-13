import React from 'react';
import type { Exchange } from '../../types/exchange';

interface ExchangeHistoryProps {
  exchanges: Exchange[];
}

const ExchangeHistory: React.FC<ExchangeHistoryProps> = ({ exchanges }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMethodIcon = (method: string): string => {
    switch (method) {
      case 'qr_code': return '📱';
      case 'bluetooth': return '📡';
      case 'email': return '✉️';
      default: return '🤝';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'text-vibrant-green';
      case 'confirmed': return 'text-warm-yellow';
      case 'pending': return 'text-electric-blue';
      default: return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'completed': return 'Dokončené';
      case 'confirmed': return 'Potvrdené';
      case 'pending': return 'Čaká';
      default: return 'Neznáme';
    }
  };

  if (exchanges.length === 0) {
    return (
      <div className="bg-charcoal-light border-2 border-electric-blue rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
        <div className="text-5xl sm:text-6xl mb-4">📝</div>
        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-gray-300 mb-2">
          Zatiaľ žiadne výmeny
        </h3>
        <p className="text-gray-400 font-poppins text-sm sm:text-base">
          Stretni sa s ľuďmi, over blízkosť a zaznamenaj výmeny, aby sa tu zobrazili
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-white">
          📝 História výmen ({exchanges.length})
        </h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {exchanges.map((exchange) => (
          <div
            key={exchange.id}
            className="bg-charcoal-light border-2 border-electric-blue rounded-xl p-4 sm:p-5 hover:shadow-neon-blue transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-electric-blue to-vibrant-green flex items-center justify-center text-white font-poppins font-bold text-base sm:text-lg">
                  {exchange.partnerName?.charAt(0).toUpperCase() || exchange.partnerEmail.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-poppins font-bold text-white text-sm sm:text-base">
                    {exchange.partnerName || exchange.partnerEmail}
                  </h4>
                  <p className="text-gray-400 font-poppins text-xs">
                    {exchange.partnerEmail}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 bg-electric-blue bg-opacity-20 px-2 py-1 rounded-full">
                  <span className="text-sm">{getMethodIcon(exchange.verificationMethod)}</span>
                </div>
                <span className={`font-poppins text-xs font-semibold ${getStatusColor(exchange.status)}`}>
                  {getStatusLabel(exchange.status)}
                </span>
              </div>
            </div>

            {/* Exchange Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              {/* What I Gave */}
              <div className="bg-charcoal rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">📤</span>
                  <span className="text-vibrant-green font-poppins font-semibold text-xs sm:text-sm">
                    Čo som dal/a
                  </span>
                </div>
                <p className="text-gray-300 font-poppins text-xs sm:text-sm">
                  {exchange.whatIGave.description}
                </p>
              </div>

              {/* What I Received */}
              <div className="bg-charcoal rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">📥</span>
                  <span className="text-warm-yellow font-poppins font-semibold text-xs sm:text-sm">
                    Čo som dostal/a
                  </span>
                </div>
                <p className="text-gray-300 font-poppins text-xs sm:text-sm">
                  {exchange.whatIReceived.description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-electric-blue border-opacity-20">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 font-poppins">
                <span>🕐</span>
                <span>{formatDate(exchange.createdAt)}</span>
                {exchange.location?.city && (
                  <>
                    <span>•</span>
                    <span>📍 {exchange.location.city}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-vibrant-green font-poppins font-bold text-base sm:text-lg">
                  +{exchange.pointsEarned}
                </span>
                <span className="text-gray-400 font-poppins text-xs">bodov</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeHistory;
