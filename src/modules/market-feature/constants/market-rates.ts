import type { CropType } from '@/constants/crops';
import type { QualityGrade } from '@/modules/assessment-feature/types/assessment';

// Hand-picked sample ranges in ₹/kg, roughly in line with wholesale mandi
// prices. Not live data.
export const SAMPLE_MARKET_RATES: Record<CropType, Record<QualityGrade, [number, number]>> = {
  tomato: { A: [22, 28], B: [16, 21], C: [9, 14] },
  potato: { A: [20, 25], B: [15, 19], C: [10, 13] },
  onion: { A: [28, 35], B: [21, 27], C: [13, 18] },
};
