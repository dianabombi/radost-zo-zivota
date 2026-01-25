import React from 'react';

interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 sm:space-y-2 ${className}`}>
      <label className="block text-xs sm:text-sm font-poppins font-semibold text-light-text dark:text-gray-300 text-left">
        {label}
        {required && <span className="text-light-magenta dark:text-warm-yellow ml-1">*</span>}
      </label>
      
      <input
        type={type}
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-poppins text-sm sm:text-base
          bg-light-surface dark:bg-charcoal-light border-2 text-light-text dark:text-text-white
          transition-all duration-300 focus:outline-none
          ${error 
            ? 'border-red-500 focus:border-red-400 focus:shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
            : 'border-light-purple dark:border-electric-blue focus:border-light-pink dark:focus:border-vibrant-green focus:shadow-lg focus:shadow-light-purple-soft dark:focus:shadow-neon-green'
          }
          placeholder:text-light-text-secondary dark:placeholder:text-text-light placeholder:opacity-50
          hover:border-vibrant-green
        `}
      />
      
      {error && (
        <p className="text-red-400 text-xs sm:text-sm font-poppins flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
