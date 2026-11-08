import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistentStorage, STORAGE_KEYS } from '@/lib/storage';

import type { Listing } from '../types/listing';

type ListingsState = {
  listings: Listing[];
  addListing: (listing: Listing) => void;
  markAsSold: (id: string) => void;
  removeListing: (id: string) => void;
};

export const useListingsStore = create<ListingsState>()(
  persist(
    (set) => ({
      listings: [],
      addListing: (listing) => set((state) => ({ listings: [listing, ...state.listings] })),
      markAsSold: (id) =>
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id && listing.status !== 'sold'
              ? { ...listing, status: 'sold', soldAt: new Date().toISOString() }
              : listing,
          ),
        })),
      removeListing: (id) =>
        set((state) => ({ listings: state.listings.filter((listing) => listing.id !== id) })),
    }),
    { name: STORAGE_KEYS.listings, storage: persistentStorage },
  ),
);
