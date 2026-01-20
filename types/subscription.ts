// Response from POST /players/{playerId}/subscriptions
export interface SubscriptionResponse {
  id: string;
  odx_uid: string;
  playerId: string;
}

// Local subscription with player info (cached in AsyncStorage)
export interface Subscription {
  id: string;
  odx_uid: string;
  playerId: string;
  // Player info (stored locally since no GET endpoint yet)
  gameName: string;
  tagLine: string;
  profileIconId: number;
  summonerLevel: number;
}
