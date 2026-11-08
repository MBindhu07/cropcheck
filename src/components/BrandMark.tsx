import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

import { AppText } from './ui/AppText';

export function BrandMark() {
  return (
    <View style={styles.row} accessibilityLabel="CropCheck">
      <View style={styles.mark}>
        <Feather name="feather" size={14} color={colors.inkInverse} />
      </View>
      <AppText variant="heading" style={styles.wordmark}>
        CropCheck
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mark: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: 16,
  },
});
