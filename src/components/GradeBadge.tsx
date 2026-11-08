import { StyleSheet, View } from 'react-native';

import type { QualityGrade } from '@/modules/assessment-feature/types/assessment';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

import { AppText } from './ui/AppText';

export const GRADE_COLORS: Record<QualityGrade, { fg: string; bg: string }> = {
  A: { fg: colors.gradeA, bg: colors.gradeASoft },
  B: { fg: colors.gradeB, bg: colors.gradeBSoft },
  C: { fg: colors.gradeC, bg: colors.gradeCSoft },
};

type GradeBadgeProps = {
  grade: QualityGrade;
  size?: 'sm' | 'md';
};

export function GradeBadge({ grade, size = 'sm' }: GradeBadgeProps) {
  const { fg, bg } = GRADE_COLORS[grade];

  return (
    <View
      style={[styles.badge, size === 'md' && styles.badgeMd, { backgroundColor: bg }]}
      accessibilityLabel={`Grade ${grade}`}
    >
      <AppText variant="caption" style={[styles.label, { color: fg }]}>
        Grade {grade}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm - 2,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
  },
});
