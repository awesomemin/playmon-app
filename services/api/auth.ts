import { apiClient } from './client';
import type { AuthResponse, User } from '@/types/auth';

export const authApi = {
  /**
   * Exchange Google ID token for app access token
   */
  googleSignIn: async (
    idToken: string,
    expoPushToken?: string
  ): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/google', {
      method: 'POST',
      body: { idToken, expoPushToken },
    });
  },

  /**
   * Register or update push notification token
   */
  registerPushToken: async (expoPushToken: string): Promise<void> => {
    return apiClient('/auth/push-token', {
      method: 'POST',
      body: { expoPushToken },
      requiresAuth: true,
    });
  },

  /**
   * Get current authenticated user
   */
  getMe: async (): Promise<User> => {
    return apiClient<User>('/auth/me', { requiresAuth: true });
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    });
  },
};
