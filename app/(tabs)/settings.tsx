import { StyleSheet, View, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { KR } from '@/constants/i18n';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const iconColor = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');

  // TODO: Replace with actual auth state from context
  const isAuthenticated = false;
  const user = null;

  const handleLogin = () => {
    // TODO: Open login modal
  };

  const handleLogout = () => {
    // TODO: Sign out
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Account Section */}
        <Card style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {KR.settings.account}
          </ThemedText>

          {isAuthenticated && user ? (
            <View style={styles.accountInfo}>
              <Avatar uri={null} size={56} />
              <View style={styles.accountDetails}>
                <ThemedText type="defaultSemiBold">User Name</ThemedText>
                <ThemedText style={styles.email}>user@email.com</ThemedText>
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
                title={KR.auth.googleSignIn}
                onPress={handleLogin}
                style={styles.loginButton}
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
    gap: 16,
  },
  accountDetails: {
    flex: 1,
  },
  email: {
    opacity: 0.7,
    fontSize: 14,
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
