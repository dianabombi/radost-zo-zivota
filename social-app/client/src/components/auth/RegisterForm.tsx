import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { COUNTRIES, getRegionsByCountry } from '../../data/regions';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { t } = useTranslation();
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    city: '',
    region: '',
    country: 'Slovakia',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
      errors.email = t('auth.validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('auth.validation.emailInvalid');
    }
    
    if (!formData.password) {
      errors.password = t('auth.validation.passwordRequired');
    } else if (formData.password.length < 6) {
      errors.password = t('auth.validation.passwordMinLength');
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = t('auth.validation.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('auth.validation.passwordsMismatch');
    }
    
    if (!formData.nickname) {
      errors.nickname = t('auth.validation.nicknameRequired');
    } else if (formData.nickname.length < 3) {
      errors.nickname = t('auth.validation.nicknameMinLength');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    try {
      await register(formData);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCountryChange = (value: string) => {
    setFormData(prev => ({ ...prev, country: value, region: '' }));
    if (formErrors.country) {
      setFormErrors(prev => ({ ...prev, country: '' }));
    }
  };

  const regionOptions = getRegionsByCountry(formData.country);

  return (
    <div className="bg-white dark:bg-charcoal-light border-2 border-light-pink dark:border-electric-blue rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg shadow-light-pink-soft dark:shadow-neon-blue">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-transparent bg-gradient-to-r from-electric-blue to-vibrant-green bg-clip-text mb-2">
          {t('auth.register')}
        </h2>
        <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base">
          {t('auth.registerSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <Input
            label={t('auth.email')}
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            placeholder="tvoj@email.com"
            required
            error={formErrors.email}
          />

          <Input
            label={t('auth.nickname')}
            value={formData.nickname}
            onChange={(value) => handleInputChange('nickname', value)}
            placeholder="TvojaNick"
            required
            error={formErrors.nickname}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="relative">
            <Input
              label={t('auth.password')}
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              placeholder="••••••••"
              required
              error={formErrors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <div className="relative">
            <Input
              label={t('auth.confirmPassword')}
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              placeholder="••••••••"
              required
              error={formErrors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <Select
            label={t('auth.country')}
            value={formData.country}
            onChange={handleCountryChange}
            options={COUNTRIES}
            placeholder="Vyber krajinu"
          />

          {regionOptions.length > 0 && (
            <Select
              label={t('auth.region')}
              value={formData.region}
              onChange={(value) => handleInputChange('region', value)}
              options={regionOptions}
              placeholder="Vyber kraj"
            />
          )}

          <Input
            label={t('auth.city')}
            value={formData.city}
            onChange={(value) => handleInputChange('city', value)}
            placeholder="Bratislava"
          />
        </div>

        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <p className="text-light-magenta dark:text-warm-yellow font-poppins text-xs sm:text-sm text-center">
              <strong>🔧 {t('auth.demoMode')}</strong>
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="success"
          className="w-full text-sm sm:text-base"
          disabled={isLoading}
          glow
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⚡</span>
              {t('auth.registerButton')}...
            </span>
          ) : (
            t('auth.registerButton')
          )}
        </Button>

        <div className="text-center">
          <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-xs sm:text-sm">
            {t('auth.hasAccount')}{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-electric-blue hover:text-light-magenta dark:text-warm-yellow transition-colors duration-300 font-semibold"
            >
              {t('auth.login')}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
