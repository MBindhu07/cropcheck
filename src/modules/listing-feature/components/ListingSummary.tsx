import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { formatCurrency } from '@/lib/format';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

type ListingSummaryProps = {
  total: number;
  available: number;
  sold: number;
  earned: number;
  inStockValue: number;
};

export function ListingSummary({ total, available, sold, earned, inStockValue }: ListingSummaryProps) {
  const listedValue = earned + inStockValue;
  const soldShare = listedValue > 0 ? Math.round((earned / listedValue) * 100) : 0;
  const counts = [
    { label: 'Listed', value: total },
    { label: 'Available', value: available },
    { label: 'Sold', value: sold },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.earnings}>
        <View style={styles.earningsRow}>
          <View style={styles.flex}>
            <AppText variant="caption" style={styles.earningsLabel}>
              Earned
            </AppText>
            <AppText style={styles.earningsValue}>{formatCurrency(earned)}</AppText>
          </View>
          <View style={styles.alignEnd}>
            <AppText variant="caption" style={styles.earningsLabel}>
              Still to sell
            </AppText>
            <AppText style={styles.stockValue}>{formatCurrency(inStockValue)}</AppText>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${soldShare}%` }]} />
        </View>
        <AppText variant="caption" style={styles.earningsLabel}>
          {soldShare}% of your listed value sold
        </AppText>
      </View>

      <View style={styles.counts}>
        {counts.map((item, index) => (
          <View key={item.label} style={[styles.count, index > 0 && styles.divider]}>
            <AppText style={styles.countValue}>{item.value}</AppText>
            <AppText variant="caption" tone="muted">
              {item.label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  earnings: {
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  earningsLabel: {
    color: 'rgba(255, 255, 255, 0.72)',
  },
  earningsValue: {
    fontFamily: fonts.extrabold,
    fontSize: 26,
    lineHeight: 32,
    color: colors.inkInverse,
  },
  stockValue: {
    fontFamily: fonts.bold,
    fontSize: 17,
    lineHeight: 24,
    color: colors.inkInverse,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B9DDA8',
  },
  counts: {
    flexDirection: 'row',
    paddingVertical: spacing.md + 2,
  },
  count: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    gap: spacing.xxs,
  },
  divider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  countValue: {
    fontFamily: fonts.extrabold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.ink,
  },
});
