import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Header } from '../layout';

const AuthModal: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-deep-charcoal p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Header title="Hra na radosť zo života" />
        
        <div className="max-w-2xl mx-auto">
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        <footer className="text-center text-light-text-secondary dark:text-gray-300 font-poppins opacity-60 mt-8 sm:mt-10 md:mt-12 px-4 text-sm sm:text-base">
          <p>🎮 Pripoj sa k hernej komunite a objavuj radosť zo života</p>
        </footer>
      </div>
    </div>
  );
};

export default AuthModal;
