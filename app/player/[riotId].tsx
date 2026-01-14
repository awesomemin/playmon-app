import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { KR } from '@/constants/i18n';
import { RIOT_CDN } from '@/constants/api';
import { parseRiotId } from '@/utils/riot-id';
import { getRankColor, formatRankTier, formatWinRate } from '@/utils/rank';
import type { PlayerProfile, RankInfo } from '@/types/player';

export default function PlayerProfileScreen() {
  const { riotId } = useLocalSearchParams<{ riotId: string }>();

  // Parse the riotId from URL
  const parsed = riotId ? parseRiotId(decodeURIComponent(riotId)) : null;

  // TODO: Replace with actual API call using usePlayerProfile hook
  const isLoading = false;
  const profile: PlayerProfile | null = parsed
    ? {
        puuid: 'mock-puuid',
        gameName: parsed.gameName,
        tagLine: parsed.tagLine,
        summonerId: 'mock-summoner-id',
        summonerLevel: 350,
        profileIconId: 5367,
        soloRank: {
          queueType: 'RANKED_SOLO_5x5',
          tier: 'DIAMOND',
          rank: 'II',
          leaguePoints: 45,
          wins: 150,
          losses: 120,
        },
        flexRank: {
          queueType: 'RANKED_FLEX_SR',
          tier: 'PLATINUM',
          rank: 'I',
          leaguePoints: 80,
          wins: 50,
          losses: 40,
        },
      }
    : null;

  // TODO: Replace with actual subscription state from context
  const isSubscribed = false;

  const handleSubscribe = () => {
    // TODO: Check auth state and open login modal if not authenticated
    // Then subscribe to the player
  };

  const handleUnsubscribe = () => {
    // TODO: Unsubscribe from the player
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!profile || !parsed) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText>{KR.errors.playerNotFound}</ThemedText>
      </ThemedView>
    );
  }

  const renderRankCard = (rank: RankInfo | null, title: string) => {
    if (!rank) {
      return (
        <Card style={styles.rankCard}>
          <ThemedText type="defaultSemiBold" style={styles.rankTitle}>
            {title}
          </ThemedText>
          <ThemedText style={styles.unranked}>{KR.profile.unranked}</ThemedText>
        </Card>
      );
    }

    return (
      <Card style={styles.rankCard}>
        <ThemedText type="defaultSemiBold" style={styles.rankTitle}>
          {title}
        </ThemedText>
        <View style={styles.rankContent}>
          <Image
            source={{ uri: RIOT_CDN.rankEmblem(rank.tier) }}
            style={styles.rankEmblem}
            contentFit="contain"
          />
          <View style={styles.rankInfo}>
            <Badge
              text={formatRankTier(rank.tier, rank.rank)}
              backgroundColor={getRankColor(rank.tier)}
            />
            <ThemedText style={styles.lpText}>
              {rank.leaguePoints} {KR.profile.lp}
            </ThemedText>
            <ThemedText style={styles.winLossText}>
              {formatWinRate(rank)}
            </ThemedText>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1a1a2e', dark: '#0f0f1a' }}
      headerImage={
        <View style={styles.headerContent}>
          <Image
            source={{ uri: RIOT_CDN.profileIcon(profile.profileIconId) }}
            style={styles.profileIcon}
            contentFit="cover"
          />
        </View>
      }
    >
      {/* Player Info */}
      <ThemedView style={styles.playerInfo}>
        <ThemedText type="title">{profile.gameName}</ThemedText>
        <ThemedText style={styles.tagLine}>#{profile.tagLine}</ThemedText>
        <ThemedText style={styles.level}>
          {KR.profile.level} {profile.summonerLevel}
        </ThemedText>
      </ThemedView>

      {/* Rank Display */}
      <View style={styles.rankContainer}>
        {renderRankCard(profile.soloRank, KR.profile.soloRank)}
        {renderRankCard(profile.flexRank, KR.profile.flexRank)}
      </View>

      {/* Subscribe Button */}
      <View style={styles.subscribeContainer}>
        {isSubscribed ? (
          <Button
            title={KR.subscriptions.subscribed}
            variant="secondary"
            onPress={handleUnsubscribe}
          />
        ) : (
          <Button
            title={KR.subscriptions.subscribe}
            onPress={handleSubscribe}
          />
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  playerInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  tagLine: {
    fontSize: 18,
    opacity: 0.7,
    marginTop: 4,
  },
  level: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 8,
  },
  rankContainer: {
    gap: 16,
    marginBottom: 24,
  },
  rankCard: {
    padding: 16,
  },
  rankTitle: {
    marginBottom: 12,
  },
  rankContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rankEmblem: {
    width: 80,
    height: 80,
  },
  rankInfo: {
    flex: 1,
    gap: 8,
  },
  lpText: {
    fontSize: 16,
    fontWeight: '600',
  },
  winLossText: {
    fontSize: 14,
    opacity: 0.7,
  },
  unranked: {
    opacity: 0.5,
    fontStyle: 'italic',
  },
  subscribeContainer: {
    marginTop: 8,
  },
});
