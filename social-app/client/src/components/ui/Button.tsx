import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  glow?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  glow = false,
}) => {
  const baseClasses = 'font-poppins font-semibold rounded-xl transition-all duration-300 focus:outline-none border-2 transform hover:scale-105 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-electric-blue border-electric-blue text-text-white hover:shadow-neon-blue hover:bg-opacity-90',
    secondary: 'bg-charcoal-light border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-text-white hover:shadow-neon-blue',
    success: 'bg-vibrant-green border-vibrant-green text-deep-charcoal hover:shadow-neon-green hover:bg-opacity-90',
    warning: 'bg-warm-yellow border-warm-yellow text-deep-charcoal hover:shadow-neon-yellow hover:bg-opacity-90',
    outline: 'bg-transparent border-vibrant-green text-vibrant-green hover:bg-vibrant-green hover:text-deep-charcoal hover:shadow-neon-green',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const glowClasses = glow ? 'animate-glow' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : 'cursor-pointer';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${glowClasses} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
