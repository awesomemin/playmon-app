import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export interface BadgeProps {
  text: string;
  color?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium';
}

export function Badge({
  text,
  color = '#FFFFFF',
  backgroundColor = '#0a7ea4',
  size = 'medium',
}: BadgeProps) {
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          paddingHorizontal: isSmall ? 8 : 12,
          paddingVertical: isSmall ? 2 : 4,
        },
      ]}
    >
      <ThemedText
        style={[
          styles.text,
          {
            color,
            fontSize: isSmall ? 11 : 13,
          },
        ]}
      >
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
