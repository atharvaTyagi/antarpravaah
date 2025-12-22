import { create } from 'zustand';

interface UiState {
  splashComplete: boolean;
  setSplashComplete: (complete: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  splashComplete: false,
  setSplashComplete: (complete) => set({ splashComplete: complete }),
}));


