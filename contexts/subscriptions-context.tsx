import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { subscriptionsApi } from '@/services/api/subscriptions';
import { useAuth } from './auth-context';
import type { Subscription } from '@/types/subscription';

interface SubscriptionsContextValue {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  subscribe: (puuid: string, riotId: string) => Promise<boolean>;
  unsubscribe: (subscriptionId: string) => Promise<boolean>;
  isSubscribed: (puuid: string) => boolean;
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

  useEffect(() => {
    if (isAuthenticated) {
      refreshSubscriptions();
    } else {
      setSubscriptions([]);
    }
  }, [isAuthenticated]);

  const refreshSubscriptions = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await subscriptionsApi.getAll();
      setSubscriptions(data);
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
      setError('구독 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const subscribe = useCallback(
    async (puuid: string, riotId: string): Promise<boolean> => {
      try {
        const newSubscription = await subscriptionsApi.subscribe(puuid, riotId);
        setSubscriptions((prev) => [...prev, newSubscription]);
        return true;
      } catch (err) {
        console.error('Failed to subscribe:', err);
        return false;
      }
    },
    []
  );

  const unsubscribe = useCallback(async (subscriptionId: string): Promise<boolean> => {
    try {
      await subscriptionsApi.unsubscribe(subscriptionId);
      setSubscriptions((prev) => prev.filter((s) => s.id !== subscriptionId));
      return true;
    } catch (err) {
      console.error('Failed to unsubscribe:', err);
      return false;
    }
  }, []);

  const isSubscribed = useCallback(
    (puuid: string): boolean => {
      return subscriptions.some((s) => s.puuid === puuid);
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
