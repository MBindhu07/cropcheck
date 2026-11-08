import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistentStorage, STORAGE_KEYS } from '@/lib/storage';

type AppFlagsState = {
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
};

export const useAppFlagsStore = create<AppFlagsState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
    }),
    { name: STORAGE_KEYS.appFlags, storage: persistentStorage },
  ),
);
