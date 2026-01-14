import { apiClient } from './client';
import type { Player, PlayerProfile } from '@/types/player';

export const playersApi = {
  /**
   * Search for a player by Riot ID (gameName + tagLine)
   */
  search: async (gameName: string, tagLine: string): Promise<Player | null> => {
    const encodedName = encodeURIComponent(gameName);
    const encodedTag = encodeURIComponent(tagLine);
    return apiClient<Player | null>(
      `/players/search?gameName=${encodedName}&tagLine=${encodedTag}`
    );
  },

  /**
   * Get detailed player profile with rank information
   */
  getProfile: async (puuid: string): Promise<PlayerProfile> => {
    return apiClient<PlayerProfile>(`/players/${puuid}/profile`);
  },
};
