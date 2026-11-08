import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { useAppFlagsStore } from '@/store/use-app-flags-store';
import { colors, radius, spacing } from '@/theme/tokens';

import { OnboardingIllustration } from '../components/OnboardingIllustration';
import { ONBOARDING_SLIDES } from '../constants/onboarding-slides';

export function OnboardingPage() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [index, setIndex] = useState(0);
  const completeOnboarding = useAppFlagsStore((state) => state.completeOnboarding);

  const isLast = index === ONBOARDING_SLIDES.length - 1;

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
      return;
    }
    const next = index + 1;
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
    setIndex(next);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <BrandMark />
        {!isLast ? (
          <Pressable
            accessibilityRole="button"
            onPress={completeOnboarding}
            hitSlop={12}
            style={({ pressed }) => [styles.skip, pressed && styles.skipPressed]}
          >
            <AppText variant="bodyStrong" tone="muted">
              Skip
            </AppText>
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        style={styles.pager}
      >
        {ONBOARDING_SLIDES.map((slide, slideIndex) => (
          <View key={slide.key} style={[styles.slide, { width }]}>
            <OnboardingIllustration slide={slide.key} />
            <View style={styles.copy}>
              <AppText variant="overline" tone="primary">
                Step {slideIndex + 1} of {ONBOARDING_SLIDES.length}
              </AppText>
              <AppText variant="display">{slide.title}</AppText>
              <AppText variant="body" tone="muted">
                {slide.body}
              </AppText>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots} accessibilityLabel={`Step ${index + 1} of ${ONBOARDING_SLIDES.length}`}>
          {ONBOARDING_SLIDES.map((slide, dotIndex) => (
            <View key={slide.key} style={[styles.dot, dotIndex === index && styles.dotActive]} />
          ))}
        </View>
        <AppButton
          label={isLast ? 'Get started' : 'Next'}
          icon={isLast ? undefined : 'arrow-right'}
          iconPosition="trailing"
          onPress={handleNext}
          style={styles.cta}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  skip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  skipPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  pager: {
    flex: 1,
  },
  slide: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.xxxl,
  },
  copy: {
    gap: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderStrong,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  cta: {
    minWidth: 150,
  },
});
