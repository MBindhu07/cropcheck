import { Feather } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Tone = 'notice' | 'danger' | 'neutral';

type NoticeProps = {
  title?: string;
  message: string;
  tone?: Tone;
  icon?: keyof typeof Feather.glyphMap;
  action?: ReactNode;
};

const palette: Record<Tone, { bg: string; fg: string }> = {
  notice: { bg: colors.noticeSoft, fg: colors.notice },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  neutral: { bg: colors.surfaceMuted, fg: colors.inkMuted },
};

export function Notice({ title, message, tone = 'notice', icon = 'info', action }: NoticeProps) {
  const { bg, fg } = palette[tone];

  return (
    <View style={[styles.container, { backgroundColor: bg }]} accessibilityRole="summary">
      <Feather name={icon} size={16} color={fg} style={styles.icon} />
      <View style={styles.body}>
        {title ? (
          <AppText variant="bodyStrong" style={{ color: fg }}>
            {title}
          </AppText>
        ) : null}
        <AppText variant="caption" style={{ color: fg }}>
          {message}
        </AppText>
        {action ? <View style={styles.action}>{action}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
    padding: spacing.md + 2,
    borderRadius: radius.md,
  },
  icon: {
    marginTop: 2,
  },
  body: {
    flex: 1,
    gap: spacing.xxs,
  },
  action: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
});
