import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Header } from '../layout';

const AuthModal: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-deep-charcoal p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Side-by-side layout: Logo/Text left, Form right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          {/* Left side - Logo, Title and Description */}
          <div className="flex flex-col justify-center space-y-6 lg:pr-8">
            {/* Header with logo and title */}
            <div>
              <Header title="Hra na radosť zo života" />
            </div>
            
            <div className="space-y-4 text-left text-light-text dark:text-gray-200 font-poppins">
              <p className="text-base sm:text-lg text-left">
                🎮 Pripoj sa k hernej komunite a objavuj radosť zo života
              </p>
              <p className="text-sm sm:text-base text-left text-light-text-secondary dark:text-gray-400">
                Stretávaj nových ľudí, zdieľaj skúsenosti a získavaj body za každé zoznámenie.
              </p>
            </div>
          </div>

          {/* Right side - Login/Register form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>

        <footer className="text-center text-light-text-secondary dark:text-gray-300 font-poppins opacity-60 mt-12 sm:mt-16 lg:mt-20 px-4 text-sm">
          <p>✨ Začni svoju cestu k radosti dnes</p>
        </footer>
      </div>
    </div>
  );
};

export default AuthModal;
