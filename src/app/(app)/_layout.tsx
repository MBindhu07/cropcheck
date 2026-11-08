import { Stack } from 'expo-router';

import { colors } from '@/theme/tokens';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="produce/new" />
      <Stack.Screen name="produce/review" />
      <Stack.Screen name="listing/[id]" />
    </Stack>
  );
}
