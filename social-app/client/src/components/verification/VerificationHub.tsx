import React, { useState } from 'react';
import SimpleExchange from './SimpleExchange';
import InteractionSuccess from './InteractionSuccess';
import { useAuth } from '../../contexts/AuthContext';
import type { InteractionResult } from '../../services/interactionService';

type FlowState = 'select_method' | 'success';

const VerificationHub: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [flowState, setFlowState] = useState<FlowState>('select_method');
  const [interactionResult, setInteractionResult] = useState<InteractionResult | null>(null);

  const handleSimpleExchange = async (data: { whatIGave: string; whatIGot: string; partnerEmail: string }) => {
    console.log('Simple exchange:', data);
    
    if (!user) return;
    
    // Submit simple exchange with rate limiting via Edge Function
    const { submitSimpleExchange } = await import('../../services/interactionService');
    const result = await submitSimpleExchange(data.whatIGave, data.whatIGot, data.partnerEmail);
    
    setInteractionResult(result);
    
    if (result.success) {
      // Refresh user data to show updated points immediately
      await refreshUser();
      
      // Show success with points earned
      setFlowState('success');
      
      // Reset form after short delay
      setTimeout(() => {
        setFlowState('select_method');
        setInteractionResult(null);
      }, 3000);
    } else if (result.error) {
      // Show error message (including rate limit errors)
      alert(result.error);
    }
  };

  const handleSuccessClose = () => {
    setFlowState('select_method');
    setInteractionResult(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold text-transparent bg-gradient-to-r from-electric-blue to-vibrant-green bg-clip-text mb-2">
          🤝 Nové Zoznámenie
        </h2>
        <p className="text-light-text-secondary dark:text-gray-300 font-poppins text-sm sm:text-base">
          Zadaj detaily o stretnutí a získaj body
        </p>
      </div>

      {/* Content */}
      {flowState === 'success' && interactionResult && (
        <InteractionSuccess
          result={interactionResult}
          onClose={handleSuccessClose}
        />
      )}

      {flowState === 'select_method' && (
        <SimpleExchange onSubmit={handleSimpleExchange} />
      )}
    </div>
  );
};

export default VerificationHub;
