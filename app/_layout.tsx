import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { STORAGE_KEYS } from '@/services/storage/keys';
import { KR } from '@/constants/i18n';
import { AuthProvider } from '@/contexts/auth-context';
import { SubscriptionsProvider } from '@/contexts/subscriptions-context';
import { NotificationsProvider } from '@/contexts/notifications-context';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    checkTutorialStatus();
  }, []);

  const checkTutorialStatus = async () => {
    try {
      const tutorialCompleted = await AsyncStorage.getItem(
        STORAGE_KEYS.TUTORIAL_COMPLETED
      );
      setShowTutorial(tutorialCompleted !== 'true');
    } catch (error) {
      console.error('Failed to check tutorial status:', error);
    } finally {
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    if (!isReady) return;

    const checkAndRedirect = async () => {
      const inOnboarding = segments[0] === '(onboarding)';

      // Re-check AsyncStorage to get the latest value
      const tutorialCompleted = await AsyncStorage.getItem(
        STORAGE_KEYS.TUTORIAL_COMPLETED
      );
      const shouldShowTutorial = tutorialCompleted !== 'true';

      // Update state if changed
      if (shouldShowTutorial !== showTutorial) {
        setShowTutorial(shouldShowTutorial);
      }

      // Only redirect to tutorial if not completed and not already there
      if (shouldShowTutorial && !inOnboarding) {
        router.replace('/(onboarding)/tutorial');
      }
    };

    checkAndRedirect();
  }, [isReady, segments]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <SubscriptionsProvider>
          <NotificationsProvider>
            <Stack>
              <Stack.Screen
                name="(onboarding)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="player/[riotId]"
                options={{
                  headerShown: true,
                  headerTitle: '',
                  headerBackTitle: '',
                  headerTransparent: true,
                }}
              />
              <Stack.Screen
                name="auth/login"
                options={{
                  presentation: 'modal',
                  headerTitle: KR.auth.login,
                }}
              />
            </Stack>
            <StatusBar style="auto" />
          </NotificationsProvider>
        </SubscriptionsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
