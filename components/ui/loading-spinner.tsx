import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { KR } from '@/constants/i18n';

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function LoadingSpinner({
  message = KR.common.loading,
  size = 'large',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const tint = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor }]}>
        <ActivityIndicator size={size} color={tint} />
        {message && <ThemedText style={styles.message}>{message}</ThemedText>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={tint} />
      {message && <ThemedText style={styles.message}>{message}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 12,
    opacity: 0.7,
  },
});
