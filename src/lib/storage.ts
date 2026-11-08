import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

export const persistentStorage = createJSONStorage(() => AsyncStorage);

export const STORAGE_KEYS = {
  appFlags: 'cropcheck.app-flags',
  session: 'cropcheck.session',
  listings: 'cropcheck.listings',
} as const;
