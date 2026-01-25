import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create a dummy client if not configured (for development)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          nickname: string
          avatar_url?: string
          level: number
          points: number
          city?: string
          region?: string
          country?: string
          created_at: string
          updated_at: string
          last_active: string
        }
        Insert: {
          id?: string
          email: string
          nickname: string
          avatar_url?: string
          level?: number
          points?: number
          city?: string
          region?: string
          country?: string
          created_at?: string
          updated_at?: string
          last_active?: string
        }
        Update: {
          id?: string
          email?: string
          nickname?: string
          avatar_url?: string
          level?: number
          points?: number
          city?: string
          region?: string
          country?: string
          created_at?: string
          updated_at?: string
          last_active?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description?: string
          max_members: number
          current_members: number
          level: number
          points: number
          city?: string
          region?: string
          country?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          max_members?: number
          current_members?: number
          level?: number
          points?: number
          city?: string
          region?: string
          country?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          max_members?: number
          current_members?: number
          level?: number
          points?: number
          city?: string
          region?: string
          country?: string
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: 'member' | 'admin' | 'owner'
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: 'member' | 'admin' | 'owner'
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: 'member' | 'admin' | 'owner'
          joined_at?: string
        }
      }
    }
  }
}
