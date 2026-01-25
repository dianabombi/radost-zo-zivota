import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ForgotPasswordModal from './ForgotPasswordModal';
import { isSupabaseConfigured } from '../../lib/supabase';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { t } = useTranslation();
  const { login, isLoading, error, clearError, resetPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
      errors.email = 'E-mail je povinný';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Neplatný formát e-mailu';
    }
    
    if (!formData.password) {
      errors.password = 'Heslo je povinné';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    try {
      await login(formData);
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

  return (
    <div className="bg-white dark:bg-charcoal-light border-2 border-light-purple dark:border-electric-blue rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg shadow-light-purple-soft dark:shadow-neon-blue">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-transparent bg-gradient-to-r from-electric-blue to-vibrant-green bg-clip-text mb-2">
          {t('auth.loginTitle')}
        </h2>
        <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {!isSupabaseConfigured && (
          <div className="bg-warm-yellow bg-opacity-10 border border-warm-yellow rounded-lg sm:rounded-xl p-3 sm:p-4">
            <p className="text-warm-yellow font-poppins text-xs sm:text-sm text-center">
              <strong>🔧 Demo mód:</strong> Supabase nie je nakonfigurovaný. Použite ľubovoľný e-mail a heslo (min. 6 znakov).
            </p>
          </div>
        )}
        
        <Input
          label={t('auth.email')}
          type="email"
          value={formData.email}
          onChange={(value) => handleInputChange('email', value)}
          placeholder="tvoj@email.com"
          required
          error={formErrors.email}
        />

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

        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <p className="text-red-400 font-poppins text-xs sm:text-sm flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          </div>
        )}

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
              Prihlasovanie...
            </span>
          ) : (
            t('auth.loginButton')
          )}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-xs sm:text-sm">
            {t('auth.noAccount')}{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-vibrant-green hover:text-warm-yellow transition-colors duration-300 font-semibold"
            >
              {t('auth.register')}
            </button>
          </p>
          <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-electric-blue hover:text-vibrant-green transition-colors duration-300 font-semibold"
            >
              {t('auth.forgotPassword')}
            </button>
          </p>
        </div>

      </form>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={() => {
            setShowForgotPassword(false);
            clearError();
          }}
          onResetPassword={resetPassword}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default LoginForm;
