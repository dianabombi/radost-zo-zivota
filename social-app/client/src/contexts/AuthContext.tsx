import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AuthContextType, AuthState, User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Auth reducer
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for mock user if Supabase is not configured
        if (!isSupabaseConfigured) {
          const mockUserStr = localStorage.getItem('mock_user');
          if (mockUserStr) {
            try {
              const mockUser = JSON.parse(mockUserStr);
              dispatch({ type: 'AUTH_SUCCESS', payload: mockUser });
            } catch (error) {
              localStorage.removeItem('mock_user');
            }
          }
          return;
        }

        // Check for real Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile from database
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            const user: User = {
              id: profile.id,
              email: profile.email,
              nickname: profile.nickname,
              avatar: profile.avatar_url,
              level: profile.level,
              points: profile.points,
              city: profile.city,
              region: profile.region,
              country: profile.country,
              createdAt: profile.created_at,
              lastActive: profile.last_active,
            };
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();

    // Only listen for auth changes if Supabase is configured
    if (!isSupabaseConfigured) {
      return;
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        dispatch({ type: 'AUTH_LOGOUT' });
      } else if (event === 'SIGNED_IN' && session?.user) {
        // Get user profile from database
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            nickname: profile.nickname,
            avatar: profile.avatar_url,
            level: profile.level,
            points: profile.points,
            city: profile.city,
            region: profile.region,
            country: profile.country,
            createdAt: profile.created_at,
            lastActive: profile.last_active,
          };
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Use mock authentication if Supabase is not configured
      if (!isSupabaseConfigured) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (credentials.password.length >= 6) {
          const mockUser: User = {
            id: Date.now().toString(),
            email: credentials.email,
            nickname: credentials.email.split('@')[0],
            level: 1,
            points: 0,
            city: 'Bratislava',
            region: 'Bratislavský kraj',
            country: 'Slovakia',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
          };
          
          localStorage.setItem('mock_user', JSON.stringify(mockUser));
          dispatch({ type: 'AUTH_SUCCESS', payload: mockUser });
          return;
        } else {
          throw new Error('Nesprávne prihlasovacie údaje');
        }
      }

      // Use real Supabase authentication
      console.log('Attempting Supabase login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        const errorMessage = error.message === 'Invalid login credentials' 
          ? '❌ Nesprávne prihlasovacie údaje.\n\n💡 Nemáte ešte účet? Kliknite na "Zaregistrujte sa" nižšie.' 
          : error.message === 'Failed to fetch'
          ? 'Chyba pripojenia k serveru. Skontrolujte pripojenie k internetu.'
          : error.message;
        throw new Error(errorMessage);
      }

      if (data?.user) {
        // Get user profile from database
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          
          // Check if it's a table/schema error
          if (profileError.code === '42P01' || profileError.message?.includes('relation') || profileError.message?.includes('does not exist')) {
            throw new Error('⚠️ Databáza nie je nastavená. Spustite schema-simple.sql v Supabase SQL Editor.');
          }
          
          // Check if it's a policy error
          if (profileError.code === '42501' || profileError.message?.includes('policy')) {
            throw new Error('⚠️ Profil používateľa nebol nájdený. Skontrolujte RLS politiky v Supabase.');
          }
          
          throw new Error(`Chyba pri načítaní profilu: ${profileError.message}`);
        }

        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            nickname: profile.nickname,
            avatar: profile.avatar_url,
            level: profile.level,
            points: profile.points,
            city: profile.city,
            region: profile.region,
            country: profile.country,
            createdAt: profile.created_at,
            lastActive: profile.last_active,
          };
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } else {
          throw new Error('Profil používateľa nebol najdený. Zaregistrujte sa najprv.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Chyba pri prihlasovaní' });
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Validation
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Heslá sa nezhodujú');
      }
      
      if (credentials.password.length < 6) {
        throw new Error('Heslo musí mať aspoň 6 znakov');
      }
      
      // Use mock authentication if Supabase is not configured
      if (!isSupabaseConfigured) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockUser: User = {
          id: Date.now().toString(),
          email: credentials.email,
          nickname: credentials.nickname,
          level: 1,
          points: 0,
          city: credentials.city,
          region: credentials.region,
          country: credentials.country || 'Slovakia',
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };
        
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        dispatch({ type: 'AUTH_SUCCESS', payload: mockUser });
        return;
      }
      
      // Register with Supabase Auth - pass user metadata
      console.log('Attempting Supabase registration...');
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            nickname: credentials.nickname,
            city: credentials.city,
            region: credentials.region,
            country: credentials.country || 'Slovakia',
          }
        }
      });

      if (error) {
        console.error('Supabase registration error:', error);
        const errorMessage = error.message === 'Failed to fetch'
          ? 'Chyba pripojenia k serveru. Skontrolujte databázu v Supabase.'
          : error.message;
        throw new Error(errorMessage);
      }

      if (data.user) {
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update the user profile with additional details (trigger creates basic profile)
        const { error: updateError } = await supabase
          .from('users')
          .update({
            nickname: credentials.nickname,
            city: credentials.city,
            region: credentials.region,
            country: credentials.country || 'Slovakia',
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          // Don't throw error here, profile was created by trigger
        }

        // If email confirmation is required, show message
        if (!data.session) {
          dispatch({ type: 'AUTH_ERROR', payload: 'Skontrolujte svoj e-mail a potvrďte registráciu' });
          return;
        }

        // Fetch the complete user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            nickname: profile.nickname,
            avatar: profile.avatar_url,
            level: profile.level,
            points: profile.points,
            city: profile.city,
            region: profile.region,
            country: profile.country,
            createdAt: profile.created_at,
            lastActive: profile.last_active,
          };
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } else {
          // Fallback if profile not found
          const user: User = {
            id: data.user.id,
            email: credentials.email,
            nickname: credentials.nickname,
            level: 1,
            points: 0,
            city: credentials.city,
            region: credentials.region,
            country: credentials.country || 'Slovakia',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
          };
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        }
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Chyba pri registrácii' });
    }
  };

  const logout = async () => {
    try {
      if (!isSupabaseConfigured) {
        localStorage.removeItem('mock_user');
        dispatch({ type: 'AUTH_LOGOUT' });
        return;
      }
      
      await supabase.auth.signOut();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Error signing out:', error);
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const resetPassword = async (email: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // In demo mode, just simulate sending email
      if (!isSupabaseConfigured) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Demo mode: Password reset email would be sent to:', email);
        dispatch({ type: 'AUTH_ERROR', payload: '' });
        return;
      }

      // Use Supabase password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw new Error('Chyba pri odosielaní e-mailu. Skontrolujte e-mailovú adresu.');
      }

      // Success - clear error state
      dispatch({ type: 'AUTH_ERROR', payload: '' });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Chyba pri obnovení hesla' });
      throw error;
    }
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
