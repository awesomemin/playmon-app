import { useState, useRef } from 'react';
import {
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { STORAGE_KEYS } from '@/services/storage/keys';
import { KR } from '@/constants/i18n';

const { width } = Dimensions.get('window');

const TUTORIAL_ICONS = [
  'magnifyingglass',
  'person.crop.circle',
  'bell.badge',
  'app.badge',
] as const;

export default function TutorialScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const slides = KR.tutorial.slides;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      Haptics.selectionAsync();
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeTutorial();
    }
  };

  const handleSkip = () => {
    completeTutorial();
  };

  const completeTutorial = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.TUTORIAL_COMPLETED, 'true');
    router.replace('/(tabs)');
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <ThemedView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: tintColor }]}>
              <IconSymbol
                name={TUTORIAL_ICONS[index] as any}
                size={64}
                color="#FFFFFF"
              />
            </View>
            <ThemedText type="title" style={styles.title}>
              {item.title}
            </ThemedText>
            <ThemedText style={styles.description}>{item.description}</ThemedText>
          </View>
        )}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex ? tintColor : iconColor,
                opacity: index === currentIndex ? 1 : 0.3,
              },
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <ThemedText style={styles.skipText}>{KR.tutorial.skip}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.nextButton, { backgroundColor: tintColor }]}
        >
          <ThemedText style={styles.nextText}>
            {isLastSlide ? KR.tutorial.start : KR.tutorial.next}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 26,
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  skipButton: {
    padding: 16,
  },
  skipText: {
    opacity: 0.7,
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
  },
});
