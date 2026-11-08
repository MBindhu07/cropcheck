import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CropIcon } from '@/components/CropIcon';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { CROP_LABELS, CROP_TYPES } from '@/constants/crops';
import type { QualityGrade } from '@/modules/assessment-feature/types/assessment';
import { spacing } from '@/theme/tokens';

import type { CropFilter, GradeFilter } from '../types/listing';

const GRADES: QualityGrade[] = ['A', 'B', 'C'];

type ListingFiltersProps = {
  crop: CropFilter;
  grade: GradeFilter;
  onCropChange: (crop: CropFilter) => void;
  onGradeChange: (grade: GradeFilter) => void;
};

export function ListingFilters({ crop, grade, onCropChange, onGradeChange }: ListingFiltersProps) {
  return (
    <View style={styles.container}>
      <FilterRow label="Crop">
        <Chip label="All" selected={crop === 'all'} onPress={() => onCropChange('all')} />
        {CROP_TYPES.map((type) => (
          <Chip
            key={type}
            label={CROP_LABELS[type]}
            selected={crop === type}
            onPress={() => onCropChange(type)}
            leading={<CropIcon crop={type} size={24} />}
          />
        ))}
      </FilterRow>
      <FilterRow label="Grade">
        <Chip label="All" selected={grade === 'all'} onPress={() => onGradeChange('all')} />
        {GRADES.map((value) => (
          <Chip
            key={value}
            label={`Grade ${value}`}
            selected={grade === value}
            onPress={() => onGradeChange(value)}
          />
        ))}
      </FilterRow>
    </View>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.row}>
      <AppText variant="overline" tone="subtle" style={styles.label}>
        {label}
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm + 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: 52,
  },
  chips: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
});
