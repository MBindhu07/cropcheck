import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { CropIcon } from '@/components/CropIcon';
import { AppText } from '@/components/ui/AppText';
import { CROP_SWATCHES } from '@/constants/crops';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

import type { OnboardingSlide } from '../constants/onboarding-slides';

const backdrop: Record<OnboardingSlide['key'], string> = {
  upload: CROP_SWATCHES.tomato.bg,
  assess: colors.primarySoft,
  publish: CROP_SWATCHES.potato.bg,
};

export function OnboardingIllustration({ slide }: { slide: OnboardingSlide['key'] }) {
  return (
    <View style={[styles.backdrop, { backgroundColor: backdrop[slide] }]}>
      {slide === 'upload' ? <UploadPreview /> : null}
      {slide === 'assess' ? <AssessPreview /> : null}
      {slide === 'publish' ? <PublishPreview /> : null}
    </View>
  );
}

function UploadPreview() {
  return (
    <View style={styles.card}>
      <View style={styles.dropzone}>
        <View style={styles.dropIcon}>
          <Feather name="image" size={22} color={colors.primary} />
        </View>
        <AppText variant="bodyStrong">Add crop photo</AppText>
        <AppText variant="caption" tone="subtle">
          From your gallery
        </AppText>
      </View>
      <View style={styles.fileRow}>
        <CropIcon crop="tomato" size={38} />
        <View style={styles.flex}>
          <AppText variant="caption" style={styles.strong}>
            harvest_tomato.jpg
          </AppText>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '72%' }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

function AssessPreview() {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <AppText variant="overline" tone="subtle">
          Assessment
        </AppText>
        <View style={styles.tag}>
          <AppText variant="overline" style={{ color: colors.notice }}>
            Simulated
          </AppText>
        </View>
      </View>
      <View style={styles.gradeRow}>
        <View style={styles.gradeTile}>
          <AppText style={styles.gradeLetter}>A</AppText>
        </View>
        <View style={styles.flex}>
          <AppText variant="heading">Premium grade</AppText>
          <AppText variant="caption" tone="muted">
            5% defects detected
          </AppText>
        </View>
        <CropIcon crop="onion" size={44} />
      </View>
      <View style={styles.meter}>
        <View style={[styles.meterFill, { width: '5%' }]} />
      </View>
    </View>
  );
}

function PublishPreview() {
  return (
    <View style={styles.card}>
      <View style={styles.listingRow}>
        <CropIcon crop="potato" size={52} />
        <View style={[styles.flex, styles.listingBody]}>
          <AppText variant="heading">Potato</AppText>
          <AppText variant="caption" tone="muted">
            250 kg · ₹18/kg
          </AppText>
        </View>
        <View style={styles.availablePill}>
          <AppText variant="caption" style={styles.availableText}>
            Available
          </AppText>
        </View>
      </View>
      <View style={styles.publishButton}>
        <Feather name="check" size={16} color={colors.inkInverse} />
        <AppText variant="bodyStrong" tone="inverse">
          Published
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    height: 320,
    borderRadius: radius.xl + 6,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: '#3A2E1A',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  flex: {
    flex: 1,
  },
  strong: {
    fontFamily: fonts.semibold,
    color: colors.ink,
  },
  dropzone: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    backgroundColor: colors.background,
  },
  dropIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceMuted,
    marginTop: spacing.xs + 2,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm - 2,
    backgroundColor: colors.noticeSoft,
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  gradeTile: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.gradeASoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeLetter: {
    fontFamily: fonts.extrabold,
    fontSize: 28,
    lineHeight: 32,
    color: colors.gradeA,
  },
  meter: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceMuted,
  },
  meterFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gradeA,
  },
  listingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  listingBody: {
    gap: spacing.xxs,
  },
  availablePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  availableText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primary,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
});
