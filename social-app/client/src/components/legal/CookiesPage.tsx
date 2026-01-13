import React from 'react';

interface CookiesPageProps {
  onBack: () => void;
}

const CookiesPage: React.FC<CookiesPageProps> = ({ onBack }) => {
  const handleManageCookies = () => {
    localStorage.removeItem('cookieConsent');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-gray-100 dark:bg-charcoal hover:bg-gray-200 dark:hover:bg-charcoal-light transition-colors"
        >
          <span className="text-xl">←</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-transparent bg-gradient-to-r from-electric-blue to-vibrant-green bg-clip-text">
          🍪 Cookies
        </h1>
      </div>

      <div className="bg-white dark:bg-charcoal-light border-2 border-electric-blue rounded-2xl p-6 sm:p-8 shadow-lg">
        <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-sm mb-6">
          Posledná aktualizácia: 13. januára 2026
        </p>

        <div className="space-y-6 text-light-text dark:text-gray-200 font-poppins">
          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">1. Čo sú cookies?</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Cookies sú malé textové súbory, ktoré sa ukladajú vo vašom zariadení pri návšteve 
              webových stránok. Pomáhajú nám zapamätať si vaše preferencie a zlepšiť váš zážitok.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">2. Typy cookies, ktoré používame</h2>
            <div className="space-y-4">
              <div className="border-2 border-vibrant-green rounded-xl p-4">
                <h3 className="font-semibold text-vibrant-green mb-2 flex items-center gap-2">
                  🔒 Nevyhnutné cookies
                  <span className="text-xs bg-vibrant-green text-white px-2 py-0.5 rounded-full">Vždy aktívne</span>
                </h3>
                <p className="text-sm">
                  Tieto cookies sú nevyhnutné pre fungovanie aplikácie. Bez nich by ste sa nemohli 
                  prihlásiť ani používať základné funkcie.
                </p>
                <ul className="list-disc list-inside text-xs mt-2 text-light-text-secondary dark:text-gray-400">
                  <li>Prihlásenie a autentifikácia</li>
                  <li>Jazykové nastavenia</li>
                  <li>Bezpečnostné tokeny</li>
                </ul>
              </div>

              <div className="border-2 border-electric-blue rounded-xl p-4">
                <h3 className="font-semibold text-electric-blue mb-2 flex items-center gap-2">
                  📊 Analytické cookies
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full">Voliteľné</span>
                </h3>
                <p className="text-sm">
                  Pomáhajú nám pochopiť, ako používatelia používajú aplikáciu, aby sme ju mohli zlepšovať.
                </p>
                <ul className="list-disc list-inside text-xs mt-2 text-light-text-secondary dark:text-gray-400">
                  <li>Návštevnosť stránok</li>
                  <li>Čas strávený v aplikácii</li>
                  <li>Používané funkcie</li>
                </ul>
              </div>

              <div className="border-2 border-warm-yellow rounded-xl p-4">
                <h3 className="font-semibold text-warm-yellow mb-2 flex items-center gap-2">
                  📢 Marketingové cookies
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full">Voliteľné</span>
                </h3>
                <p className="text-sm">
                  Používajú sa na personalizáciu obsahu a reklám na základe vašich záujmov.
                </p>
                <ul className="list-disc list-inside text-xs mt-2 text-light-text-secondary dark:text-gray-400">
                  <li>Personalizované odporúčania</li>
                  <li>Relevantné reklamy</li>
                  <li>Sociálne siete</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">3. Ako spravovať cookies</h2>
            <p className="text-sm sm:text-base leading-relaxed mb-4">
              Môžete kedykoľvek zmeniť svoje preferencie cookies kliknutím na tlačidlo nižšie, 
              alebo v nastaveniach vášho prehliadača.
            </p>
            <button
              onClick={handleManageCookies}
              className="px-6 py-3 bg-gradient-to-r from-electric-blue to-vibrant-green text-white font-poppins font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              ⚙️ Spravovať cookies
            </button>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">4. Cookies tretích strán</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Môžeme používať služby tretích strán, ktoré tiež používajú cookies:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm sm:text-base mt-2">
              <li>Google Analytics - analýza návštevnosti</li>
              <li>Firebase - autentifikácia a hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">5. Doba uchovávania</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-electric-blue">
                    <th className="text-left py-2 pr-4">Typ cookie</th>
                    <th className="text-left py-2">Doba uchovávania</th>
                  </tr>
                </thead>
                <tbody className="text-light-text-secondary dark:text-gray-400">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2 pr-4">Session cookies</td>
                    <td className="py-2">Do zatvorenia prehliadača</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2 pr-4">Autentifikačné</td>
                    <td className="py-2">30 dní</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2 pr-4">Analytické</td>
                    <td className="py-2">2 roky</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Preferencie</td>
                    <td className="py-2">1 rok</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">6. Kontakt</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Ak máte otázky ohľadom cookies, kontaktujte nás na:{' '}
              <a href="mailto:privacy@wavelyne.com" className="text-vibrant-green hover:underline">
                privacy@wavelyne.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
