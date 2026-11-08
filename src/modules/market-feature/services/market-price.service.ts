import type { CropType } from '@/constants/crops';
import { delay } from '@/lib/delay';
import type { QualityGrade } from '@/modules/assessment-feature/types/assessment';

import { SAMPLE_MARKET_RATES } from '../constants/market-rates';
import type { MarketRate } from '../types/market';

// Mock: reads from a static table. A real version would call a prices API
// (for example Agmarknet) for the farmer's nearest mandi.
export async function getMarketRate(crop: CropType, grade: QualityGrade): Promise<MarketRate> {
  await delay(400);
  const [minPerKg, maxPerKg] = SAMPLE_MARKET_RATES[crop][grade];
  return { crop, grade, minPerKg, maxPerKg, isSample: true };
}
