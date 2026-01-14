import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { KR } from '@/constants/i18n';

export default function LoginModal() {
  const handleGoogleSignIn = async () => {
    // TODO: Implement Google Sign-In with @react-native-google-signin/google-signin
    // 1. Call GoogleSignin.signIn()
    // 2. Get idToken from response
    // 3. Send to backend for authentication
    // 4. Store tokens and user data
    // 5. Close modal

    // For now, just close the modal
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {KR.auth.login}
          </ThemedText>
          <ThemedText style={styles.description}>
            {KR.auth.loginDescription}
          </ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={KR.auth.googleSignIn}
            onPress={handleGoogleSignIn}
            icon={
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.googleIcon}
                contentFit="contain"
              />
            }
          />
        </View>

        <ThemedText style={styles.disclaimer}>
          로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.5,
    lineHeight: 18,
  },
});
