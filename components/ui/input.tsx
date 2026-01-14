import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  type TextInputProps,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  error?: boolean;
}

export function Input({
  icon,
  rightIcon,
  onRightIconPress,
  error = false,
  style,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const backgroundColor = useThemeColor(
    { light: '#F5F5F5', dark: '#2A2A2A' },
    'background'
  );
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor(
    { light: '#999999', dark: '#666666' },
    'text'
  );
  const tint = useThemeColor({}, 'tint');
  const borderColor = error ? '#FF4444' : isFocused ? tint : 'transparent';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <TextInput
        style={[styles.input, { color: textColor }, style]}
        placeholderTextColor={placeholderColor}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      {rightIcon && (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.rightIconContainer}
          disabled={!onRightIconPress}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
  },
  rightIconContainer: {
    marginLeft: 12,
    padding: 4,
  },
});
