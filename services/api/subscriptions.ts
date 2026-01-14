import { apiClient } from './client';
import type { Subscription } from '@/types/subscription';

export const subscriptionsApi = {
  /**
   * Get all subscriptions for the current user
   */
  getAll: async (): Promise<Subscription[]> => {
    return apiClient<Subscription[]>('/subscriptions', { requiresAuth: true });
  },

  /**
   * Subscribe to a player
   */
  subscribe: async (puuid: string, riotId: string): Promise<Subscription> => {
    return apiClient<Subscription>('/subscriptions', {
      method: 'POST',
      body: { puuid, riotId },
      requiresAuth: true,
    });
  },

  /**
   * Unsubscribe from a player
   */
  unsubscribe: async (subscriptionId: string): Promise<void> => {
    return apiClient(`/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },
};
