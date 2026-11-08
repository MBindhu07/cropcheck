import type { MarketRate, PriceComparison } from '../types/market';

export function comparePrice(pricePerKg: number, rate: MarketRate): PriceComparison {
  const { minPerKg, maxPerKg } = rate;
  const suggestedPerKg = Math.round((minPerKg + maxPerKg) / 2);

  if (pricePerKg < minPerKg) {
    return {
      position: 'below',
      suggestedPerKg,
      differencePercent: -Math.round(((minPerKg - pricePerKg) / minPerKg) * 100),
    };
  }

  if (pricePerKg > maxPerKg) {
    return {
      position: 'above',
      suggestedPerKg,
      differencePercent: Math.round(((pricePerKg - maxPerKg) / maxPerKg) * 100),
    };
  }

  return { position: 'within', suggestedPerKg, differencePercent: 0 };
}
