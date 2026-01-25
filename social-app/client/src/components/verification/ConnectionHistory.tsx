import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Connection } from '../../types/verification';

interface ConnectionHistoryProps {
  connections: Connection[];
}

const ConnectionHistory: React.FC<ConnectionHistoryProps> = ({ connections }) => {
  const { t } = useTranslation();
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  if (connections.length === 0) {
    return (
      <div className="bg-white dark:bg-charcoal-light border-2 border-light-purple dark:border-electric-blue rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
        <div className="text-5xl sm:text-6xl mb-4">🤝</div>
        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-light-text dark:text-gray-300 mb-2">
          {t('verification.history.empty')}
        </h3>
        <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-sm sm:text-base">
          {t('verification.history.emptyDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-light-text dark:text-white">
          🤝 {t('verification.history.title')} ({connections.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="bg-white dark:bg-charcoal-light border-2 border-light-pink dark:border-vibrant-green rounded-xl p-4 sm:p-5 shadow-lg shadow-pink-100 dark:shadow-neon-green hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start gap-3 mb-3">
              {/* Avatar */}
              {connection.userAvatar ? (
                <img
                  src={connection.userAvatar}
                  alt={connection.userName}
                  className="w-12 h-12 rounded-full border-2 border-vibrant-green"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-vibrant-green flex items-center justify-center text-white font-poppins font-bold text-lg">
                  {connection.userName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-poppins font-bold text-light-text dark:text-white text-sm sm:text-base truncate">
                  {connection.userName}
                </h4>
                <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs truncate">
                  {connection.userEmail}
                </p>
              </div>

              {/* Method Badge */}
              <div className="text-xl">{getMethodIcon(connection.method)}</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center bg-light-bg dark:bg-charcoal rounded-lg p-2">
                <div className="text-vibrant-green font-poppins font-bold text-base sm:text-lg">
                  {connection.meetingCount}
                </div>
                <div className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs">
                  {t('verification.history.meetings')}
                </div>
              </div>
              <div className="text-center bg-light-bg dark:bg-charcoal rounded-lg p-2">
                <div className="text-light-magenta dark:text-warm-yellow font-poppins font-bold text-base sm:text-lg">
                  {connection.points}
                </div>
                <div className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs">
                  {t('verification.history.points')}
                </div>
              </div>
              <div className="text-center bg-light-bg dark:bg-charcoal rounded-lg p-2">
                <div className="text-electric-blue font-poppins font-bold text-xs sm:text-sm">
                  {formatDate(connection.lastMetAt).split(' ')[0]}
                </div>
                <div className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs">
                  {t('verification.history.lastMet')}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-light-text-secondary dark:text-gray-400 font-poppins pt-2 border-t border-light-purple dark:border-electric-blue border-opacity-20">
              <span>{t('verification.history.firstMeeting')}:</span>
              <span>{formatDate(connection.connectedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionHistory;
