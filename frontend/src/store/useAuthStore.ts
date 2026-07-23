import { create } from 'zustand';
import { authApi, saveToken, removeToken, getToken } from '../api';
import type { UserProfile } from '../types';

const USER_KEY = 'sims_user_profile';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;
  clearError: () => void;
  checkSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.login(email, password);
      saveToken(result.token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      set({ user: result.user, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Authentication failed' });
      return false;
    }
  },

  logout: () => {
    removeToken();
    localStorage.removeItem(USER_KEY);
    set({ user: null, error: null });
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    set({ user });
  },

  clearError: () => set({ error: null }),

  checkSession: () => {
    const token = getToken();
    if (!token) {
      set({ user: null });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        // Token expired
        removeToken();
        localStorage.removeItem(USER_KEY);
        set({ user: null });
        return;
      }

      // Restore saved user profile
      const savedUserStr = localStorage.getItem(USER_KEY);
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        set({ user: savedUser });
      }
    } catch {
      removeToken();
      localStorage.removeItem(USER_KEY);
      set({ user: null });
    }
  },
}));
