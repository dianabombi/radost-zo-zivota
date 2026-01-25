import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { VerificationMethod } from '../types/verification';

export interface MeetingRequestData {
  fromUserId: string;
  toUserId: string;
  method: VerificationMethod;
  distance?: number;
  metadata?: Record<string, any>;
}

export interface MeetingRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'expired';
  method: VerificationMethod;
  distance?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  expires_at: string;
  from_user?: {
    id: string;
    email: string;
    nickname: string;
  };
  to_user?: {
    id: string;
    email: string;
    nickname: string;
  };
}

// Create a new meeting request
export const createMeetingRequest = async (data: MeetingRequestData): Promise<{ success: boolean; error?: string; requestId?: string }> => {
  try {
    if (!isSupabaseConfigured) {
      console.log('Demo mode: Meeting request created (mock)');
      return { success: true, requestId: `mock-${Date.now()}` };
    }

    // Check if there's already a pending request between these users
    const { data: existingRequest } = await supabase
      .from('meeting_requests')
      .select('id')
      .eq('from_user_id', data.fromUserId)
      .eq('to_user_id', data.toUserId)
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      return { success: false, error: 'Už existuje čakajúca žiadosť pre tohto používateľa.' };
    }

    // Create new request
    const { data: request, error } = await supabase
      .from('meeting_requests')
      .insert({
        from_user_id: data.fromUserId,
        to_user_id: data.toUserId,
        method: data.method,
        distance: data.distance,
        metadata: data.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating meeting request:', error);
      return { success: false, error: 'Nepodarilo sa vytvoriť žiadosť o stretnutie.' };
    }

    return { success: true, requestId: request.id };
  } catch (error) {
    console.error('Error in createMeetingRequest:', error);
    return { success: false, error: 'Neočakávaná chyba pri vytváraní žiadosti.' };
  }
};

// Get pending requests for a user
export const getPendingRequests = async (userId: string): Promise<MeetingRequest[]> => {
  try {
    if (!isSupabaseConfigured) {
      // Return mock data for demo mode
      return [];
    }

    const { data, error } = await supabase
      .from('meeting_requests')
      .select(`
        *,
        from_user:users!meeting_requests_from_user_id_fkey(id, email, nickname)
      `)
      .eq('to_user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }

    return data as MeetingRequest[];
  } catch (error) {
    console.error('Error in getPendingRequests:', error);
    return [];
  }
};

// Get sent requests by a user
export const getSentRequests = async (userId: string): Promise<MeetingRequest[]> => {
  try {
    if (!isSupabaseConfigured) {
      return [];
    }

    const { data, error } = await supabase
      .from('meeting_requests')
      .select(`
        *,
        to_user:users!meeting_requests_to_user_id_fkey(id, email, nickname)
      `)
      .eq('from_user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sent requests:', error);
      return [];
    }

    return data as MeetingRequest[];
  } catch (error) {
    console.error('Error in getSentRequests:', error);
    return [];
  }
};

// Confirm a meeting request
export const confirmMeetingRequest = async (requestId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!isSupabaseConfigured) {
      console.log('Demo mode: Meeting request confirmed (mock)');
      return { success: true };
    }

    const { error } = await supabase
      .from('meeting_requests')
      .update({ status: 'confirmed' })
      .eq('id', requestId);

    if (error) {
      console.error('Error confirming meeting request:', error);
      return { success: false, error: 'Nepodarilo sa potvrdiť žiadosť.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in confirmMeetingRequest:', error);
    return { success: false, error: 'Neočakávaná chyba pri potvrdzovaní žiadosti.' };
  }
};

// Reject a meeting request
export const rejectMeetingRequest = async (requestId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!isSupabaseConfigured) {
      console.log('Demo mode: Meeting request rejected (mock)');
      return { success: true };
    }

    const { error } = await supabase
      .from('meeting_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) {
      console.error('Error rejecting meeting request:', error);
      return { success: false, error: 'Nepodarilo sa odmietnuť žiadosť.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in rejectMeetingRequest:', error);
    return { success: false, error: 'Neočakávaná chyba pri odmietaní žiadosti.' };
  }
};

// Subscribe to real-time updates for pending requests
export const subscribeToPendingRequests = (
  userId: string,
  callback: (requests: MeetingRequest[]) => void
) => {
  if (!isSupabaseConfigured) {
    return () => {}; // Return empty cleanup function for demo mode
  }

  const channel = supabase
    .channel('meeting_requests_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'meeting_requests',
        filter: `to_user_id=eq.${userId}`,
      },
      async () => {
        // Fetch updated requests
        const requests = await getPendingRequests(userId);
        callback(requests);
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
};
