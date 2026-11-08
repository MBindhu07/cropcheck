import { Feather } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

import { AppText } from './ui/AppText';

type EmptyStateProps = {
  icon?: keyof typeof Feather.glyphMap;
  art?: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ icon = 'inbox', art, title, message, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {art ?? (
        <View style={styles.iconWrap}>
          <Feather name={icon} size={26} color={colors.primary} />
        </View>
      )}
      <AppText variant="heading" style={styles.center}>
        {title}
      </AppText>
      <AppText variant="body" tone="muted" style={[styles.center, styles.message]}>
        {message}
      </AppText>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  center: {
    textAlign: 'center',
  },
  message: {
    maxWidth: 300,
  },
  action: {
    marginTop: spacing.md,
  },
});
