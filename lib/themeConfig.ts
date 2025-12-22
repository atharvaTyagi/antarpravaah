export type SectionId =
  | 'hero'
  | 'journey'
  | 'work-together'
  | 'voices'
  | 'therapies'
  | 'approach'
  | 'immersions'
  | 'about'
  | 'contact';

export interface Theme {
  bg: string;
  text: string;
  accent: string;
  headerBg?: string; // Header background color for each section
}

export const SECTION_THEMES: Record<SectionId, Theme> = {
  hero: {
    bg: '#6a3f33', // Dark Brown (from Figma design)
    text: '#6a3f33', // Text color on beige background
    accent: '#f6edd0', // Beige background
    headerBg: '#354443', // Dark teal/green
  },
  journey: {
    bg: '#f6edd0', // Light beige (from Figma)
    text: '#354443', // Dark teal text
    accent: '#9ac1bf', // Teal accent
    headerBg: '#354443', // Dark teal/green
  },
  'work-together': {
    bg: '#f6edd0', // Light beige
    text: '#645c42', // Dark brown/yellow
    accent: '#d6c68e', // Light yellow/beige
    headerBg: '#354443', // Dark teal/green
  },
  voices: {
    bg: '#f6edd0', // Base white
    text: '#474e3a', // Deep green
    accent: '#93a378', // Soft green
    headerBg: '#354443', // Keep header consistent
  },
  therapies: {
    bg: '#E8DCC6', // Warm Beige
    text: '#3A3A3A',
    accent: '#A68B5B',
    headerBg: '#D4C4A8', // Lighter beige for header
  },
  approach: {
    bg: '#D4C4A8', // Soft Earth
    text: '#2C2C2C',
    accent: '#8B7355',
    headerBg: '#C4B59A', // Slightly darker earth tone
  },
  immersions: {
    bg: '#1A3A4A', // Deep Ocean
    text: '#E8F4F8',
    accent: '#4A90A4',
    headerBg: '#2A4A5A', // Darker ocean blue
  },
  about: {
    // Figma About page
    bg: '#f6edd0', // Base white
    text: '#474e3a', // Deep green
    accent: '#93a378', // Soft green
    headerBg: '#474e3a', // Deep green header for About
  },
  contact: {
    bg: '#6a3f33', // Dark Brown
    text: '#f6edd0',
    accent: '#9ac1bf',
    headerBg: '#354443', // Dark teal/green
  },
};

