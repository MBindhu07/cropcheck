import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { CROP_LABELS } from '@/constants/crops';
import { formatCurrency } from '@/lib/format';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

import type { MarketRate } from '../types/market';
import { comparePrice } from '../utils/compare-price';

type MarketPriceInsightProps = {
  rate: MarketRate | null;
  pricePerKg: number | null;
  onUseSuggested?: (pricePerKg: number) => void;
};

export function MarketPriceInsight({ rate, pricePerKg, onUseSuggested }: MarketPriceInsightProps) {
  if (!rate) {
    return (
      <View style={[styles.card, styles.loading]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <AppText variant="caption" tone="muted">
          Checking market rates…
        </AppText>
      </View>
    );
  }

  const comparison = pricePerKg ? comparePrice(pricePerKg, rate) : null;

  // The bar runs from half the minimum to 1.5x the maximum so the range sits
  // in the middle and prices outside it still have room.
  const scaleMin = rate.minPerKg * 0.5;
  const scaleMax = rate.maxPerKg * 1.5;
  const toPercent = (value: number) =>
    Math.min(Math.max(((value - scaleMin) / (scaleMax - scaleMin)) * 100, 0), 100);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconTile}>
          <Feather name="trending-up" size={16} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <AppText variant="bodyStrong">
            {formatCurrency(rate.minPerKg)} – {formatCurrency(rate.maxPerKg)}
            <AppText variant="caption" tone="subtle">
              {' '}
              /kg
            </AppText>
          </AppText>
          <AppText variant="caption" tone="muted">
            Typical rate for grade {rate.grade} {CROP_LABELS[rate.crop].toLowerCase()}
          </AppText>
        </View>
        <View style={styles.sampleTag}>
          <AppText variant="overline" style={styles.sampleText}>
            Sample data
          </AppText>
        </View>
      </View>

      <View style={styles.scale}>
        <View style={styles.track} />
        <View
          style={[
            styles.range,
            {
              left: `${toPercent(rate.minPerKg)}%`,
              width: `${toPercent(rate.maxPerKg) - toPercent(rate.minPerKg)}%`,
            },
          ]}
        />
        {pricePerKg ? (
          <View style={[styles.marker, { left: `${toPercent(pricePerKg)}%` }]} />
        ) : null}
      </View>

      {comparison ? (
        <View style={styles.verdict}>
          <Feather
            name={comparison.position === 'within' ? 'check-circle' : 'alert-circle'}
            size={15}
            color={comparison.position === 'within' ? colors.primary : colors.notice}
          />
          <AppText
            variant="caption"
            style={[
              styles.flex,
              styles.verdictText,
              { color: comparison.position === 'within' ? colors.primary : colors.notice },
            ]}
          >
            {comparison.position === 'within'
              ? 'Your price is in line with the market.'
              : comparison.position === 'below'
                ? `About ${Math.abs(comparison.differencePercent)}% below the usual range. You could ask for more.`
                : `About ${comparison.differencePercent}% above the usual range. It may take longer to sell.`}
          </AppText>
        </View>
      ) : (
        <AppText variant="caption" tone="muted">
          Enter your asking price to compare it with the market.
        </AppText>
      )}

      {comparison && comparison.position !== 'within' && onUseSuggested ? (
        <AppButton
          label={`Use ${formatCurrency(comparison.suggestedPerKg)}/kg`}
          variant="secondary"
          onPress={() => onUseSuggested(comparison.suggestedPerKg)}
          style={styles.suggestButton}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  sampleTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm - 2,
    backgroundColor: colors.noticeSoft,
  },
  sampleText: {
    color: colors.notice,
  },
  scale: {
    height: 14,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceMuted,
  },
  range: {
    position: 'absolute',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    opacity: 0.35,
  },
  marker: {
    position: 'absolute',
    width: 14,
    height: 14,
    marginLeft: -7,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: colors.surface,
    backgroundColor: colors.ink,
  },
  verdict: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs + 2,
  },
  verdictText: {
    fontFamily: fonts.semibold,
  },
  suggestButton: {
    minHeight: 40,
  },
});
