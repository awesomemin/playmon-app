import { StyleSheet, View, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/contexts/auth-context';
import { KR } from '@/constants/i18n';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const iconColor = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');

  const { isAuthenticated, signIn, signOut, isLoading } = useAuth();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await signIn();
      if (!result.success && result.error) {
        Alert.alert('로그인 실패', result.error);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '로그아웃', style: 'destructive', onPress: signOut },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Account Section */}
        <Card style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {KR.settings.account}
          </ThemedText>

          {isAuthenticated ? (
            <View style={styles.accountInfo}>
              <View style={styles.accountDetails}>
                <ThemedText type="defaultSemiBold">로그인됨</ThemedText>
              </View>
              <Button
                title={KR.auth.logout}
                variant="outline"
                onPress={handleLogout}
                style={styles.logoutButton}
              />
            </View>
          ) : (
            <View style={styles.notLoggedIn}>
              <ThemedText style={styles.notLoggedInText}>
                {KR.settings.notLoggedIn}
              </ThemedText>
              <Button
                title={isLoggingIn ? '로그인 중...' : KR.auth.googleSignIn}
                onPress={handleLogin}
                style={styles.loginButton}
                disabled={isLoggingIn || isLoading}
              />
            </View>
          )}
        </Card>

        {/* Notifications Section */}
        <Card style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {KR.settings.notifications}
          </ThemedText>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <IconSymbol name="bell.fill" size={20} color={iconColor} />
              <ThemedText style={styles.settingLabel}>
                {KR.settings.pushNotifications}
              </ThemedText>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#767577', true: tint }}
            />
          </View>
        </Card>

        {/* About Section */}
        <Card style={styles.section}>
          <TouchableOpacity style={styles.linkRow}>
            <ThemedText>{KR.settings.terms}</ThemedText>
            <IconSymbol name="chevron.right" size={16} color={iconColor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow}>
            <ThemedText>{KR.settings.privacy}</ThemedText>
            <IconSymbol name="chevron.right" size={16} color={iconColor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow}>
            <ThemedText>{KR.settings.tutorial}</ThemedText>
            <IconSymbol name="chevron.right" size={16} color={iconColor} />
          </TouchableOpacity>

          <View style={styles.versionRow}>
            <ThemedText style={styles.versionLabel}>{KR.settings.version}</ThemedText>
            <ThemedText style={styles.versionValue}>1.0.0</ThemedText>
          </View>
        </Card>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  accountDetails: {
    flex: 1,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notLoggedIn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  notLoggedInText: {
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    minWidth: 200,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  versionLabel: {
    opacity: 0.7,
  },
  versionValue: {
    opacity: 0.7,
  },
});
