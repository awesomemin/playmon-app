import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { KR } from '@/constants/i18n';
import { RIOT_CDN } from '@/constants/api';
import { parseRiotId } from '@/utils/riot-id';
import { playersApi } from '@/services/api/players';
import type { Player } from '@/types/player';

export default function PlayerProfileScreen() {
  const { riotId } = useLocalSearchParams<{ riotId: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse the riotId from URL
  const parsed = riotId ? parseRiotId(decodeURIComponent(riotId)) : null;

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!parsed) {
        setIsLoading(false);
        setError(KR.errors.playerNotFound);
        return;
      }

      try {
        const result = await playersApi.search(parsed.gameName, parsed.tagLine);
        if (result) {
          setPlayer(result);
        } else {
          setError(KR.errors.playerNotFound);
        }
      } catch {
        setError(KR.errors.generic);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayer();
  }, [parsed?.gameName, parsed?.tagLine]);

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

  if (!player || !parsed || error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText>{error || KR.errors.playerNotFound}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1a1a2e', dark: '#0f0f1a' }}
      headerImage={
        <View style={styles.headerContent}>
          <Image
            source={{ uri: RIOT_CDN.profileIcon(player.profileIconId) }}
            style={styles.profileIcon}
            contentFit="cover"
          />
        </View>
      }
    >
      {/* Player Info */}
      <ThemedView style={styles.playerInfo}>
        <ThemedText type="title">{player.gameName}</ThemedText>
        <ThemedText style={styles.tagLine}>#{player.tagLine}</ThemedText>
        <ThemedText style={styles.level}>
          {KR.profile.level} {player.summonerLevel}
        </ThemedText>
      </ThemedView>

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
  subscribeContainer: {
    marginTop: 8,
  },
});
