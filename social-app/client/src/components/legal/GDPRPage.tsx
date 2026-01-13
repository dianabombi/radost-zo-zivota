import React from 'react';

interface GDPRPageProps {
  onBack: () => void;
}

const GDPRPage: React.FC<GDPRPageProps> = ({ onBack }) => {
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
          🇪🇺 GDPR
        </h1>
      </div>

      <div className="bg-white dark:bg-charcoal-light border-2 border-electric-blue rounded-2xl p-6 sm:p-8 shadow-lg">
        <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-sm mb-6">
          Posledná aktualizácia: 13. januára 2026
        </p>

        <div className="space-y-6 text-light-text dark:text-gray-200 font-poppins">
          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">1. Čo je GDPR?</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              GDPR (General Data Protection Regulation) je nariadenie Európskej únie o ochrane 
              osobných údajov, ktoré platí od 25. mája 2018. Zaručuje vám kontrolu nad vašimi 
              osobnými údajmi a stanovuje prísne pravidlá pre ich spracovanie.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">2. Právny základ spracovania</h2>
            <p className="text-sm sm:text-base leading-relaxed mb-2">
              Vaše údaje spracúvame na základe:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
              <li><strong>Súhlas:</strong> Pre marketingové účely a analytiku</li>
              <li><strong>Plnenie zmluvy:</strong> Pre poskytovanie služieb aplikácie</li>
              <li><strong>Oprávnený záujem:</strong> Pre zlepšovanie služieb a bezpečnosť</li>
              <li><strong>Zákonná povinnosť:</strong> Keď to vyžaduje zákon</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">3. Vaše práva podľa GDPR</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-charcoal rounded-xl p-4">
                <h3 className="font-semibold text-vibrant-green mb-1">📋 Právo na prístup</h3>
                <p className="text-sm">Môžete požiadať o kópiu všetkých údajov, ktoré o vás uchovávame.</p>
              </div>
              <div className="bg-gray-50 dark:bg-charcoal rounded-xl p-4">
                <h3 className="font-semibold text-vibrant-green mb-1">✏️ Právo na opravu</h3>
                <p className="text-sm">Môžete požiadať o opravu nepresných alebo neúplných údajov.</p>
              </div>
              <div className="bg-gray-50 dark:bg-charcoal rounded-xl p-4">
                <h3 className="font-semibold text-vibrant-green mb-1">🗑️ Právo na vymazanie</h3>
                <p className="text-sm">Môžete požiadať o vymazanie vašich údajov ("právo byť zabudnutý").</p>
              </div>
              <div className="bg-gray-50 dark:bg-charcoal rounded-xl p-4">
                <h3 className="font-semibold text-vibrant-green mb-1">⏸️ Právo na obmedzenie</h3>
                <p className="text-sm">Môžete požiadať o obmedzenie spracúvania vašich údajov.</p>
              </div>
              <div className="bg-gray-50 dark:bg-charcoal rounded-xl p-4">
                <h3 className="font-semibold text-vibrant-green mb-1">📦 Právo na prenositeľnosť</h3>
                <p className="text-sm">Môžete požiadať o prenos údajov k inému poskytovateľovi.</p>
              </div>
              <div className="bg-gray-50 dark:bg-charcoal rounded-xl p-4">
                <h3 className="font-semibold text-vibrant-green mb-1">🚫 Právo namietať</h3>
                <p className="text-sm">Môžete namietať proti spracúvaniu vašich údajov.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">4. Prevádzkovateľ údajov</h2>
            <div className="bg-gradient-to-r from-electric-blue to-vibrant-green p-[2px] rounded-xl">
              <div className="bg-white dark:bg-charcoal rounded-xl p-4">
                <p className="text-sm sm:text-base">
                  <strong>Wavelyne s.r.o.</strong><br />
                  Adresa: Bratislava, Slovensko<br />
                  E-mail: <a href="mailto:gdpr@wavelyne.com" className="text-electric-blue hover:underline">gdpr@wavelyne.com</a><br />
                  IČO: 12345678
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">5. Uchovávanie údajov</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Vaše údaje uchovávame len po dobu nevyhnutnú na splnenie účelu, pre ktorý boli 
              zhromaždené, alebo po dobu vyžadovanú zákonom. Po zrušení účtu budú vaše údaje 
              vymazané do 30 dní.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">6. Ako uplatniť svoje práva</h2>
            <p className="text-sm sm:text-base leading-relaxed mb-4">
              Pre uplatnenie akéhokoľvek práva nás kontaktujte na:
            </p>
            <a 
              href="mailto:gdpr@wavelyne.com"
              className="inline-block px-6 py-3 bg-gradient-to-r from-electric-blue to-vibrant-green text-white font-poppins font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              📧 gdpr@wavelyne.com
            </a>
            <p className="text-sm text-light-text-secondary dark:text-gray-400 mt-4">
              Na vašu žiadosť odpovieme do 30 dní.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-electric-blue mb-3">7. Sťažnosti</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Ak nie ste spokojní s tým, ako narábame s vašimi údajmi, máte právo podať sťažnosť 
              na Úrad na ochranu osobných údajov SR:{' '}
              <a href="https://dataprotection.gov.sk" className="text-vibrant-green hover:underline" target="_blank" rel="noopener noreferrer">
                dataprotection.gov.sk
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GDPRPage;
