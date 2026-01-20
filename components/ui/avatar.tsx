import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

export interface AvatarProps {
  uri?: string | null;
  size?: number;
  fallbackIcon?: string;
}

export function Avatar({ uri, size = 48, fallbackIcon = 'person.fill' }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const backgroundColor = useThemeColor(
    { light: '#E0E0E0', dark: '#3A3A3C' },
    'background'
  );
  const iconColor = useThemeColor(
    { light: '#999999', dark: '#666666' },
    'text'
  );

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor,
  };

  if (!uri || hasError) {
    return (
      <View style={[styles.container, containerStyle]}>
        <IconSymbol name={fallbackIcon as any} size={size * 0.5} color={iconColor} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[styles.image, containerStyle]}
      contentFit="cover"
      transition={200}
      onError={() => {
        console.error('[Avatar] Failed to load image:', uri);
        setHasError(true);
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    overflow: 'hidden',
  },
});
