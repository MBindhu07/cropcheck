import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  hasError?: boolean;
  onComplete?: (value: string) => void;
};

export function OtpInput({ value, onChange, length = 6, hasError = false, onComplete }: OtpInputProps) {
  const [focused, setFocused] = useState(true);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, length);
    onChange(digits);
    if (digits.length === length) onComplete?.(digits);
  };

  const activeIndex = Math.min(value.length, length - 1);

  return (
    <View>
      <View style={styles.row} importantForAccessibility="no-hide-descendants">
        {Array.from({ length }, (_, index) => {
          const digit = value[index] ?? '';
          const isActive = focused && index === activeIndex;
          return (
            <View
              key={index}
              style={[
                styles.cell,
                digit !== '' && styles.cellFilled,
                isActive && styles.cellActive,
                hasError && styles.cellError,
              ]}
            >
              <AppText style={styles.digit}>{digit}</AppText>
            </View>
          );
        })}
      </View>
      <TextInput
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        autoFocus
        caretHidden
        accessibilityLabel="Verification code"
        style={styles.overlayInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cell: {
    flex: 1,
    aspectRatio: 0.86,
    maxHeight: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellFilled: {
    borderColor: colors.borderStrong,
  },
  cellActive: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  cellError: {
    borderColor: colors.danger,
  },
  digit: {
    fontFamily: fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.ink,
  },
  overlayInput: {
    ...StyleSheet.absoluteFill,
    color: 'transparent',
    opacity: 0.02,
  },
});
