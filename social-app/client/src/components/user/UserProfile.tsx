import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-charcoal-light border-2 border-light-magenta dark:border-warm-yellow rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-light-magenta-soft dark:shadow-neon-yellow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-4">
        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-electric-blue to-vibrant-green rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white flex-shrink-0">
            {user.nickname.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-poppins font-bold text-light-magenta dark:text-warm-yellow truncate">
              {user.nickname}
            </h3>
            <p className="text-gray-300 font-poppins text-xs sm:text-sm">
              Level {user.level} • {user.points} bodov
            </p>
            {user.city && (
              <p className="text-gray-300 font-poppins text-xs opacity-75 truncate">
                📍 {user.city}{user.region && `, ${user.region}`}
              </p>
            )}
          </div>
        </div>
        
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white w-full sm:w-auto text-xs sm:text-sm whitespace-nowrap"
        >
          🚪 Odhlásiť sa
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-center">
        <div className="bg-deep-charcoal rounded-lg sm:rounded-xl p-2 sm:p-3">
          <div className="text-electric-blue font-bold text-base sm:text-lg md:text-xl">{user.level}</div>
          <div className="text-gray-300 text-xs font-poppins">Úroveň</div>
        </div>
        <div className="bg-deep-charcoal rounded-lg sm:rounded-xl p-2 sm:p-3">
          <div className="text-vibrant-green font-bold text-base sm:text-lg md:text-xl">{user.points}</div>
          <div className="text-gray-300 text-xs font-poppins">Body</div>
        </div>
        <div className="bg-deep-charcoal rounded-lg sm:rounded-xl p-2 sm:p-3">
          <div className="text-light-magenta dark:text-warm-yellow font-bold text-base sm:text-lg md:text-xl">
            {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-gray-300 text-xs font-poppins">Dní</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
