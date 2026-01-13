import React, { useState } from 'react';

const getInitialVisibility = () => {
  if (typeof window === 'undefined') return false;
  return !localStorage.getItem('cookieConsent');
};

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(getInitialVisibility);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl bg-white dark:bg-charcoal-light border-2 border-electric-blue rounded-2xl shadow-neon-blue overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-electric-blue to-vibrant-green p-4">
          <h2 className="text-xl sm:text-2xl font-poppins font-bold text-white flex items-center gap-2">
            🍪 Cookies
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          {!showSettings ? (
            <>
              <p className="text-light-text dark:text-gray-200 font-poppins text-sm sm:text-base mb-4">
                Používame cookies na zlepšenie vášho zážitku, analýzu návštevnosti a personalizáciu obsahu. 
                Kliknutím na "Prijať všetky" súhlasíte s používaním všetkých cookies.
              </p>
              <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs sm:text-sm mb-6">
                Viac informácií nájdete v našich{' '}
                <a href="/privacy" className="text-electric-blue hover:underline">Zásadách ochrany osobných údajov</a>
                {' '}a{' '}
                <a href="/gdpr" className="text-electric-blue hover:underline">GDPR</a>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-electric-blue to-vibrant-green text-white font-poppins font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                  ✅ Prijať všetky
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-charcoal text-light-text dark:text-white font-poppins font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-deep-charcoal transition-all"
                >
                  ⚙️ Nastavenia
                </button>
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-light-text dark:text-white font-poppins font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-charcoal transition-all"
                >
                  ❌ Odmietnuť
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-light-text dark:text-gray-200 font-poppins text-sm mb-4">
                Vyberte, ktoré cookies chcete povoliť:
              </p>

              <div className="space-y-4 mb-6">
                {/* Necessary */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-charcoal rounded-xl">
                  <div>
                    <h4 className="font-poppins font-semibold text-light-text dark:text-white text-sm">
                      🔒 Nevyhnutné
                    </h4>
                    <p className="text-light-text-secondary dark:text-gray-400 text-xs">
                      Potrebné pre fungovanie stránky
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-vibrant-green rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-charcoal rounded-xl">
                  <div>
                    <h4 className="font-poppins font-semibold text-light-text dark:text-white text-sm">
                      📊 Analytické
                    </h4>
                    <p className="text-light-text-secondary dark:text-gray-400 text-xs">
                      Pomáhajú nám pochopiť používanie stránky
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.analytics ? 'bg-vibrant-green justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-charcoal rounded-xl">
                  <div>
                    <h4 className="font-poppins font-semibold text-light-text dark:text-white text-sm">
                      📢 Marketingové
                    </h4>
                    <p className="text-light-text-secondary dark:text-gray-400 text-xs">
                      Používané na personalizáciu reklám
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.marketing ? 'bg-vibrant-green justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptSelected}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-electric-blue to-vibrant-green text-white font-poppins font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                  ✅ Uložiť nastavenia
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-light-text dark:text-white font-poppins font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-charcoal transition-all"
                >
                  ← Späť
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
