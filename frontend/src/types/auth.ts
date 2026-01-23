export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  data?: {
    accessToken: string;
    user: User;
  };
}

export interface RegisterResponse {
  success?: boolean;
  message?: string;
  data?: {
    accessToken: string;
    user: User;
  };
}
