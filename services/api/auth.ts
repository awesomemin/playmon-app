import * as WebBrowser from 'expo-web-browser';
import { API_BASE_URL } from '@/constants/api';

// Ensure WebBrowser sessions are cleaned up
WebBrowser.maybeCompleteAuthSession();

export interface GoogleSignInResult {
  success: boolean;
  token?: string;
  error?: string;
}

export const authApi = {
  /**
   * Initiate Google OAuth flow via backend redirect
   * Opens browser to /oauth2/authorization/google
   * Backend redirects to Google, then back to app with JWT
   */
  googleSignIn: async (): Promise<GoogleSignInResult> => {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        `${API_BASE_URL}/oauth2/authorization/google`,
        'playmonapp://auth/callback'
      );

      if (result.type === 'success' && result.url) {
        // Extract token from redirect URL
        // Expected format: playmonapp://auth/callback?token=JWT
        const url = new URL(result.url);
        const token = url.searchParams.get('token');

        if (token) {
          return { success: true, token };
        }
        return { success: false, error: '토큰을 받지 못했습니다' };
      }

      if (result.type === 'cancel') {
        return { success: false, error: '로그인이 취소되었습니다' };
      }

      return { success: false, error: '로그인에 실패했습니다' };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: '로그인 중 오류가 발생했습니다' };
    }
  },
};
