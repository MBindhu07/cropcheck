import { create } from 'zustand';

type FlashState = {
  message: string | null;
  show: (message: string) => void;
  clear: () => void;
};

export const useFlashStore = create<FlashState>()((set) => ({
  message: null,
  show: (message) => set({ message }),
  clear: () => set({ message: null }),
}));
