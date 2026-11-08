import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { Notice } from '@/components/ui/Notice';
import { AssessmentResultCard } from '@/modules/assessment-feature/components/AssessmentResultCard';
import { ASSESSMENT_SCENARIOS } from '@/modules/assessment-feature/constants/assessment-scenarios';
import type {
  AssessmentScenario,
  CropAssessment,
} from '@/modules/assessment-feature/types/assessment';
import { colors, radius, spacing } from '@/theme/tokens';

type AssessmentPanelProps = {
  hasPhoto: boolean;
  scenario: AssessmentScenario;
  onScenarioChange: (scenario: AssessmentScenario) => void;
  result: CropAssessment | null;
  isAssessing: boolean;
  error: string | null;
  onAssess: () => void;
};

export function AssessmentPanel({
  hasPhoto,
  scenario,
  onScenarioChange,
  result,
  isAssessing,
  error,
  onAssess,
}: AssessmentPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.scenarioBlock}>
        <AppText variant="overline" tone="subtle">
          Demo scenario
        </AppText>
        <View style={styles.chips}>
          {ASSESSMENT_SCENARIOS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={scenario === option.value}
              disabled={isAssessing}
              onPress={() => onScenarioChange(option.value)}
            />
          ))}
        </View>
      </View>

      {isAssessing ? (
        <View style={styles.loading} accessibilityLiveRegion="polite">
          <ActivityIndicator color={colors.primary} />
          <View style={styles.loadingText}>
            <AppText variant="bodyStrong">Assessing your produce</AppText>
            <AppText variant="caption" tone="muted">
              This takes a couple of seconds.
            </AppText>
          </View>
        </View>
      ) : error ? (
        <Notice
          tone="danger"
          icon="alert-triangle"
          title="Assessment failed"
          message={error}
          action={
            <AppButton
              label="Retry"
              icon="rotate-ccw"
              variant="secondary"
              onPress={onAssess}
              style={styles.retryButton}
            />
          }
        />
      ) : result ? (
        <AssessmentResultCard assessment={result} />
      ) : null}

      {!isAssessing && !error ? (
        <AppButton
          label={result ? 'Assess again' : 'Assess quality'}
          icon={result ? 'rotate-ccw' : 'activity'}
          variant={result ? 'secondary' : 'primary'}
          disabled={!hasPhoto}
          onPress={onAssess}
        />
      ) : null}

      {!hasPhoto ? (
        <AppText variant="caption" tone="subtle" style={styles.hint}>
          Add a photo above to run the assessment.
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  scenarioBlock: {
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingText: {
    flex: 1,
    gap: spacing.xxs,
  },
  retryButton: {
    minHeight: 38,
    paddingHorizontal: spacing.md,
  },
  hint: {
    textAlign: 'center',
  },
});
