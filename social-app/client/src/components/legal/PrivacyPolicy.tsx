import React from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
          🔒 Privacy Policy
        </h1>
      </div>

      <div className="bg-white dark:bg-charcoal-light border-2 border-electric-blue rounded-2xl p-6 sm:p-8 shadow-lg">
        <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-sm mb-6">
          Posledná aktualizácia: 13. januára 2026
        </p>

        <div className="space-y-6 text-light-text dark:text-gray-200 font-poppins">
          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">1. Úvod</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Vitajte v aplikácii "Hra na radosť zo života". Vaše súkromie je pre nás prioritou. 
              Tieto zásady ochrany osobných údajov vysvetľujú, ako zhromažďujeme, používame, 
              uchovávame a chránime vaše osobné údaje.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">2. Aké údaje zhromažďujeme</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
              <li><strong>Osobné údaje:</strong> meno, e-mailová adresa, prezývka</li>
              <li><strong>Údaje o polohe:</strong> mesto a región (voliteľné)</li>
              <li><strong>Údaje o používaní:</strong> interakcie, skóre, úroveň</li>
              <li><strong>Technické údaje:</strong> IP adresa, typ zariadenia, prehliadač</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">3. Ako používame vaše údaje</h2>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
              <li>Poskytovanie a zlepšovanie našich služieb</li>
              <li>Personalizácia vášho herného zážitku</li>
              <li>Komunikácia o aktualizáciách a novinkách</li>
              <li>Analýza a vylepšovanie aplikácie</li>
              <li>Zabezpečenie a prevencia podvodov</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">4. Zdieľanie údajov</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Vaše osobné údaje nezdieľame s tretími stranami okrem prípadov, keď:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base mt-2">
              <li>Ste nám dali výslovný súhlas</li>
              <li>Je to potrebné na poskytovanie služieb</li>
              <li>Vyžaduje to zákon alebo právny proces</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">5. Bezpečnosť údajov</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Používame štandardné bezpečnostné opatrenia na ochranu vašich údajov vrátane 
              šifrovania, bezpečných serverov a pravidelných bezpečnostných auditov.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">6. Vaše práva</h2>
            <p className="text-sm sm:text-base leading-relaxed mb-2">
              Máte právo:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
              <li>Pristupovať k svojim osobným údajom</li>
              <li>Opraviť nepresné údaje</li>
              <li>Vymazať svoje údaje ("právo byť zabudnutý")</li>
              <li>Namietať proti spracúvaniu údajov</li>
              <li>Preniesť svoje údaje k inému poskytovateľovi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">7. Prevádzkovateľ údajov</h2>
            <div className="bg-gradient-to-r from-electric-blue to-vibrant-green p-[2px] rounded-xl mb-4">
              <div className="bg-white dark:bg-charcoal rounded-xl p-4">
                <p className="text-sm sm:text-base leading-relaxed">
                  <strong>Wavelyne SINGLE MEMBER P.C.</strong><br />
                  Leof. Andrea Siggrou 196<br />
                  Kallithea 176 71, Athens<br />
                  VAT: EL802952696<br />
                  <br />
                  Tel: <a href="tel:+306906720388" className="text-electric-blue hover:underline">+30 690 672 0388</a><br />
                  E-mail: <a href="mailto:wavelynecomp@gmail.com" className="text-vibrant-green hover:underline">wavelynecomp@gmail.com</a><br />
                  Web: <a href="https://wavelynecode.com" className="text-electric-blue hover:underline" target="_blank" rel="noopener noreferrer">wavelynecode.com</a>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">8. Kontakt</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Ak máte otázky týkajúce sa týchto zásad, kontaktujte nás na:{' '}
              <a href="mailto:wavelynecomp@gmail.com" className="text-vibrant-green hover:underline">
                wavelynecomp@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
