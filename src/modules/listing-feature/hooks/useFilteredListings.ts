import { useMemo } from 'react';

import { useListingsStore } from '../store/use-listings-store';
import type { CropFilter, GradeFilter, Listing } from '../types/listing';

const valueOf = (listing: Listing) => listing.quantityKg * listing.pricePerKg;

export function useFilteredListings(crop: CropFilter, grade: GradeFilter) {
  const listings = useListingsStore((state) => state.listings);

  return useMemo(() => {
    const filtered = listings.filter(
      (listing) =>
        (crop === 'all' || listing.crop === crop) &&
        (grade === 'all' || listing.assessment.grade === grade),
    );

    let sold = 0;
    let earned = 0;
    let inStockValue = 0;
    for (const listing of listings) {
      if (listing.status === 'sold') {
        sold += 1;
        earned += valueOf(listing);
      } else {
        inStockValue += valueOf(listing);
      }
    }

    return {
      all: listings,
      filtered,
      totals: {
        total: listings.length,
        available: listings.length - sold,
        sold,
        earned,
        inStockValue,
      },
    };
  }, [listings, crop, grade]);
}
