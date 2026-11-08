import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Haptics are a nice-to-have: skip them on web and never let them throw.
const enabled = Platform.OS !== 'web';

export const haptics = {
  success() {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
  error() {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  },
  tap() {
    if (enabled) Haptics.selectionAsync().catch(() => {});
  },
};
