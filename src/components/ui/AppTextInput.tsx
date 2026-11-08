import { useState, type ReactNode, type Ref } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';

import { colors, fonts, radius, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type AppTextInputProps = Omit<TextInputProps, 'ref'> & {
  ref?: Ref<TextInputInstance>;
  label: string;
  error?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: string;
};

export function AppTextInput({
  ref,
  label,
  error,
  hint,
  prefix,
  suffix,
  style,
  onFocus,
  onBlur,
  ...rest
}: AppTextInputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={styles.wrapper}>
      <AppText variant="caption" tone="muted" style={styles.label}>
        {label}
      </AppText>
      <View style={[styles.field, { borderColor }, focused && styles.fieldFocused]}>
        {prefix}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.inkSubtle}
          selectionColor={colors.primary}
          accessibilityLabel={label}
          {...rest}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[styles.input, style]}
        />
        {suffix ? (
          <AppText variant="caption" tone="subtle" style={styles.suffix}>
            {suffix}
          </AppText>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" tone="danger" style={styles.message}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" tone="subtle" style={styles.message}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs + 2,
  },
  label: {
    fontFamily: fonts.semibold,
  },
  field: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
  },
  fieldFocused: {
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: spacing.md,
  },
  suffix: {
    marginLeft: spacing.sm,
  },
  message: {
    marginTop: spacing.xxs,
  },
});
