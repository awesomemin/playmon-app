import { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { KR } from '@/constants/i18n';
import { RIOT_CDN } from '@/constants/api';
import { parseRiotId, formatRiotId } from '@/utils/riot-id';
import { playersApi } from '@/services/api/players';
import type { Player } from '@/types/player';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const iconColor = useThemeColor({}, 'icon');

  const handleSearch = useCallback(async () => {
    const parsed = parseRiotId(searchQuery);
    if (!parsed) {
      setError(KR.search.invalidFormat);
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResult(null);

    try {
      const result = await playersApi.search(parsed.gameName, parsed.tagLine);
      console.log('[SearchScreen] API result:', JSON.stringify(result, null, 2));

      if (result) {
        setSearchResult(result);

        // Add to recent searches
        const riotId = formatRiotId(parsed.gameName, parsed.tagLine);
        setRecentSearches((prev) => {
          const filtered = prev.filter((s) => s !== riotId);
          return [riotId, ...filtered].slice(0, 10);
        });
      } else {
        setError(KR.errors.playerNotFound);
      }
    } catch {
      setError(KR.errors.playerNotFound);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handlePlayerPress = (player: Player) => {
    const riotId = formatRiotId(player.gameName, player.tagLine);
    router.push(`/player/${encodeURIComponent(riotId)}`);
  };

  const handleRecentSearchPress = (riotId: string) => {
    setSearchQuery(riotId);
  };

  const renderSearchResult = () => {
    if (!searchResult) return null;

    const riotId = formatRiotId(searchResult.gameName, searchResult.tagLine);

    return (
      <TouchableOpacity onPress={() => handlePlayerPress(searchResult)}>
        <Card variant="elevated" style={styles.resultCard}>
          <View style={styles.resultContent}>
            <Avatar
              uri={RIOT_CDN.profileIcon(searchResult.profileIconId)}
              size={56}
            />
            <View style={styles.resultInfo}>
              <ThemedText type="defaultSemiBold">{riotId}</ThemedText>
              <ThemedText style={styles.levelText}>
                {KR.profile.level} {searchResult.summonerLevel}
              </ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color={iconColor} />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={KR.search.placeholder}
          icon={<IconSymbol name="magnifyingglass" size={20} color={iconColor} />}
          rightIcon={
            searchQuery ? (
              <IconSymbol name="xmark.circle.fill" size={20} color={iconColor} />
            ) : undefined
          }
          onRightIconPress={() => {
            setSearchQuery('');
            setSearchResult(null);
            setError(null);
          }}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          error={!!error}
        />
        {error && (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        )}
      </View>

      {isSearching ? (
        <LoadingSpinner message={KR.search.searching} />
      ) : searchResult ? (
        <View style={styles.resultsContainer}>{renderSearchResult()}</View>
      ) : recentSearches.length > 0 ? (
        <View style={styles.recentContainer}>
          <ThemedText type="subtitle" style={styles.recentTitle}>
            {KR.search.recentSearches}
          </ThemedText>
          <FlatList
            data={recentSearches}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recentItem}
                onPress={() => handleRecentSearchPress(item)}
              >
                <IconSymbol name="clock" size={16} color={iconColor} />
                <ThemedText style={styles.recentText}>{item}</ThemedText>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    marginTop: 8,
  },
  resultsContainer: {
    paddingHorizontal: 16,
  },
  resultCard: {
    marginBottom: 12,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultInfo: {
    flex: 1,
  },
  levelText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  recentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recentTitle: {
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  recentText: {
    fontSize: 16,
  },
});
