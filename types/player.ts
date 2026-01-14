export interface Player {
  puuid: string;
  gameName: string;
  tagLine: string;
  summonerId: string;
  summonerLevel: number;
  profileIconId: number;
}

export interface RankInfo {
  queueType: 'RANKED_SOLO_5x5' | 'RANKED_FLEX_SR';
  tier: RankTier;
  rank: RankDivision;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export type RankTier =
  | 'IRON'
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'EMERALD'
  | 'DIAMOND'
  | 'MASTER'
  | 'GRANDMASTER'
  | 'CHALLENGER';

export type RankDivision = 'I' | 'II' | 'III' | 'IV';

export interface PlayerProfile extends Player {
  soloRank: RankInfo | null;
  flexRank: RankInfo | null;
}
