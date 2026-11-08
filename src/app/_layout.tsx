import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FlashToast } from '@/components/FlashToast';
import { useStoresHydrated } from '@/hooks/use-stores-hydrated';
import { useAppFlagsStore } from '@/store/use-app-flags-store';
import { useSessionStore } from '@/store/use-session-store';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  const hydrated = useStoresHydrated();
  const hasSeenOnboarding = useAppFlagsStore((state) => state.hasSeenOnboarding);
  const isSignedIn = useSessionStore((state) => state.session !== null);

  const ready = (fontsLoaded || fontError !== null) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Protected guard={!hasSeenOnboarding}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={hasSeenOnboarding && !isSignedIn}>
          <Stack.Screen name="auth" />
        </Stack.Protected>
        <Stack.Protected guard={hasSeenOnboarding && isSignedIn}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
      <FlashToast />
    </SafeAreaProvider>
  );
}
