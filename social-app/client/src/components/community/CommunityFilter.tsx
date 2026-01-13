import React from 'react';
import type { CommunitySubcategory } from '../../types/community';
import { COMMUNITY_CATEGORIES } from '../../types/community';

interface CommunityFilterProps {
  activeFilter: CommunitySubcategory;
  onFilterChange: (filter: CommunitySubcategory) => void;
}

const CommunityFilter: React.FC<CommunityFilterProps> = ({ activeFilter, onFilterChange }) => {
  const filters: CommunitySubcategory[] = ['all', 'schools', 'neighborhoods', 'parishes', 'sports_clubs', 'cultural_centers'];

  return (
    <div className="bg-white dark:bg-charcoal-light border-2 border-light-blue dark:border-electric-blue rounded-xl p-4 sm:p-6 mb-4">
      <h3 className="text-light-text dark:text-white font-poppins font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
        <span>🔍</span>
        <span>Filtrovať komunity</span>
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {filters.map((filter) => {
          const category = COMMUNITY_CATEGORIES[filter];
          const isActive = activeFilter === filter;
          
          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-lg
                font-poppins text-xs sm:text-sm font-semibold
                transition-all duration-300
                ${
                  isActive
                    ? 'bg-gradient-to-r from-electric-blue to-vibrant-green text-charcoal shadow-neon-blue'
                    : 'bg-charcoal text-gray-300 hover:text-white hover:bg-charcoal-light border border-electric-blue border-opacity-30'
                }
              `}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-center leading-tight">{category.name}</span>
            </button>
          );
        })}
      </div>

      {activeFilter !== 'all' && (
        <div className="mt-3 p-3 bg-charcoal rounded-lg border border-electric-blue border-opacity-20">
          <p className="text-gray-400 font-poppins text-xs sm:text-sm">
            {COMMUNITY_CATEGORIES[activeFilter].description}
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityFilter;
