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
      return await apiClient<Player>(`/players/${encodedName}/${encodedTag}`);
    } catch (error) {
      // Return null if player not found (404)
      return null;
    }
  },
};
