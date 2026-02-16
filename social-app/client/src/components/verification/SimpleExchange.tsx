import React, { useState } from 'react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface SimpleExchangeProps {
  onSubmit: (data: { whatIGave: string; whatIGot: string; partnerEmail: string }) => void;
}

const SimpleExchange: React.FC<SimpleExchangeProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const [whatIGave, setWhatIGave] = useState('');
  const [whatIGot, setWhatIGot] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!whatIGave.trim() || !whatIGot.trim() || !partnerEmail.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit({
      whatIGave: whatIGave.trim(),
      whatIGot: whatIGot.trim(),
      partnerEmail: partnerEmail.trim(),
    });
    
    // Reset form
    setWhatIGave('');
    setWhatIGot('');
    setPartnerEmail('');
    setIsSubmitting(false);
  };

  const isFormValid = whatIGave.trim().length > 0 && whatIGot.trim().length > 0 && partnerEmail.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerEmail.trim());

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-transparent bg-gradient-to-r from-electric-blue to-vibrant-green bg-clip-text mb-2">
          🤝 Nové Zoznámenie
        </h3>
        <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base">
          Zadaj, čo si dal a čo si dostal pri stretnutí
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-vibrant-green bg-opacity-10 border-2 border-vibrant-green rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">✨</span>
          <div className="flex-1">
            <p className="text-vibrant-green font-poppins text-sm font-semibold mb-1">
              Za každé zoznámenie získaš 1 bod!
            </p>
            <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-xs">
              Vyplň oba polia a klikni na Submit. Body sa pripočítajú automaticky.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-charcoal-light border-2 border-electric-blue rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg shadow-light-blue-soft dark:shadow-neon-blue">
        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-light-surface dark:bg-charcoal rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-vibrant-green rounded-full flex items-center justify-center text-white font-bold">
                {user?.nickname?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-light-text dark:text-white font-poppins font-semibold text-sm">
                  {user?.nickname || 'Používateľ'}
                </p>
                <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs">
                  Level {user?.level || 1} • {user?.points || 0} bodov
                </p>
              </div>
            </div>
          </div>

          {/* What I Gave */}
          <div>
            <label className="block text-light-text dark:text-white font-poppins font-semibold text-sm mb-2">
              💝 Čo som dal
            </label>
            <input
              type="text"
              value={whatIGave}
              onChange={(e) => setWhatIGave(e.target.value)}
              placeholder="napr. kontakt, radu, pomoc..."
              className="w-full bg-light-surface dark:bg-charcoal border-2 border-light-border dark:border-gray-600 rounded-lg px-4 py-3 text-light-text dark:text-white font-poppins text-sm focus:outline-none focus:border-electric-blue dark:focus:border-vibrant-green transition-colors"
              disabled={isSubmitting}
              maxLength={100}
            />
            <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs mt-1">
              {whatIGave.length}/100 znakov
            </p>
          </div>

          {/* What I Got */}
          <div>
            <label className="block text-light-text dark:text-white font-poppins font-semibold text-sm mb-2">
              🎁 Čo som dostal
            </label>
            <input
              type="text"
              value={whatIGot}
              onChange={(e) => setWhatIGot(e.target.value)}
              placeholder="napr. kontakt, radu, pomoc..."
              className="w-full bg-light-surface dark:bg-charcoal border-2 border-light-border dark:border-gray-600 rounded-lg px-4 py-3 text-light-text dark:text-white font-poppins text-sm focus:outline-none focus:border-electric-blue dark:focus:border-vibrant-green transition-colors"
              disabled={isSubmitting}
              maxLength={100}
            />
            <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs mt-1">
              {whatIGot.length}/100 znakov
            </p>
          </div>

          {/* Partner Email */}
          <div>
            <label className="block text-light-text dark:text-white font-poppins font-semibold text-sm mb-2">
              📧 Email partnera
            </label>
            <input
              type="email"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              placeholder="partner@example.com"
              className="w-full bg-light-surface dark:bg-charcoal border-2 border-light-border dark:border-gray-600 rounded-lg px-4 py-3 text-light-text dark:text-white font-poppins text-sm focus:outline-none focus:border-electric-blue dark:focus:border-vibrant-green transition-colors"
              disabled={isSubmitting}
            />
            <p className="text-light-text-secondary dark:text-gray-400 font-poppins text-xs mt-1">
              Email osoby, s ktorou si sa stretol
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="success"
            className="w-full"
            glow
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? '⏳ Spracovávam...' : '✅ Submit - Získať 1 Bod'}
          </Button>
        </div>
      </form>

      {/* How it works */}
      <div className="bg-light-surface dark:bg-charcoal rounded-xl p-4 border border-light-border dark:border-gray-700">
        <h4 className="text-light-text dark:text-white font-poppins font-bold text-sm mb-3">
          📋 Ako to funguje:
        </h4>
        <ul className="space-y-2 text-light-text-secondary dark:text-gray-400 font-poppins text-xs sm:text-sm">
          <li className="flex items-start gap-2">
            <span className="text-vibrant-green">1.</span>
            <span>Zadaj, čo si dal druhej osobe (napr. kontakt, radu, pomoc)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-vibrant-green">2.</span>
            <span>Zadaj, čo si dostal od druhej osoby</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-vibrant-green">3.</span>
            <span>Klikni na Submit</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-vibrant-green">4.</span>
            <span>Získaš <strong>1 bod</strong> za každé zoznámenie!</span>
          </li>
        </ul>
      </div>

      {/* Tips */}
      <div className="bg-electric-blue bg-opacity-10 border border-electric-blue rounded-lg p-4">
        <div className="flex items-start gap-2">
          <span className="text-lg">💡</span>
          <div className="flex-1">
            <p className="text-electric-blue font-poppins text-xs sm:text-sm">
              <strong>Tip:</strong> Buď konkrétny! Namiesto "nič" napíš napr. "kontakt", "radu o práci", "pomoc s projektom" atď.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleExchange;
