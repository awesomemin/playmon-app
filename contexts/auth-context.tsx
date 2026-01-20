import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/services/storage/keys';
import { authApi } from '@/services/api/auth';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredToken();
  }, []);

  const loadStoredToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Failed to load token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      setIsLoading(true);

      const result = await authApi.googleSignIn();

      if (result.success && result.token) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, result.token);
        setToken(result.token);
        return { success: true };
      }

      return { success: false, error: result.error };
    } catch (error) {
      console.error('Sign in failed:', error);
      return { success: false, error: '로그인에 실패했습니다' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      setToken(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
