export interface ParsedRiotId {
  gameName: string;
  tagLine: string;
}

export function parseRiotId(riotId: string): ParsedRiotId | null {
  const trimmed = riotId.trim();
  const hashIndex = trimmed.lastIndexOf('#');

  if (hashIndex === -1 || hashIndex === 0 || hashIndex === trimmed.length - 1) {
    return null;
  }

  const gameName = trimmed.substring(0, hashIndex).trim();
  const tagLine = trimmed.substring(hashIndex + 1).trim();

  if (!gameName || !tagLine) {
    return null;
  }

  // Riot ID constraints: gameName 3-16 chars, tagLine 3-5 chars
  if (gameName.length < 3 || gameName.length > 16) {
    return null;
  }

  if (tagLine.length < 3 || tagLine.length > 5) {
    return null;
  }

  return { gameName, tagLine };
}

export function formatRiotId(gameName: string, tagLine: string): string {
  return `${gameName}#${tagLine}`;
}
