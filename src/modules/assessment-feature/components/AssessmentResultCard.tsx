import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { GRADE_COLORS } from '@/components/GradeBadge';
import { AppText } from '@/components/ui/AppText';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

import { DEFECT_LABELS, GRADE_LABELS } from '../constants/assessment-scenarios';
import type { CropAssessment, DefectBreakdown } from '../types/assessment';

const DEFECT_KEYS = Object.keys(DEFECT_LABELS) as (keyof DefectBreakdown)[];

type AssessmentResultCardProps = {
  assessment: CropAssessment;
  bordered?: boolean;
};

export function AssessmentResultCard({ assessment, bordered = true }: AssessmentResultCardProps) {
  const { fg, bg } = GRADE_COLORS[assessment.grade];
  const { breakdown } = assessment;

  return (
    <View style={[styles.card, bordered && styles.bordered]}>
      <View style={styles.header}>
        <View style={[styles.gradeTile, { backgroundColor: bg }]}>
          <AppText style={[styles.gradeLetter, { color: fg }]}>{assessment.grade}</AppText>
        </View>
        <View style={styles.headerText}>
          <AppText variant="heading">
            Grade {assessment.grade} · {GRADE_LABELS[assessment.grade]}
          </AppText>
          <AppText variant="caption" tone="muted">
            {assessment.defectPercentage}% of the batch shows defects
          </AppText>
        </View>
      </View>

      <View style={styles.meterBlock}>
        <View style={styles.meterLabels}>
          <AppText variant="caption" tone="subtle">
            Defects
          </AppText>
          <AppText variant="caption" style={styles.meterValue}>
            {assessment.defectPercentage}%
          </AppText>
        </View>
        <View style={styles.meterTrack}>
          <View
            style={[
              styles.meterFill,
              { width: `${Math.min(assessment.defectPercentage, 100)}%`, backgroundColor: fg },
            ]}
          />
        </View>
      </View>

      {breakdown ? (
        <View style={styles.breakdown}>
          {DEFECT_KEYS.map((key) => {
            const value = breakdown[key];
            return (
              <View key={key} style={styles.breakdownRow}>
                <AppText variant="caption" tone="muted" style={styles.breakdownLabel}>
                  {DEFECT_LABELS[key]}
                </AppText>
                <View style={styles.breakdownTrack}>
                  <View
                    style={[
                      styles.breakdownFill,
                      // Scaled to 20% so small values are still visible.
                      { width: `${Math.min((value / 20) * 100, 100)}%`, backgroundColor: fg },
                    ]}
                  />
                </View>
                <AppText variant="caption" style={styles.breakdownValue}>
                  {value}%
                </AppText>
              </View>
            );
          })}
        </View>
      ) : null}

      <AppText variant="body" tone="muted">
        {assessment.summary}
      </AppText>

      <View style={styles.footer}>
        <Feather name="info" size={13} color={colors.notice} />
        <AppText variant="caption" style={styles.footerText}>
          Simulated result. The photo was not analysed.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.xxs,
  },
  gradeTile: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeLetter: {
    fontFamily: fonts.extrabold,
    fontSize: 26,
    lineHeight: 30,
  },
  meterBlock: {
    gap: spacing.xs + 2,
  },
  meterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meterValue: {
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  meterTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  meterFill: {
    height: 6,
    borderRadius: 3,
  },
  breakdown: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  breakdownLabel: {
    width: 104,
  },
  breakdownTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: 4,
    borderRadius: 2,
  },
  breakdownValue: {
    width: 32,
    textAlign: 'right',
    fontFamily: fonts.semibold,
    color: colors.ink,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footerText: {
    color: colors.notice,
    flex: 1,
  },
});
