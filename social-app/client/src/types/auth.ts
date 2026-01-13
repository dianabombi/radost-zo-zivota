export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  level: number;
  points: number;
  city?: string;
  region?: string;
  country?: string;
  createdAt: string;
  lastActive: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  city?: string;
  region?: string;
  country?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  resetPassword: (email: string) => Promise<void>;
}
