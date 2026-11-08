import { useSyncExternalStore } from 'react';

import { useListingsStore } from '@/modules/listing-feature/store/use-listings-store';
import { useAppFlagsStore } from '@/store/use-app-flags-store';
import { useSessionStore } from '@/store/use-session-store';

const persistedStores = [useAppFlagsStore, useSessionStore, useListingsStore];

function allHydrated() {
  return persistedStores.every((store) => store.persist.hasHydrated());
}

function subscribe(onChange: () => void) {
  const unsubscribers = persistedStores.map((store) => store.persist.onFinishHydration(onChange));
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}

export function useStoresHydrated() {
  return useSyncExternalStore(subscribe, allHydrated, allHydrated);
}
