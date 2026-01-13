import React from 'react';

interface LogoProps {
  src: string;
  alt: string;
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({
  src,
  alt,
  href,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };
  
  const logoClasses = `logo transition-transform duration-300 hover:scale-110 ${sizeClasses[size]} ${className}`;
  
  const logoElement = (
    <img
      src={src}
      className={logoClasses}
      alt={alt}
    />
  );
  
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {logoElement}
      </a>
    );
  }
  
  return logoElement;
};

export default Logo;
