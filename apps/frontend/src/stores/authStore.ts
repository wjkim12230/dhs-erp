import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, Role } from '@dhs/shared';
import apiClient from '@/services/apiClient';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshTokenValue: string | null;
  isAuthenticated: boolean;
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  hasRole: (...roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshTokenValue: null,
      isAuthenticated: false,

      login: async (loginId: string, password: string) => {
        const { data } = await apiClient.post('/auth/login', { loginId, password });
        const result = data.data;
        set({
          user: result.user,
          token: result.accessToken,
          refreshTokenValue: result.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, token: null, refreshTokenValue: null, isAuthenticated: false });
      },

      refreshToken: async () => {
        const { refreshTokenValue } = get();
        if (!refreshTokenValue) throw new Error('No refresh token');
        const { data } = await apiClient.post('/auth/refresh', {
          refreshToken: refreshTokenValue,
        });
        set({ token: data.data.accessToken });
      },

      hasRole: (...roles: Role[]) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
      },
    }),
    {
      name: 'dhs-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshTokenValue: state.refreshTokenValue,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
