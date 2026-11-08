import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { CropIcon } from '@/components/CropIcon';
import { AppText } from '@/components/ui/AppText';
import { CROP_LABELS, CROP_TYPES, type CropType } from '@/constants/crops';
import { haptics } from '@/lib/haptics';
import { colors, radius, spacing } from '@/theme/tokens';

type CropSelectorProps = {
  value: CropType | null;
  onChange: (crop: CropType) => void;
  hasError?: boolean;
};

export function CropSelector({ value, onChange, hasError = false }: CropSelectorProps) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {CROP_TYPES.map((crop) => {
        const selected = value === crop;
        return (
          <Pressable
            key={crop}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={CROP_LABELS[crop]}
            onPress={() => {
              if (!selected) haptics.tap();
              onChange(crop);
            }}
            style={({ pressed }) => [
              styles.option,
              hasError && !value && styles.optionError,
              selected && styles.optionSelected,
              pressed && !selected && styles.optionPressed,
            ]}
          >
            <CropIcon crop={crop} size={56} />
            <AppText variant="bodyStrong">{CROP_LABELS[crop]}</AppText>
            {selected ? (
              <View style={styles.check}>
                <Feather name="check" size={12} color={colors.inkInverse} />
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.ink,
    borderWidth: 1.5,
  },
  optionPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  optionError: {
    borderColor: colors.danger,
  },
  check: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
