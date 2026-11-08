import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistentStorage, STORAGE_KEYS } from '@/lib/storage';
import type { AuthSession } from '@/modules/auth-feature/types/auth';

type SessionState = {
  session: AuthSession | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      signIn: (session) => set({ session }),
      signOut: () => set({ session: null }),
    }),
    { name: STORAGE_KEYS.session, storage: persistentStorage },
  ),
);
