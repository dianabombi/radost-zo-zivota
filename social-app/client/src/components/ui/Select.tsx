import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Vyber možnosť',
  required = false,
  error,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 sm:space-y-2 ${className}`}>
      <label className="block text-xs sm:text-sm font-poppins font-semibold text-light-text dark:text-gray-300 text-left">
        {label}
        {required && <span className="text-light-magenta dark:text-warm-yellow ml-1">*</span>}
      </label>
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`
          w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-poppins text-sm sm:text-base
          bg-light-surface dark:bg-charcoal-light border-2 text-light-text dark:text-text-white
          transition-all duration-300 focus:outline-none
          cursor-pointer
          ${error 
            ? 'border-red-500 focus:border-red-400 focus:shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
            : 'border-electric-blue focus:border-vibrant-green focus:shadow-neon-green'
          }
          hover:border-vibrant-green
          appearance-none
          bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2300FF6C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e')]
          bg-[length:1.5em_1.5em]
          bg-[right_0.5rem_center]
          bg-no-repeat
          pr-10
        `}
      >
        <option value="" disabled className="bg-light-surface dark:bg-charcoal-light text-light-text-secondary dark:text-gray-400">
          {placeholder}
        </option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-light-surface dark:bg-charcoal-light text-light-text dark:text-text-white hover:bg-electric-blue"
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-red-400 text-xs sm:text-sm font-poppins flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
