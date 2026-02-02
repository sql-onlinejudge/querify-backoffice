import { create } from 'zustand';
import type { AuthState } from '../types';

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  accessToken: localStorage.getItem('accessToken'),
  login: (token: string) => {
    console.log('Storing token:', token);
    localStorage.setItem('accessToken', token);
    set({ isAuthenticated: true, accessToken: token });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ isAuthenticated: false, accessToken: null });
  },
}));
