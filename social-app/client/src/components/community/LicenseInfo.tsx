import React from 'react';
import Button from '../ui/Button';

interface LicenseInfoProps {
  type: 'community' | 'city';
  hasLicense: boolean;
  communityName?: string;
  cityName?: string;
  onPurchase?: () => void;
}

const LicenseInfo: React.FC<LicenseInfoProps> = ({ 
  type, 
  hasLicense, 
  communityName, 
  cityName,
  onPurchase 
}) => {
  const entityName = type === 'community' ? communityName : cityName;
  const icon = type === 'community' ? '🏘️' : '🏙️';
  const title = type === 'community' ? 'Komunitná licencia' : 'Mestská licencia';

  if (hasLicense) {
    return (
      <div className="bg-gradient-to-r from-vibrant-green to-warm-yellow p-[2px] rounded-xl mb-4">
        <div className="bg-charcoal rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl sm:text-4xl">{icon}</div>
            <div>
              <h3 className="text-white font-poppins font-bold text-base sm:text-lg">
                ✅ {title} aktívna
              </h3>
              <p className="text-gray-300 font-poppins text-xs sm:text-sm">
                {entityName}
              </p>
            </div>
          </div>
          <p className="text-gray-400 font-poppins text-xs sm:text-sm">
            Môžeš reprezentovať {type === 'community' ? 'svoju komunitu' : 'svoje mesto'} a zbierať body!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-charcoal-light border-2 border-light-blue dark:border-warm-yellow rounded-xl p-4 sm:p-6 mb-4">
      <div className="text-center space-y-4">
        <div className="text-5xl sm:text-6xl">🔒</div>
        <div>
          <h3 className="text-light-blue dark:text-warm-yellow font-poppins font-bold text-lg sm:text-xl mb-2">
            {title} potrebná
          </h3>
          <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base mb-4">
            {type === 'community' 
              ? 'Komunita musí mať aktívnu licenciu, aby mohli členovia súťažiť'
              : 'Mesto musí mať aktívnu licenciu, aby mohli obyvatelia súťažiť'
            }
          </p>
        </div>

        <div className="bg-charcoal rounded-lg p-4 border border-warm-yellow border-opacity-30">
          <p className="text-gray-400 font-poppins text-xs sm:text-sm mb-3">
            Výhody licencie:
          </p>
          <ul className="text-left space-y-2 text-gray-300 font-poppins text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <span className="text-vibrant-green">✓</span>
              <span>Vlastná tabuľka skóre</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vibrant-green">✓</span>
              <span>Štatistiky a analýzy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vibrant-green">✓</span>
              <span>Propagácia komunity/mesta</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vibrant-green">✓</span>
              <span>Motivácia členov k interakciám</span>
            </li>
          </ul>
        </div>

        {onPurchase && (
          <Button
            onClick={onPurchase}
            variant="primary"
            className="w-full"
            glow
          >
            💰 Kúpiť licenciu
          </Button>
        )}

        <p className="text-gray-500 font-poppins text-xs">
          Kontaktujte správcu {type === 'community' ? 'komunity' : 'mesta'} pre viac informácií
        </p>
      </div>
    </div>
  );
};

export default LicenseInfo;
