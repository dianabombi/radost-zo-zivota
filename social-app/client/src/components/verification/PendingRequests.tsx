import React from 'react';
import { useTranslation } from 'react-i18next';
import type { MeetingRequest } from '../../types/verification';
import Button from '../ui/Button';

interface PendingRequestsProps {
  requests: MeetingRequest[];
  onConfirm: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const PendingRequests: React.FC<PendingRequestsProps> = ({
  requests,
  onConfirm,
  onReject,
}) => {
  const { t } = useTranslation();
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Práve teraz';
    if (diffMins < 60) return `Pred ${diffMins} min`;
    if (diffHours < 24) return `Pred ${diffHours} h`;
    if (diffDays < 7) return `Pred ${diffDays} dňami`;
    return date.toLocaleDateString('sk-SK');
  };

  const getMethodIcon = (method: string): string => {
    switch (method) {
      case 'qr_code': return '📱';
      case 'bluetooth': return '📡';
      case 'email': return '✉️';
      default: return '🤝';
    }
  };

  const getMethodLabel = (method: string): string => {
    switch (method) {
      case 'qr_code': return 'QR Kód';
      case 'bluetooth': return 'Bluetooth';
      case 'email': return 'E-mail';
      default: return 'Neznáme';
    }
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white dark:bg-charcoal-light border-2 border-light-purple dark:border-electric-blue rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
        <div className="text-5xl sm:text-6xl mb-4">📭</div>
        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-light-text dark:text-gray-300 mb-2">
          {t('verification.pending.empty')}
        </h3>
        <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-sm sm:text-base">
          {t('verification.pending.emptyDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-light-text dark:text-white">
          📬 {t('verification.pending.title')} ({requests.length})
        </h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white dark:bg-charcoal-light border-2 border-light-blue dark:border-light-magenta dark:border-warm-yellow rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-blue-100 dark:shadow-light-magenta-soft dark:shadow-neon-yellow hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-electric-blue to-vibrant-green flex items-center justify-center text-white font-poppins font-bold text-lg sm:text-xl">
                  {request.fromUserName.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-poppins font-bold text-light-text dark:text-white text-base sm:text-lg">
                      {request.fromUserName}
                    </h4>
                    <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs sm:text-sm">
                      {request.fromUserEmail}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-light-blue dark:bg-electric-blue bg-opacity-20 px-3 py-1 rounded-full">
                    <span className="text-base">{getMethodIcon(request.method)}</span>
                    <span className="text-light-blue dark:text-electric-blue font-poppins text-xs font-semibold">
                      {getMethodLabel(request.method)}
                    </span>
                  </div>
                </div>

                <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base mb-3">
                  {t('verification.pending.wantsToMeet')}
                </p>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-light-text-secondary dark:text-gray-400 font-poppins mb-4">
                  <span>🕐</span>
                  <span>{formatDate(request.requestedAt)}</span>
                  {request.metadata?.distance && (
                    <>
                      <span>•</span>
                      <span>📍 {request.metadata.distance.toFixed(1)}m</span>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => onConfirm(request.id)}
                    variant="success"
                    className="flex-1 text-sm sm:text-base"
                    glow
                  >
                    ✅ {t('verification.pending.confirm')}
                  </Button>
                  <Button
                    onClick={() => onReject(request.id)}
                    variant="outline"
                    className="flex-1 text-sm sm:text-base"
                  >
                    ❌ {t('verification.pending.reject')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequests;
