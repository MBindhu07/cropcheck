import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { GradeBadge } from '@/components/GradeBadge';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Notice } from '@/components/ui/Notice';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { CROP_LABELS } from '@/constants/crops';
import { createId, formatCurrency, formatQuantity } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { persistListingPhoto } from '@/lib/photo-storage';
import { AssessmentResultCard } from '@/modules/assessment-feature/components/AssessmentResultCard';
import { MarketPriceInsight } from '@/modules/market-feature/components/MarketPriceInsight';
import { useMarketRate } from '@/modules/market-feature/hooks/useMarketRate';
import { useFlashStore } from '@/store/use-flash-store';
import { colors, radius, spacing } from '@/theme/tokens';

import { DetailList } from '../components/DetailList';
import { validateProduce } from '../schema/produce.schema';
import { useListingsStore } from '../store/use-listings-store';
import {
  selectCurrentAssessment,
  useProduceDraftStore,
} from '../store/use-produce-draft-store';

export function ReviewListingPage() {
  const draft = useProduceDraftStore();
  const assessment = useProduceDraftStore(selectCurrentAssessment);
  const addListing = useListingsStore((state) => state.addListing);
  const showFlash = useFlashStore((state) => state.show);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const { data } = validateProduce(draft);
  const marketRate = useMarketRate(data?.crop ?? null, assessment?.grade ?? null);

  if (!data || !assessment) {
    return (
      <Screen header={<ScreenHeader title="Review listing" />}>
        <Notice
          tone="neutral"
          title="Nothing to review yet"
          message="Fill in the produce details and run the assessment first."
          action={<AppButton label="Back to the form" variant="secondary" onPress={() => router.back()} />}
        />
      </Screen>
    );
  }

  const handlePublish = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setPublishing(true);
    setPublishError(null);

    try {
      const id = createId();
      const photoPath = await persistListingPhoto(data.photoUri, id);
      addListing({
        id,
        crop: data.crop,
        quantityKg: data.quantity,
        pricePerKg: data.price,
        location: data.location,
        photoPath,
        assessment,
        status: 'available',
        createdAt: new Date().toISOString(),
      });
      haptics.success();
      showFlash(`${CROP_LABELS[data.crop]} listing published`);
      router.dismissTo('/');
    } catch {
      haptics.error();
      setPublishError('The photo could not be saved on this device. Try publishing again.');
      inFlight.current = false;
      setPublishing(false);
    }
  };

  return (
    <Screen
      header={<ScreenHeader title="Review listing" />}
      footer={
        <View style={styles.actions}>
          <AppButton
            label="Edit details"
            variant="secondary"
            onPress={() => router.back()}
            disabled={publishing}
            style={styles.flex}
          />
          <AppButton
            label="Publish"
            icon="check"
            onPress={handlePublish}
            loading={publishing}
            style={styles.flex}
          />
        </View>
      }
      contentStyle={styles.content}
    >
      <View style={styles.hero}>
        <Image source={{ uri: data.photoUri }} style={styles.photo} contentFit="cover" />
      </View>

      <View style={styles.titleBlock}>
        <View style={styles.titleRow}>
          <AppText variant="title">{CROP_LABELS[data.crop]}</AppText>
          <GradeBadge grade={assessment.grade} size="md" />
        </View>
        <AppText variant="body" tone="muted">
          Check everything below. Buyers will see this listing exactly as shown.
        </AppText>
      </View>

      <DetailList
        items={[
          { label: 'Quantity', value: formatQuantity(data.quantity) },
          { label: 'Asking price', value: `${formatCurrency(data.price)} / kg` },
          { label: 'Location', value: data.location },
          {
            label: 'Estimated value',
            value: formatCurrency(data.quantity * data.price),
            emphasis: true,
          },
        ]}
      />

      <View style={styles.section}>
        <AppText variant="overline" tone="subtle">
          Price check
        </AppText>
        <MarketPriceInsight rate={marketRate} pricePerKg={data.price} />
      </View>

      <View style={styles.section}>
        <AppText variant="overline" tone="subtle">
          Assessment
        </AppText>
        <AssessmentResultCard assessment={assessment} />
      </View>

      {publishError ? <Notice tone="danger" icon="alert-triangle" message={publishError} /> : null}
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
    aspectRatio: 16 / 10,
  },
  titleBlock: {
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  section: {
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
});
