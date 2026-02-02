export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}
