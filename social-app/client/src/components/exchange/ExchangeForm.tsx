import React, { useState } from 'react';
import type { ExchangeFormData } from '../../types/exchange';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ExchangeFormProps {
  verificationMethod: 'qr_code' | 'bluetooth' | 'email';
  prefilledEmail?: string;
  onSubmit: (data: ExchangeFormData) => void;
  onCancel: () => void;
}

const ExchangeForm: React.FC<ExchangeFormProps> = ({
  verificationMethod,
  prefilledEmail,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ExchangeFormData>({
    partnerEmail: prefilledEmail || '',
    whatIGave: '',
    whatIReceived: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ExchangeFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExchangeFormData, string>> = {};

    if (!formData.partnerEmail) {
      newErrors.partnerEmail = 'E-mail je povinný';
    } else if (!/\S+@\S+\.\S+/.test(formData.partnerEmail)) {
      newErrors.partnerEmail = 'Neplatný formát e-mailu';
    }

    if (!formData.whatIGave.trim()) {
      newErrors.whatIGave = 'Toto pole je povinné';
    }

    if (!formData.whatIReceived.trim()) {
      newErrors.whatIReceived = 'Toto pole je povinné';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ExchangeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getMethodIcon = () => {
    switch (verificationMethod) {
      case 'qr_code': return '📱';
      case 'bluetooth': return '📡';
      case 'email': return '✉️';
      default: return '🤝';
    }
  };

  const getMethodLabel = () => {
    switch (verificationMethod) {
      case 'qr_code': return 'QR Kód';
      case 'bluetooth': return 'Bluetooth';
      case 'email': return 'E-mail';
      default: return 'Neznáme';
    }
  };

  return (
    <div className="bg-charcoal-light border-2 border-vibrant-green rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-neon-green">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-2xl sm:text-3xl font-poppins font-bold text-transparent bg-gradient-to-r from-vibrant-green to-warm-yellow bg-clip-text mb-2">
          Blízkosť Overená!
        </h3>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-300 font-poppins">
          <span>{getMethodIcon()}</span>
          <span>Overené cez {getMethodLabel()}</span>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-electric-blue bg-opacity-10 border border-electric-blue rounded-lg p-4 mb-6">
        <p className="text-electric-blue font-poppins text-xs sm:text-sm text-center">
          ℹ️ Teraz zadaj detaily výmeny, aby si získal/a body za toto stretnutie
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Step 1: Partner Email */}
        <div className="bg-charcoal rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-warm-yellow font-poppins font-bold text-lg">1.</span>
            <h4 className="text-white font-poppins font-semibold text-sm sm:text-base">
              E-mail kolegu
            </h4>
          </div>
          <Input
            label=""
            type="email"
            value={formData.partnerEmail}
            onChange={(value) => handleChange('partnerEmail', value)}
            placeholder="kolega@email.com"
            required
            error={errors.partnerEmail}
            disabled={!!prefilledEmail}
          />
        </div>

        {/* Step 2: What I Gave */}
        <div className="bg-charcoal rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-warm-yellow font-poppins font-bold text-lg">2.</span>
            <h4 className="text-white font-poppins font-semibold text-sm sm:text-base">
              Čo som dal/a
            </h4>
          </div>
          <textarea
            value={formData.whatIGave}
            onChange={(e) => handleChange('whatIGave', e.target.value)}
            placeholder="Napr.: Pomohol som s programovaním, Zdieľal som kontakt, Dal som radu..."
            rows={3}
            className={`
              w-full bg-deep-charcoal border-2 rounded-lg px-4 py-3
              text-white font-poppins text-sm sm:text-base
              focus:outline-none transition-colors resize-none
              ${errors.whatIGave 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-electric-blue border-opacity-30 focus:border-vibrant-green'
              }
            `}
          />
          {errors.whatIGave && (
            <p className="text-red-400 font-poppins text-xs sm:text-sm mt-2 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.whatIGave}
            </p>
          )}
        </div>

        {/* Step 3: What I Received */}
        <div className="bg-charcoal rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-warm-yellow font-poppins font-bold text-lg">3.</span>
            <h4 className="text-white font-poppins font-semibold text-sm sm:text-base">
              Čo som dostal/a
            </h4>
          </div>
          <textarea
            value={formData.whatIReceived}
            onChange={(e) => handleChange('whatIReceived', e.target.value)}
            placeholder="Napr.: Dostal som radu, Získal som nový kontakt, Naučil som sa niečo nové..."
            rows={3}
            className={`
              w-full bg-deep-charcoal border-2 rounded-lg px-4 py-3
              text-white font-poppins text-sm sm:text-base
              focus:outline-none transition-colors resize-none
              ${errors.whatIReceived 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-electric-blue border-opacity-30 focus:border-vibrant-green'
              }
            `}
          />
          {errors.whatIReceived && (
            <p className="text-red-400 font-poppins text-xs sm:text-sm mt-2 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.whatIReceived}
            </p>
          )}
        </div>

        {/* Points Preview */}
        <div className="bg-gradient-to-r from-vibrant-green to-warm-yellow p-[2px] rounded-lg">
          <div className="bg-charcoal rounded-lg p-4 text-center">
            <p className="text-gray-300 font-poppins text-sm mb-2">
              Získaš za túto výmenu:
            </p>
            <div className="text-4xl font-poppins font-bold text-transparent bg-gradient-to-r from-vibrant-green to-warm-yellow bg-clip-text">
              +50 bodov
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="success"
            className="flex-1"
            glow
          >
            🎯 Submitnúť a získať body
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            Zrušiť
          </Button>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 pt-6 border-t border-electric-blue border-opacity-20">
        <p className="text-gray-400 font-poppins text-xs text-center">
          💡 Tip: Čím podrobnejšie popíšeš výmenu, tým lepšie pre tvoj profil a komunitu
        </p>
      </div>
    </div>
  );
};

export default ExchangeForm;
