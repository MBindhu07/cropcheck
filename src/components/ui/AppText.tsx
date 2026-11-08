import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, typography } from '@/theme/tokens';

type Variant = keyof typeof typography;
type Tone = 'default' | 'muted' | 'subtle' | 'inverse' | 'primary' | 'danger';

type AppTextProps = TextProps & {
  variant?: Variant;
  tone?: Tone;
};

const toneColor: Record<Tone, string> = {
  default: colors.ink,
  muted: colors.inkMuted,
  subtle: colors.inkSubtle,
  inverse: colors.inkInverse,
  primary: colors.primary,
  danger: colors.danger,
};

export function AppText({ variant = 'body', tone = 'default', style, ...rest }: AppTextProps) {
  return (
    <Text
      {...rest}
      style={[styles.base, typography[variant], { color: toneColor[tone] }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
