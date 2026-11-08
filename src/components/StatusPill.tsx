import { StyleSheet, View } from 'react-native';

import type { ListingStatus } from '@/modules/listing-feature/types/listing';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

import { AppText } from './ui/AppText';

const statusStyle: Record<ListingStatus, { label: string; fg: string; bg: string }> = {
  available: { label: 'Available', fg: colors.primary, bg: colors.primarySoft },
  sold: { label: 'Sold', fg: colors.inkMuted, bg: colors.surfaceMuted },
};

export function StatusPill({ status }: { status: ListingStatus }) {
  const { label, fg, bg } = statusStyle[status];

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <View style={[styles.dot, { backgroundColor: fg }]} />
      <AppText variant="caption" style={[styles.label, { color: fg }]}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
  },
});
