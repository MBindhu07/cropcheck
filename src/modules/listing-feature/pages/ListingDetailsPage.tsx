import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Share, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { GradeBadge } from '@/components/GradeBadge';
import { StatusPill } from '@/components/StatusPill';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { CROP_LABELS } from '@/constants/crops';
import { confirmAction } from '@/lib/confirm';
import { formatCurrency, formatDate, formatQuantity } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { deleteListingPhoto } from '@/lib/photo-storage';
import { AssessmentResultCard } from '@/modules/assessment-feature/components/AssessmentResultCard';
import { useFlashStore } from '@/store/use-flash-store';
import { colors, radius, spacing } from '@/theme/tokens';

import { DetailList } from '../components/DetailList';
import { ListingPhoto } from '../components/ListingPhoto';
import { useListingsStore } from '../store/use-listings-store';
import { buildShareMessage } from '../utils/share-message';

export function ListingDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listing = useListingsStore((state) => state.listings.find((item) => item.id === id));
  const markAsSold = useListingsStore((state) => state.markAsSold);
  const removeListing = useListingsStore((state) => state.removeListing);
  const showFlash = useFlashStore((state) => state.show);
  const [deleting, setDeleting] = useState(false);

  if (!listing) {
    // After a delete the screen is still animating out; keep it blank rather
    // than flashing "not found".
    if (deleting) return <Screen header={<ScreenHeader title="Listing details" />}>{null}</Screen>;

    return (
      <Screen header={<ScreenHeader title="Listing" />}>
        <EmptyState
          icon="search"
          title="Listing not found"
          message="It may have been removed from this device."
          action={<AppButton label="Back to listings" variant="secondary" onPress={() => router.back()} />}
        />
      </Screen>
    );
  }

  const isSold = listing.status === 'sold';
  const cropLabel = CROP_LABELS[listing.crop];

  const handleMarkSold = async () => {
    const confirmed = await confirmAction({
      title: 'Mark as sold?',
      message: `${cropLabel}, ${formatQuantity(listing.quantityKg)} will be shown as sold on your listings.`,
      confirmLabel: 'Mark as sold',
    });
    if (!confirmed) return;
    markAsSold(listing.id);
    haptics.success();
    showFlash(`${cropLabel} marked as sold`);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: buildShareMessage(listing) });
    } catch {
      showFlash('Sharing is not available on this device');
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirmAction({
      title: 'Delete this listing?',
      message: 'It will be removed from this device. This cannot be undone.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!confirmed) return;

    setDeleting(true);
    router.back();
    removeListing(listing.id);
    deleteListingPhoto(listing.photoPath);
    showFlash(`${cropLabel} listing deleted`);
  };

  return (
    <Screen
      header={
        <ScreenHeader
          title="Listing details"
          right={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Share listing"
              hitSlop={8}
              onPress={handleShare}
              style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
            >
              <Feather name="share-2" size={19} color={colors.ink} />
            </Pressable>
          }
        />
      }
      footer={
        isSold ? (
          <View style={styles.soldBanner}>
            <Feather name="check-circle" size={18} color={colors.inkMuted} />
            <AppText variant="bodyStrong" tone="muted">
              Sold on {listing.soldAt ? formatDate(listing.soldAt) : 'an earlier date'}
            </AppText>
          </View>
        ) : (
          <AppButton label="Mark as sold" icon="check-circle" onPress={handleMarkSold} />
        )
      }
      contentStyle={styles.content}
    >
      <View style={styles.hero}>
        <ListingPhoto photoPath={listing.photoPath} crop={listing.crop} style={styles.photo} dimmed={isSold} />
      </View>

      <View style={styles.titleBlock}>
        <View style={styles.titleRow}>
          <AppText variant="title" style={styles.flex}>
            {cropLabel}
          </AppText>
          <StatusPill status={listing.status} />
        </View>
        <View style={styles.priceRow}>
          <AppText variant="display">{formatCurrency(listing.pricePerKg)}</AppText>
          <AppText variant="body" tone="muted">
            per kg
          </AppText>
        </View>
        <View style={styles.metaRow}>
          <GradeBadge grade={listing.assessment.grade} size="md" />
          <View style={styles.location}>
            <Feather name="map-pin" size={14} color={colors.inkSubtle} />
            <AppText variant="caption" tone="muted" numberOfLines={1} style={styles.flexShrink}>
              {listing.location}
            </AppText>
          </View>
        </View>
      </View>

      <DetailList
        items={[
          { label: 'Quantity', value: formatQuantity(listing.quantityKg) },
          {
            label: 'Estimated value',
            value: formatCurrency(listing.quantityKg * listing.pricePerKg),
          },
          { label: 'Listed on', value: formatDate(listing.createdAt) },
          { label: 'Status', value: isSold ? 'Sold' : 'Available' },
        ]}
      />

      <View style={styles.section}>
        <AppText variant="overline" tone="subtle">
          Assessment
        </AppText>
        <AssessmentResultCard assessment={listing.assessment} />
      </View>

      <AppButton label="Delete listing" icon="trash-2" variant="danger" onPress={handleDelete} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
    paddingTop: spacing.sm,
  },
  hero: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  titleBlock: {
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  flex: {
    flex: 1,
  },
  flexShrink: {
    flexShrink: 1,
  },
  section: {
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  soldBanner: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
});
