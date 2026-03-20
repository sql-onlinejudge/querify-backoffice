import { create } from 'zustand';
import type { AuthState } from '../types';

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: true,
  login: () => {
    set({ isAuthenticated: true });
  },
  logout: () => {
    set({ isAuthenticated: false });
  },
}));
