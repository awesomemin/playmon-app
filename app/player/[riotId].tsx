import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Alert } from 'react-native';
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
import { useAuth } from '@/contexts/auth-context';
import { useSubscriptions } from '@/contexts/subscriptions-context';
import type { Player } from '@/types/player';

export default function PlayerProfileScreen() {
  const { riotId } = useLocalSearchParams<{ riotId: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, signIn } = useAuth();
  const { subscribe, unsubscribe, isSubscribed, subscriptions } = useSubscriptions();

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

  const playerSubscribed = player ? isSubscribed(player.id) : false;
  const currentSubscription = player
    ? subscriptions.find((s) => s.playerId === player.id)
    : null;

  const handleSubscribe = async () => {
    if (!player) return;

    // Check if authenticated, if not prompt login
    if (!isAuthenticated) {
      Alert.alert(
        '로그인 필요',
        '플레이어를 구독하려면 로그인이 필요합니다.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '로그인',
            onPress: async () => {
              const result = await signIn();
              if (result.success) {
                // After login, try to subscribe
                const subscribeResult = await subscribe(player);
                if (subscribeResult) {
                  Alert.alert('구독 완료', `${player.gameName}님을 구독했습니다.`);
                }
              }
            },
          },
        ]
      );
      return;
    }

    const result = await subscribe(player);
    if (result) {
      Alert.alert('구독 완료', `${player.gameName}님을 구독했습니다.`);
    } else {
      Alert.alert('구독 실패', '구독 중 오류가 발생했습니다.');
    }
  };

  const handleUnsubscribe = async () => {
    if (!currentSubscription) return;

    Alert.alert(
      '구독 취소',
      `${player?.gameName}님의 구독을 취소하시겠습니까?`,
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '예',
          style: 'destructive',
          onPress: async () => {
            const result = await unsubscribe(currentSubscription.id);
            if (result) {
              Alert.alert('구독 취소됨', '구독이 취소되었습니다.');
            } else {
              Alert.alert('오류', '구독 취소 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
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
        {playerSubscribed ? (
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
