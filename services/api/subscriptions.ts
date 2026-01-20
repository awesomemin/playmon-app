import { apiClient } from './client';
import type { SubscriptionResponse } from '@/types/subscription';

export const subscriptionsApi = {
  /**
   * Subscribe to a player
   * POST /players/{playerId}/subscriptions
   */
  subscribe: async (
    playerId: string,
    fcmToken?: string
  ): Promise<SubscriptionResponse> => {
    return apiClient<SubscriptionResponse>(`/players/${playerId}/subscriptions`, {
      method: 'POST',
      body: fcmToken ? { fcm_token: fcmToken } : undefined,
      requiresAuth: true,
    });
  },

  /**
   * Unsubscribe from a player
   * DELETE /subscriptions/{subscriptionId}
   */
  unsubscribe: async (subscriptionId: string): Promise<void> => {
    return apiClient(`/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },
};
