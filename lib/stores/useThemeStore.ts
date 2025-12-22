import { create } from 'zustand';
import { SectionId } from '../themeConfig';

interface ThemeState {
  currentTheme: SectionId;
  setTheme: (sectionId: SectionId) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: 'hero',
  setTheme: (sectionId: SectionId) => set({ currentTheme: sectionId }),
}));

