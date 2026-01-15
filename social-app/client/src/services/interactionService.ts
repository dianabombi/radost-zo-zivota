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
  };
}

export interface InteractionResult {
  success: boolean;
  pointsEarned: number;
  newTotalPoints: number;
  newLevel: number;
  interactionId?: string;
  error?: string;
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
    // 1. Create interaction record
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
