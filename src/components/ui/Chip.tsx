import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, fonts, radius, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  leading?: ReactNode;
};

export function Chip({ label, selected, onPress, disabled = false, leading }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        leading ? styles.withLeading : null,
        selected ? styles.selected : styles.idle,
        pressed && !selected && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {leading}
      <AppText variant="caption" style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 34,
    paddingHorizontal: spacing.md + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
  },
  withLeading: {
    paddingLeft: spacing.xs + 2,
  },
  idle: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fonts.semibold,
    color: colors.ink,
  },
  labelSelected: {
    color: colors.inkInverse,
  },
});
