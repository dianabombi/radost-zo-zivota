import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { VerificationMethod } from '../types/verification';

export interface InteractionData {
  userId: string;
  partnerId?: string;
  partnerEmail?: string;
  verificationMethod: VerificationMethod;
  interactionType: 'individual' | 'group' | 'community';
  levelType: 'individual' | 'group' | 'city' | 'region' | 'country' | 'global';
  metadata?: {
    distance?: number;
    qrCode?: string;
    deviceId?: string;
    scannedUserId?: string;
    timestamp?: number;
  };
}

export interface InteractionResult {
  success: boolean;
  pointsEarned?: number;
  newTotalPoints?: number;
  newLevel?: number;
  interactionId?: string;
  error?: string;
  message?: string;
  points?: number;
}

// Point calculation based on level and interaction type
const calculatePoints = (levelType: string, interactionType: string): number => {
  // Individual level 1 interaction = 1 point
  if (levelType === 'individual' && interactionType === 'individual') {
    return 1;
  }
  
  // Group interactions
  if (levelType === 'group') {
    return 2;
  }
  
  // Community/City interactions
  if (levelType === 'city' || levelType === 'community') {
    return 5;
  }
  
  // Regional interactions
  if (levelType === 'region') {
    return 10;
  }
  
  // Country/Global interactions
  if (levelType === 'country' || levelType === 'global') {
    return 20;
  }
  
  return 1; // Default
};

// Calculate new level based on points
const calculateLevel = (points: number): number => {
  if (points < 10) return 1;
  if (points < 25) return 2;
  if (points < 50) return 3;
  if (points < 100) return 4;
  if (points < 200) return 5;
  if (points < 500) return 6;
  if (points < 1000) return 7;
  return 8;
};

export const submitInteraction = async (data: InteractionData): Promise<InteractionResult> => {
  try {
    // Calculate points for this interaction
    const pointsEarned = calculatePoints(data.levelType, data.interactionType);
    
    // Demo mode - simulate interaction
    if (!isSupabaseConfigured) {
      const mockUserStr = localStorage.getItem('mock_user');
      if (mockUserStr) {
        const mockUser = JSON.parse(mockUserStr);
        const newTotalPoints = (mockUser.points || 0) + pointsEarned;
        const newLevel = calculateLevel(newTotalPoints);
        
        // Update mock user
        mockUser.points = newTotalPoints;
        mockUser.level = newLevel;
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        
        return {
          success: true,
          pointsEarned,
          newTotalPoints,
          newLevel,
          interactionId: `mock-${Date.now()}`,
        };
      }
      
      return {
        success: false,
        pointsEarned: 0,
        newTotalPoints: 0,
        newLevel: 1,
        error: 'User not found in demo mode',
      };
    }
    
    // Real Supabase implementation
    // 1. Create interaction record for scanner
    const { data: interaction, error: interactionError } = await supabase
      .from('interactions')
      .insert({
        user_id: data.userId,
        group_id: null, // Individual interaction
        interaction_type: data.interactionType,
        points_earned: pointsEarned,
        level_type: data.levelType,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (interactionError) {
      console.error('Error creating interaction:', interactionError);
      throw new Error('Failed to create interaction record');
    }
    
    // 1b. If there's a scanned user (from QR code), create interaction for them too
    if (data.metadata?.scannedUserId) {
      const { error: partnerInteractionError } = await supabase
        .from('interactions')
        .insert({
          user_id: data.metadata.scannedUserId,
          group_id: null,
          interaction_type: data.interactionType,
          points_earned: pointsEarned,
          level_type: data.levelType,
          created_at: new Date().toISOString(),
        });
      
      if (partnerInteractionError) {
        console.error('Error creating partner interaction:', partnerInteractionError);
        // Don't throw - continue with scanner's interaction
      }
      
      // Update partner's points too
      const { data: partnerUser } = await supabase
        .from('users')
        .select('points, level')
        .eq('id', data.metadata.scannedUserId)
        .single();
      
      if (partnerUser) {
        const partnerNewPoints = (partnerUser.points || 0) + pointsEarned;
        const partnerNewLevel = calculateLevel(partnerNewPoints);
        
        await supabase
          .from('users')
          .update({
            points: partnerNewPoints,
            level: partnerNewLevel,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.metadata.scannedUserId);
      }
    }
    
    // 2. Get current user points
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('points, level')
      .eq('id', data.userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user:', userError);
      throw new Error('Failed to fetch user data');
    }
    
    const currentPoints = user?.points || 0;
    const newTotalPoints = currentPoints + pointsEarned;
    const newLevel = calculateLevel(newTotalPoints);
    
    // 3. Update user points and level
    const { error: updateError } = await supabase
      .from('users')
      .update({
        points: newTotalPoints,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.userId);
    
    if (updateError) {
      console.error('Error updating user:', updateError);
      throw new Error('Failed to update user points');
    }
    
    return {
      success: true,
      pointsEarned,
      newTotalPoints,
      newLevel,
      interactionId: interaction.id,
    };
    
  } catch (error) {
    console.error('Error submitting interaction:', error);
    return {
      success: false,
      pointsEarned: 0,
      newTotalPoints: 0,
      newLevel: 1,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Submit simple exchange with rate limiting (uses Edge Function)
export const submitSimpleExchange = async (
  whatIGave: string,
  whatIGot: string,
  partnerEmail: string
): Promise<InteractionResult> => {
  try {
    if (!isSupabaseConfigured) {
      // Demo mode fallback
      const mockUserStr = localStorage.getItem('mock_user');
      if (mockUserStr) {
        const mockUser = JSON.parse(mockUserStr);
        const newTotalPoints = (mockUser.points || 0) + 1;
        const newLevel = calculateLevel(newTotalPoints);
        
        mockUser.points = newTotalPoints;
        mockUser.level = newLevel;
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        
        return {
          success: true,
          pointsEarned: 1,
          newTotalPoints,
          newLevel,
          interactionId: `mock-${Date.now()}`,
        };
      }
      
      return {
        success: false,
        error: 'User not found in demo mode',
      };
    }

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Call Edge Function with rate limiting
    const { data, error } = await supabase.functions.invoke('submit-interaction', {
      body: { whatIGave, whatIGot, partnerEmail },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      
      // Check if it's a rate limit error
      if (error.message?.includes('rate limit') || error.message?.includes('429')) {
        return {
          success: false,
          error: 'Dosiahli ste limit. Môžete odoslať maximálne 10 interakcií za hodinu.',
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to submit interaction',
      };
    }

    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Failed to submit interaction',
      };
    }

    return {
      success: true,
      pointsEarned: 1,
      newTotalPoints: data.newPoints,
      newLevel: calculateLevel(data.newPoints),
      interactionId: data.interaction?.id,
      message: 'Interakcia úspešne odoslaná! +1 bod',
    };

  } catch (error) {
    console.error('Error submitting simple exchange:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Get user's interaction history
export const getUserInteractions = async (userId: string) => {
  if (!isSupabaseConfigured) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching interactions:', error);
    return [];
  }
  
  return data;
};
