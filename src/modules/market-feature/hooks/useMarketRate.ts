import { useEffect, useState } from 'react';

import type { CropType } from '@/constants/crops';
import type { QualityGrade } from '@/modules/assessment-feature/types/assessment';

import { getMarketRate } from '../services/market-price.service';
import type { MarketRate } from '../types/market';

export function useMarketRate(crop: CropType | null, grade: QualityGrade | null) {
  const [loaded, setLoaded] = useState<MarketRate | null>(null);

  useEffect(() => {
    if (!crop || !grade) return;
    let cancelled = false;
    getMarketRate(crop, grade)
      .then((rate) => {
        if (!cancelled) setLoaded(rate);
      })
      .catch(() => {
        // The insight is optional, so a failed lookup just hides it.
      });
    return () => {
      cancelled = true;
    };
  }, [crop, grade]);

  // Ignore a rate that was loaded for a previous crop or grade.
  if (!loaded || loaded.crop !== crop || loaded.grade !== grade) return null;
  return loaded;
}
