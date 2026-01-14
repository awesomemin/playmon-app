import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { KR } from '@/constants/i18n';
import { router } from 'expo-router';

export default function SubscriptionsScreen() {
  const iconColor = useThemeColor({ light: '#CCCCCC', dark: '#444444' }, 'text');

  const handleSearchPress = () => {
    router.navigate('/(tabs)');
  };

  // TODO: Replace with actual subscriptions from context
  const subscriptions: any[] = [];

  if (subscriptions.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyState}>
          <IconSymbol name="bell.slash" size={64} color={iconColor} />
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            {KR.subscriptions.empty}
          </ThemedText>
          <ThemedText style={styles.emptyDescription}>
            {KR.subscriptions.emptyDescription}
          </ThemedText>
          <Button
            title={KR.subscriptions.searchPrompt}
            onPress={handleSearchPress}
            style={styles.searchButton}
          />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText>
        {subscriptions.length}
        {KR.subscriptions.count}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 24,
    textAlign: 'center',
  },
  emptyDescription: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
  searchButton: {
    marginTop: 32,
    minWidth: 200,
  },
});
