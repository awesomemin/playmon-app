import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subscriptionsApi } from '@/services/api/subscriptions';
import { useAuth } from './auth-context';
import type { Subscription } from '@/types/subscription';
import type { Player } from '@/types/player';

const SUBSCRIPTIONS_STORAGE_KEY = 'playmon_subscriptions';

interface SubscriptionsContextValue {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  subscribe: (player: Player) => Promise<boolean>;
  unsubscribe: (subscriptionId: string) => Promise<boolean>;
  isSubscribed: (playerId: string) => boolean;
  refreshSubscriptions: () => Promise<void>;
}

const SubscriptionsContext = createContext<SubscriptionsContextValue | undefined>(
  undefined
);

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load subscriptions from local storage on mount
  useEffect(() => {
    const loadLocalSubscriptions = async () => {
      try {
        const stored = await AsyncStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
        if (stored) {
          setSubscriptions(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load subscriptions from storage:', err);
      }
    };

    if (isAuthenticated) {
      loadLocalSubscriptions();
    } else {
      setSubscriptions([]);
      AsyncStorage.removeItem(SUBSCRIPTIONS_STORAGE_KEY);
    }
  }, [isAuthenticated]);

  // Save subscriptions to local storage whenever they change
  useEffect(() => {
    if (isAuthenticated && subscriptions.length > 0) {
      AsyncStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(subscriptions));
    }
  }, [subscriptions, isAuthenticated]);

  const refreshSubscriptions = useCallback(async () => {
    // TODO: Implement when GET /subscriptions API is ready
    console.log('[Subscriptions] refreshSubscriptions: API not implemented yet');
  }, []);

  const subscribe = useCallback(
    async (player: Player): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await subscriptionsApi.subscribe(player.id);
        const newSubscription: Subscription = {
          id: response.id,
          odx_uid: response.odx_uid,
          playerId: response.playerId,
          gameName: player.gameName,
          tagLine: player.tagLine,
          profileIconId: player.profileIconId,
          summonerLevel: player.summonerLevel,
        };
        setSubscriptions((prev) => [...prev, newSubscription]);
        return true;
      } catch (err) {
        console.error('Failed to subscribe:', err);
        setError('구독에 실패했습니다');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const unsubscribe = useCallback(async (subscriptionId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await subscriptionsApi.unsubscribe(subscriptionId);
      setSubscriptions((prev) => {
        const updated = prev.filter((s) => s.id !== subscriptionId);
        if (updated.length === 0) {
          AsyncStorage.removeItem(SUBSCRIPTIONS_STORAGE_KEY);
        }
        return updated;
      });
      return true;
    } catch (err) {
      console.error('Failed to unsubscribe:', err);
      setError('구독 취소에 실패했습니다');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isSubscribed = useCallback(
    (playerId: string): boolean => {
      return subscriptions.some((s) => s.playerId === playerId);
    },
    [subscriptions]
  );

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,
        isLoading,
        error,
        subscribe,
        unsubscribe,
        isSubscribed,
        refreshSubscriptions,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within SubscriptionsProvider');
  }
  return context;
}
