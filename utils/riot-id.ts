export interface ParsedRiotId {
  gameName: string;
  tagLine: string;
}

export function parseRiotId(riotId: string): ParsedRiotId | null {
  const trimmed = riotId.trim();
  const hashIndex = trimmed.lastIndexOf('#');

  if (hashIndex === -1 || hashIndex === 0 || hashIndex === trimmed.length - 1) {
    console.log('[parseRiotId] Invalid format: no # or empty parts');
    return null;
  }

  const gameName = trimmed.substring(0, hashIndex).trim();
  const tagLine = trimmed.substring(hashIndex + 1).trim();

  console.log('[parseRiotId] Parsed:', { gameName, tagLine, gameNameLen: gameName.length, tagLineLen: tagLine.length });

  if (!gameName || !tagLine) {
    console.log('[parseRiotId] Empty gameName or tagLine');
    return null;
  }

  // Riot ID constraints: gameName 3-16 chars, tagLine 3-5 chars
  if (gameName.length < 3 || gameName.length > 16) {
    console.log('[parseRiotId] Invalid gameName length:', gameName.length);
    return null;
  }

  if (tagLine.length < 3 || tagLine.length > 5) {
    console.log('[parseRiotId] Invalid tagLine length:', tagLine.length);
    return null;
  }

  return { gameName, tagLine };
}

export function formatRiotId(gameName: string, tagLine: string): string {
  return `${gameName}#${tagLine}`;
}
