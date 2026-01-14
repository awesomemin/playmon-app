import type { RankTier, RankInfo } from '@/types/player';

export const RANK_COLORS: Record<RankTier, string> = {
  IRON: '#5C5C5C',
  BRONZE: '#8B4513',
  SILVER: '#A0A0A0',
  GOLD: '#FFD700',
  PLATINUM: '#00CED1',
  EMERALD: '#50C878',
  DIAMOND: '#B9F2FF',
  MASTER: '#9932CC',
  GRANDMASTER: '#DC143C',
  CHALLENGER: '#00BFFF',
};

export const RANK_NAMES_KR: Record<RankTier, string> = {
  IRON: '아이언',
  BRONZE: '브론즈',
  SILVER: '실버',
  GOLD: '골드',
  PLATINUM: '플래티넘',
  EMERALD: '에메랄드',
  DIAMOND: '다이아몬드',
  MASTER: '마스터',
  GRANDMASTER: '그랜드마스터',
  CHALLENGER: '챌린저',
};

export function getRankColor(tier: RankTier): string {
  return RANK_COLORS[tier] || '#888888';
}

export function formatRankTier(tier: RankTier, rank: string): string {
  const tierName = RANK_NAMES_KR[tier] || tier;
  // Master, Grandmaster, Challenger don't have divisions
  if (['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(tier)) {
    return tierName;
  }
  return `${tierName} ${rank}`;
}

export function calculateWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

export function formatWinRate(rankInfo: RankInfo): string {
  const winRate = calculateWinRate(rankInfo.wins, rankInfo.losses);
  return `${rankInfo.wins}승 ${rankInfo.losses}패 (${winRate}%)`;
}
