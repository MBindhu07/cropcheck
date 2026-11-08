import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { GradeBadge } from '@/components/GradeBadge';
import { StatusPill } from '@/components/StatusPill';
import { AppText } from '@/components/ui/AppText';
import { CROP_LABELS } from '@/constants/crops';
import { formatCurrency, formatQuantity } from '@/lib/format';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

import type { Listing } from '../types/listing';
import { ListingPhoto } from './ListingPhoto';

type ListingCardProps = {
  listing: Listing;
  onPress: () => void;
};

export function ListingCard({ listing, onPress }: ListingCardProps) {
  const isSold = listing.status === 'sold';
  const cropLabel = CROP_LABELS[listing.crop];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${cropLabel}, grade ${listing.assessment.grade}, ${formatQuantity(listing.quantityKg)} at ${formatCurrency(listing.pricePerKg)} per kilogram, ${isSold ? 'sold' : 'available'}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <ListingPhoto photoPath={listing.photoPath} crop={listing.crop} style={styles.photo} dimmed={isSold} />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <AppText variant="heading" numberOfLines={1} style={styles.title}>
            {cropLabel}
          </AppText>
          <StatusPill status={listing.status} />
        </View>

        <View style={styles.metaRow}>
          <AppText variant="bodyStrong" style={styles.price}>
            {formatCurrency(listing.pricePerKg)}
            <AppText variant="caption" tone="subtle">
              {' '}
              /kg
            </AppText>
          </AppText>
          <View style={styles.separator} />
          <AppText variant="caption" tone="muted">
            {formatQuantity(listing.quantityKg)}
          </AppText>
        </View>

        <View style={styles.footerRow}>
          <GradeBadge grade={listing.assessment.grade} />
          <View style={styles.location}>
            <Feather name="map-pin" size={12} color={colors.inkSubtle} />
            <AppText variant="caption" tone="subtle" numberOfLines={1} style={styles.locationText}>
              {listing.location}
            </AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md + 2,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  photo: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.xxs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flexShrink: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  price: {
    fontFamily: fonts.bold,
  },
  separator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.borderStrong,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    flexShrink: 1,
  },
});
