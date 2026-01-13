import React, { useState } from 'react';
import Button from './Button';

interface CounterProps {
  initialValue?: number;
  step?: number;
  min?: number;
  max?: number;
  onCountChange?: (count: number) => void;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  step = 1,
  min,
  max,
  onCountChange,
  className = '',
}) => {
  const [count, setCount] = useState(initialValue);
  
  const handleIncrement = () => {
    const newCount = count + step;
    if (max === undefined || newCount <= max) {
      setCount(newCount);
      onCountChange?.(newCount);
    }
  };
  
  const handleDecrement = () => {
    const newCount = count - step;
    if (min === undefined || newCount >= min) {
      setCount(newCount);
      onCountChange?.(newCount);
    }
  };
  
  const isDecrementDisabled = min !== undefined && count <= min;
  const isIncrementDisabled = max !== undefined && count >= max;
  
  return (
    <div className={`flex items-center space-x-3 sm:space-x-4 md:space-x-6 ${className}`}>
      <Button
        onClick={handleDecrement}
        disabled={isDecrementDisabled}
        variant="outline"
        size="sm"
        className="text-base sm:text-lg"
      >
        -
      </Button>
      
      <div className="bg-charcoal-light border-2 border-vibrant-green rounded-lg sm:rounded-xl px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 min-w-[60px] sm:min-w-[70px] md:min-w-[80px] text-center font-poppins font-bold text-lg sm:text-xl text-vibrant-green shadow-neon-green">
        {count}
      </div>
      
      <Button
        onClick={handleIncrement}
        disabled={isIncrementDisabled}
        variant="outline"
        size="sm"
        className="text-base sm:text-lg"
      >
        +
      </Button>
    </div>
  );
};

export default Counter;
