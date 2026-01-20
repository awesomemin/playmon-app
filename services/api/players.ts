import { apiClient } from './client';
import type { Player } from '@/types/player';

export const playersApi = {
  /**
   * Search for a player by Riot ID (gameName + tagLine)
   * GET /players/{gameName}/{tagLine}
   */
  search: async (gameName: string, tagLine: string): Promise<Player | null> => {
    const encodedName = encodeURIComponent(gameName);
    const encodedTag = encodeURIComponent(tagLine);
    try {
      const result = await apiClient<Player>(`/players/${encodedName}/${encodedTag}`);
      return result;
    } catch (error) {
      // Log the actual error for debugging
      console.error('[playersApi.search] Error:', error);
      // Return null if player not found (404) or other error
      return null;
    }
  },
};
