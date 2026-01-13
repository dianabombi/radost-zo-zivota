import React, { useState } from 'react';
import { Button, Input } from '../ui';

interface EmailVerificationProps {
  currentUserEmail: string;
  onSendRequest?: (email: string) => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  currentUserEmail,
  onSendRequest,
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setEmailError('E-mail je povinný');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Neplatný formát e-mailu');
      return false;
    }
    if (email === currentUserEmail) {
      setEmailError('Nemôžeš poslať žiadosť sám sebe');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSendRequest = () => {
    if (!validateEmail()) return;

    if (onSendRequest) {
      onSendRequest(email);
    }
    
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setEmail('');
    }, 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-transparent bg-gradient-to-r from-electric-blue to-vibrant-green bg-clip-text mb-2">
          ✉️ E-mailové Overenie
        </h3>
        <p className="text-gray-300 font-poppins text-sm sm:text-base">
          Pošli žiadosť o potvrdenie stretnutia cez e-mail
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-light-blue bg-opacity-10 dark:bg-electric-blue dark:bg-opacity-10 border border-light-blue dark:border-electric-blue rounded-lg p-4">
        <p className="text-light-blue dark:text-electric-blue font-poppins text-xs sm:text-sm">
          ℹ️ Zadaj e-mail osoby, s ktorou si sa stretol/a. Dostane notifikáciu a bude môcť potvrdiť stretnutie vo svojom profile.
        </p>
      </div>

      {/* Request Sent Success */}
      {requestSent ? (
        <div className="bg-vibrant-green bg-opacity-10 border-2 border-vibrant-green rounded-xl p-6 sm:p-8">
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h4 className="text-vibrant-green font-poppins font-bold text-lg sm:text-xl mb-2">
              Žiadosť odoslaná!
            </h4>
            <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base">
              Používateľ <strong>{email}</strong> dostane notifikáciu a bude môcť potvrdiť stretnutie.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-charcoal-light border-2 border-electric-blue rounded-xl sm:rounded-2xl p-6 shadow-neon-blue">
          <div className="space-y-4">
            <Input
              label="E-mail osoby"
              type="email"
              value={email}
              onChange={(value) => {
                setEmail(value);
                setEmailError('');
              }}
              placeholder="osoba@email.com"
              required
              error={emailError}
            />

            <Button
              onClick={handleSendRequest}
              variant="primary"
              className="w-full"
              disabled={!email}
              glow
            >
              📧 Odoslať žiadosť o potvrdenie
            </Button>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-light-surface dark:bg-charcoal-light border border-light-pink dark:border-vibrant-green border-opacity-30 rounded-lg p-4">
        <h4 className="text-light-pink dark:text-vibrant-green font-poppins font-semibold text-sm sm:text-base mb-3">
          Ako to funguje:
        </h4>
        <ol className="space-y-2 text-light-text-secondary dark:text-gray-300 font-poppins text-xs sm:text-sm">
          <li className="flex gap-2">
            <span className="text-vibrant-green">1.</span>
            <span>Zadáš e-mail osoby, s ktorou si sa stretol/a</span>
          </li>
          <li className="flex gap-2">
            <span className="text-vibrant-green">2.</span>
            <span>Osoba dostane notifikáciu vo svojom profile</span>
          </li>
          <li className="flex gap-2">
            <span className="text-vibrant-green">3.</span>
            <span>Po potvrdení obaja získate body za stretnutie</span>
          </li>
          <li className="flex gap-2">
            <span className="text-vibrant-green">4.</span>
            <span>Stretnutie sa zaznamená do vašej histórie</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default EmailVerification;
