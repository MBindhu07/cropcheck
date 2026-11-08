import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing } from '@/theme/tokens';

type DetailItem = {
  label: string;
  value: string;
  emphasis?: boolean;
};

export function DetailList({ items }: { items: DetailItem[] }) {
  return (
    <View style={styles.card}>
      {items.map((item, index) => (
        <View key={item.label} style={[styles.row, index > 0 && styles.rowDivider]}>
          <AppText variant="body" tone="muted">
            {item.label}
          </AppText>
          <AppText
            variant={item.emphasis ? 'heading' : 'bodyStrong'}
            style={styles.value}
            numberOfLines={2}
          >
            {item.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  value: {
    flexShrink: 1,
    textAlign: 'right',
  },
});
