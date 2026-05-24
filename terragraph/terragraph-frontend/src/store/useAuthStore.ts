import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api/client';
import type { AuthRequest, AuthResponse } from '@/types';

interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (data: AuthRequest) => Promise<void>;
  register: (data: AuthRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: AuthRequest) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(data);
          set({ user: res, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || 'Invalid email or password', isLoading: false });
          throw err;
        }
      },

      register: async (data: AuthRequest) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.register(data);
          set({ user: res, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || 'Registration failed', isLoading: false });
          throw err;
        }
      },

      logout: () => set({ user: null, isAuthenticated: false, error: null }),
    }),
    {
      name: 'terragraph-auth',
    }
  )
);
