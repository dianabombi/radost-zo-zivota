import React, { useState } from 'react';
import type { LeaderboardType, LeaderboardData } from '../../types/leaderboard';
import type { CommunitySubcategory } from '../../types/community';
import LeaderboardTabs from './LeaderboardTabs';
import LeaderboardEntry from './LeaderboardEntry';
import UserRankingCard from './UserRankingCard';
import ProgressionTracker from '../progression/ProgressionTracker';
import UnlockNotification from '../progression/UnlockNotification';
import CommunityFilter from '../community/CommunityFilter';
import LicenseInfo from '../community/LicenseInfo';
import { calculateUserProgression, COMPETITION_UNLOCKS } from '../../types/progression';
import { useAuth } from '../../contexts/AuthContext';

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<LeaderboardType>('individual');
  const [showUnlockNotification, setShowUnlockNotification] = useState(false);
  const [unlockedCompetition, setUnlockedCompetition] = useState<LeaderboardType | null>(null);
  const [communityFilter, setCommunityFilter] = useState<CommunitySubcategory>('all');

  // Mock total interactions - in production, get from user data or API
  const totalInteractions = 25; // Example: user has 25 interactions
  const userProgression = calculateUserProgression(totalInteractions);
  
  // Mock license status - in production, get from API
  const hasCommunityLicense = false;
  const hasCityLicense = false;

  // Mock data - replace with real API calls later
  const getMockLeaderboardData = (type: LeaderboardType): LeaderboardData => {
    const mockEntries = Array.from({ length: 10 }, (_, i) => ({
      id: `${type}-${i + 1}`,
      name: type === 'group' ? `Skupina ${i + 1}` : type === 'community' ? `Komunita ${i + 1}` : type === 'city' ? `Mesto ${i + 1}` : `Hráč ${i + 1}`,
      points: 10000 - i * 1000,
      level: 10 - i,
      rank: i + 1,
      avatar: undefined,
      city: type === 'city' ? `Mesto ${i + 1}` : undefined,
      region: undefined,
      memberCount: type === 'group' ? Math.floor(Math.random() * 50) + 10 : undefined,
    }));

    // Add current user to the list if individual
    if (type === 'individual' && user) {
      mockEntries.splice(4, 0, {
        id: user.id,
        name: user.nickname,
        points: user.points,
        level: user.level,
        rank: 5,
        avatar: undefined,
        city: user.city,
        region: undefined,
        memberCount: undefined,
      });
    }

    return {
      type,
      entries: mockEntries,
      userRanking: user ? {
        rank: 5,
        totalPlayers: 1247,
        points: user.points,
        percentile: 99.6,
      } : undefined,
      globalProgress: undefined,
      lastUpdated: new Date().toISOString(),
    };
  };

  const leaderboardData = getMockLeaderboardData(activeTab);

  const handleTabChange = (tab: LeaderboardType) => {
    const competition = COMPETITION_UNLOCKS.find(c => c.type === tab);
    if (competition && !competition.isAlwaysUnlocked && totalInteractions < competition.requiredInteractions) {
      // Tab is locked, don't switch
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Unlock Notification */}
      {showUnlockNotification && unlockedCompetition && (
        <UnlockNotification
          competitionType={unlockedCompetition}
          bonusPoints={100}
          badge="🏆"
          onClose={() => {
            setShowUnlockNotification(false);
            setUnlockedCompetition(null);
          }}
          onViewLeaderboard={() => {
            setShowUnlockNotification(false);
            setUnlockedCompetition(null);
            setActiveTab(unlockedCompetition);
          }}
        />
      )}
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold text-transparent bg-gradient-to-r from-electric-blue to-vibrant-green bg-clip-text mb-2">
          🏆 Skóre Tabuľky
        </h2>
        <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base">
          Porovnaj sa s ostatnými hráčmi na rôznych úrovniach
        </p>
      </div>

      {/* Progression Tracker */}
      <ProgressionTracker progression={userProgression} />

      {/* Tabs */}
      <LeaderboardTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        userProgression={userProgression}
      />

      {/* Community Filter */}
      {activeTab === 'community' && (
        <>
          <LicenseInfo
            type="community"
            hasLicense={hasCommunityLicense}
            communityName="Gymnázium Bratislava"
          />
          {hasCommunityLicense && (
            <CommunityFilter
              activeFilter={communityFilter}
              onFilterChange={setCommunityFilter}
            />
          )}
        </>
      )}

      {/* City License Info */}
      {activeTab === 'city' && (
        <LicenseInfo
          type="city"
          hasLicense={hasCityLicense}
          cityName="Bratislava"
        />
      )}

      {/* User Ranking Card */}
      {leaderboardData.userRanking && user && (
        <UserRankingCard ranking={leaderboardData.userRanking} userName={user.nickname} />
      )}

      {/* Leaderboard Entries */}
      <div className="bg-white dark:bg-charcoal-light border-2 border-light-purple dark:border-electric-blue rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg shadow-light-purple-soft dark:shadow-neon-blue">
        <h3 className="text-lg sm:text-xl font-poppins font-bold text-light-text dark:text-white mb-4">
          {activeTab === 'individual' && '👤 Top Hráči'}
          {activeTab === 'group' && '👥 Top Skupiny'}
          {activeTab === 'community' && '🏘️ Top Komunity'}
          {activeTab === 'city' && '🏙️ Top Mestá'}
        </h3>
        <span className="text-xs sm:text-sm text-gray-400 font-poppins">
          Aktualizované: práve teraz
        </span>
        <div className="space-y-2 sm:space-y-3">
          {leaderboardData.entries.map((entry) => (
            <LeaderboardEntry
              key={entry.id}
              entry={entry}
              isCurrentUser={user?.id === entry.id}
            />
          ))}
        </div>

        {leaderboardData.entries.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 font-poppins text-sm sm:text-base">
              Zatiaľ žiadne dáta k dispozícii
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
