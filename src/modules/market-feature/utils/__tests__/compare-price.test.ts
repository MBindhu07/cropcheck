import type { MarketRate } from '../../types/market';
import { comparePrice } from '../compare-price';

const rate: MarketRate = { crop: 'tomato', grade: 'A', minPerKg: 20, maxPerKg: 30, isSample: true };

describe('comparePrice', () => {
  it('treats the range edges as within the market', () => {
    expect(comparePrice(20, rate).position).toBe('within');
    expect(comparePrice(30, rate).position).toBe('within');
  });

  it('measures how far below the minimum a price is', () => {
    expect(comparePrice(15, rate)).toEqual({
      position: 'below',
      suggestedPerKg: 25,
      differencePercent: -25,
    });
  });

  it('measures how far above the maximum a price is', () => {
    expect(comparePrice(36, rate)).toMatchObject({ position: 'above', differencePercent: 20 });
  });
});
