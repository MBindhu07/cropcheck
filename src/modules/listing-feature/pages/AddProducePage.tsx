import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, type TextInputInstance } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { MarketPriceInsight } from '@/modules/market-feature/components/MarketPriceInsight';
import { useMarketRate } from '@/modules/market-feature/hooks/useMarketRate';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

import { AssessmentPanel } from '../components/AssessmentPanel';
import { CropSelector } from '../components/CropSelector';
import { FormSection } from '../components/FormSection';
import { PhotoPicker } from '../components/PhotoPicker';
import { useCropAssessment } from '../hooks/useCropAssessment';
import { usePickProducePhoto } from '../hooks/usePickProducePhoto';
import { validateProduce, type ProduceFormErrors } from '../schema/produce.schema';
import {
  selectCurrentAssessment,
  useProduceDraftStore,
} from '../store/use-produce-draft-store';

function sanitizeDecimal(value: string) {
  const cleaned = value.replace(',', '.').replace(/[^0-9.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  return rest.length > 0 ? `${whole}.${rest.join('').slice(0, 2)}` : whole;
}

export function AddProducePage() {
  const draft = useProduceDraftStore();
  const assessment = useProduceDraftStore(selectCurrentAssessment);
  const setPhoto = useProduceDraftStore((state) => state.setPhoto);
  const { assess, isAssessing, error: assessError } = useCropAssessment();
  const [errors, setErrors] = useState<ProduceFormErrors>({});
  const [assessmentRequired, setAssessmentRequired] = useState(false);
  const marketRate = useMarketRate(draft.crop, assessment?.grade ?? null);
  const askingPrice = Number(draft.price) || 0;

  const handlePhotoPicked = useCallback(
    (uri: string) => {
      setPhoto(uri);
      setErrors((current) => ({ ...current, photoUri: undefined }));
    },
    [setPhoto],
  );
  const { pickPhoto, isPicking, permissionIssue } = usePickProducePhoto(handlePhotoPicked);
  const priceRef = useRef<TextInputInstance>(null);
  const locationRef = useRef<TextInputInstance>(null);

  const updateField = (field: 'quantity' | 'price' | 'location', value: string) => {
    draft.setField(field, field === 'location' ? value : sanitizeDecimal(value));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleReview = () => {
    const { errors: nextErrors } = validateProduce(draft);
    setErrors(nextErrors);
    setAssessmentRequired(!assessment);

    if (Object.keys(nextErrors).length > 0 || !assessment) return;
    router.push('/produce/review');
  };

  return (
    <Screen
      header={<ScreenHeader title="New listing" />}
      footer={
        <AppButton
          label="Review listing"
          icon="arrow-right"
          iconPosition="trailing"
          onPress={handleReview}
          disabled={isAssessing}
        />
      }
      contentStyle={styles.content}
    >
      <FormSection
        title="Photo"
        description="One photo of the produce you want to sell."
        error={errors.photoUri}
      >
        <PhotoPicker
          photoUri={draft.photoUri}
          onPick={pickPhoto}
          isPicking={isPicking}
          permissionIssue={permissionIssue}
          hasError={Boolean(errors.photoUri)}
        />
      </FormSection>

      <FormSection title="Crop" error={errors.crop}>
        <CropSelector
          value={draft.crop}
          onChange={(crop) => {
            draft.setCrop(crop);
            setErrors((current) => ({ ...current, crop: undefined }));
          }}
          hasError={Boolean(errors.crop)}
        />
      </FormSection>

      <FormSection title="Details">
        <View style={styles.row}>
          <View style={styles.flex}>
            <AppTextInput
              label="Quantity"
              value={draft.quantity}
              onChangeText={(text) => updateField('quantity', text)}
              keyboardType="decimal-pad"
              placeholder="0"
              suffix="kg"
              returnKeyType="next"
              onSubmitEditing={() => priceRef.current?.focus()}
              error={errors.quantity}
            />
          </View>
          <View style={styles.flex}>
            <AppTextInput
              ref={priceRef}
              label="Asking price"
              value={draft.price}
              onChangeText={(text) => updateField('price', text)}
              keyboardType="decimal-pad"
              placeholder="0"
              prefix={<AppText style={styles.rupee}>₹</AppText>}
              suffix="/kg"
              returnKeyType="next"
              onSubmitEditing={() => locationRef.current?.focus()}
              error={errors.price}
            />
          </View>
        </View>
        <AppTextInput
          ref={locationRef}
          label="Location"
          value={draft.location}
          onChangeText={(text) => updateField('location', text)}
          placeholder="Village, district"
          autoCapitalize="words"
          returnKeyType="done"
          error={errors.location}
        />
      </FormSection>

      <FormSection
        title="Quality assessment"
        description="This demo does not analyse your photo. Choose a scenario to simulate the result."
        accessory={
          <View style={styles.simulatedTag}>
            <AppText variant="overline" style={styles.simulatedText}>
              Simulated
            </AppText>
          </View>
        }
        error={
          assessmentRequired && !assessment && !isAssessing
            ? 'Run the assessment for this photo before reviewing.'
            : undefined
        }
      >
        <AssessmentPanel
          hasPhoto={Boolean(draft.photoUri)}
          scenario={draft.scenario}
          onScenarioChange={draft.setScenario}
          result={assessment}
          isAssessing={isAssessing}
          error={assessError}
          onAssess={assess}
        />
      </FormSection>

      {draft.crop && assessment ? (
        <FormSection
          title="Price check"
          description="How your asking price compares with recent rates for this grade."
        >
          <MarketPriceInsight
            rate={marketRate}
            pricePerKg={askingPrice > 0 ? askingPrice : null}
            onUseSuggested={(value) => updateField('price', String(value))}
          />
        </FormSection>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxxl,
    paddingTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  rupee: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.inkMuted,
    marginRight: spacing.xs,
  },
  simulatedTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm - 2,
    backgroundColor: colors.noticeSoft,
  },
  simulatedText: {
    color: colors.notice,
  },
});
