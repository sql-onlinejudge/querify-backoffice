export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}
