import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: 'leading' | 'trailing';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
};

const palette: Record<Variant, { bg: string; bgPressed: string; fg: string; border: string }> = {
  primary: {
    bg: colors.primary,
    bgPressed: colors.primaryPressed,
    fg: colors.inkInverse,
    border: colors.primary,
  },
  secondary: {
    bg: colors.surface,
    bgPressed: colors.surfaceMuted,
    fg: colors.ink,
    border: colors.borderStrong,
  },
  ghost: {
    bg: 'transparent',
    bgPressed: colors.surfaceMuted,
    fg: colors.primary,
    border: 'transparent',
  },
  danger: {
    bg: colors.surface,
    bgPressed: colors.dangerSoft,
    fg: colors.danger,
    border: colors.danger,
  },
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'leading',
  loading = false,
  disabled = false,
  style,
  accessibilityHint,
}: AppButtonProps) {
  const tone = palette[variant];
  const isInactive = disabled || loading;
  const iconNode = loading ? (
    <ActivityIndicator size="small" color={tone.fg} />
  ) : icon ? (
    <Feather name={icon} size={18} color={tone.fg} />
  ) : null;
  const trailing = iconPosition === 'trailing' && !loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: pressed ? tone.bgPressed : tone.bg,
          borderColor: tone.border,
        },
        disabled && !loading && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {trailing ? null : iconNode}
        <AppText variant="bodyStrong" style={{ color: tone.fg }}>
          {label}
        </AppText>
        {trailing ? iconNode : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  disabled: {
    opacity: 0.45,
  },
});
