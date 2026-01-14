import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { STORAGE_KEYS } from '@/services/storage/keys';
import { authApi } from '@/services/api/auth';
import { useAuth } from './auth-context';

// Check if we're running in Expo Go (notifications not supported in SDK 53+)
const isExpoGo = Constants.appOwnership === 'expo';

// Conditionally import notifications - will be null in Expo Go
let Notifications: typeof import('expo-notifications') | null = null;
let Device: typeof import('expo-device') | null = null;

if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
    Device = require('expo-device');

    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (e) {
    console.warn('expo-notifications not available:', e);
  }
}

interface NotificationsContextValue {
  expoPushToken: string | null;
  hasPermission: boolean;
  isSupported: boolean;
  registerForPushNotifications: () => Promise<string | null>;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(
  undefined
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const isSupported = !isExpoGo && Notifications !== null;

  useEffect(() => {
    if (!isSupported) {
      console.log('Push notifications not supported in Expo Go. Use a development build to test notifications.');
      return;
    }

    // Load cached token
    AsyncStorage.getItem(STORAGE_KEYS.PUSH_TOKEN).then((token) => {
      if (token) {
        setExpoPushToken(token);
        setHasPermission(true);
      }
    });

    // Set up notification listeners
    const receiveSubscription = Notifications!.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    const responseSubscription =
      Notifications!.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as any;

        // Navigate to player profile when notification is tapped
        if (data?.riotId) {
          const encodedRiotId = encodeURIComponent(data.riotId);
          router.push(`/player/${encodedRiotId}`);
        }
      });

    return () => {
      receiveSubscription.remove();
      responseSubscription.remove();
    };
  }, [isSupported]);

  // Register push token with backend when authenticated
  useEffect(() => {
    if (isAuthenticated && expoPushToken) {
      authApi.registerPushToken(expoPushToken).catch((err) => {
        console.error('Failed to register push token:', err);
      });
    }
  }, [isAuthenticated, expoPushToken]);

  const registerForPushNotifications = useCallback(async (): Promise<
    string | null
  > => {
    if (!isSupported || !Notifications || !Device) {
      console.warn('Push notifications not supported in Expo Go');
      return null;
    }

    if (!Device.isDevice) {
      console.warn('Push notifications require a physical device');
      return null;
    }

    // Set up Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('match-start', {
        name: '게임 시작 알림',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0a7ea4',
        sound: 'default',
      });
    }

    // Check existing permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      setHasPermission(false);
      return null;
    }

    setHasPermission(true);

    // Get Expo push token
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        console.warn('Project ID not found for push notifications');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      const token = tokenData.data;

      setExpoPushToken(token);
      await AsyncStorage.setItem(STORAGE_KEYS.PUSH_TOKEN, token);

      return token;
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
    }
  }, [isSupported]);

  return (
    <NotificationsContext.Provider
      value={{
        expoPushToken,
        hasPermission,
        isSupported,
        registerForPushNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within NotificationsProvider'
    );
  }
  return context;
}
