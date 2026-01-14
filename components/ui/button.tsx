import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  icon,
  onPress,
  style,
  ...rest
}: ButtonProps) {
  const tint = useThemeColor({}, 'tint');
  const text = useThemeColor({}, 'text');

  const handlePress = (e: any) => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.(e);
    }
  };

  const getBackgroundColor = () => {
    if (disabled) return '#cccccc';
    switch (variant) {
      case 'primary':
        return tint;
      case 'secondary':
        return '#E8E8E8';
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return tint;
    }
  };

  const getTextColor = () => {
    if (disabled) return '#888888';
    switch (variant) {
      case 'primary':
        return '#ffffff';
      case 'secondary':
        return text;
      case 'outline':
      case 'ghost':
        return tint;
      default:
        return '#ffffff';
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: disabled ? '#cccccc' : tint,
      };
    }
    return {};
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        getBorderStyle(),
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <ThemedText
            style={[
              styles.text,
              { color: getTextColor() },
              icon ? styles.textWithIcon : undefined,
            ]}
          >
            {title}
          </ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textWithIcon: {
    marginLeft: 8,
  },
});
