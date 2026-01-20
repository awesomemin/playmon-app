export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.0.52:8080';

export const RIOT_CDN = {
  profileIcon: (iconId: number, version = '15.2.1') =>
    `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${iconId}.png`,

  rankEmblem: (tier: string) =>
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/rankedcrests/${tier.toLowerCase()}/images/${tier.toLowerCase()}_baseface_matte.png`,
};

export const RIOT_REGION = {
  platform: 'kr',
  regional: 'asia',
} as const;
