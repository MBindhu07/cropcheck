import type { CropType } from '@/constants/crops';
import type { QualityGrade } from '@/modules/assessment-feature/types/assessment';

export type MarketRate = {
  crop: CropType;
  grade: QualityGrade;
  minPerKg: number;
  maxPerKg: number;
  isSample: true;
};

export type PricePosition = 'below' | 'within' | 'above';

export type PriceComparison = {
  position: PricePosition;
  suggestedPerKg: number;
  // Signed: negative means below the range, positive means above.
  differencePercent: number;
};
