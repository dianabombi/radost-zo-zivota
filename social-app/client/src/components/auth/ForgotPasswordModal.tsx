import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ForgotPasswordModalProps {
  onClose: () => void;
  onResetPassword: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  onClose,
  onResetPassword,
  isLoading,
  error,
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setEmailError('E-mail je povinný');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Neplatný formát e-mailu');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    try {
      await onResetPassword(email);
      setSuccess(true);
    } catch (error) {
      // Error is handled by parent
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-charcoal-light border-2 border-electric-blue rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-neon-blue max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl"
          aria-label="Zavrieť"
        >
          ×
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-transparent bg-gradient-to-r from-electric-blue to-vibrant-green bg-clip-text mb-2">
            Zabudnuté heslo
          </h2>
          <p className="text-gray-300 font-poppins text-sm sm:text-base">
            {success 
              ? 'Skontrolujte svoj e-mail' 
              : 'Zadajte svoj e-mail a pošleme vám link na obnovenie hesla'}
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-vibrant-green bg-opacity-10 border border-vibrant-green rounded-lg sm:rounded-xl p-4">
              <p className="text-vibrant-green font-poppins text-sm">
                ✅ E-mail s inštrukciami bol odoslaný na adresu <strong>{email}</strong>
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="primary"
              className="w-full text-sm sm:text-base"
            >
              Zavrieť
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(value) => {
                setEmail(value);
                setEmailError('');
              }}
              placeholder="tvoj@email.com"
              required
              error={emailError}
            />

            {error && (
              <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <p className="text-red-400 font-poppins text-xs sm:text-sm flex items-center">
                  <span className="mr-2">❌</span>
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                variant="primary"
                className="w-full text-sm sm:text-base"
                disabled={isLoading}
                glow
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⚡</span>
                    Odosielam...
                  </span>
                ) : (
                  '📧 Odoslať obnovovací link'
                )}
              </Button>

              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="w-full text-sm sm:text-base"
              >
                Zrušiť
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
