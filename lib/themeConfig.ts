export type SectionId =
  | 'hero'
  | 'journey'
  | 'work-together'
  | 'voices'
  | 'therapies'
  | 'approach'
  | 'approach-cta'
  | 'pathways'
  | 'thoughts'
  | 'immersions'
  | 'immersions-intro'
  | 'immersions-listings'
  | 'trainings-intro'
  | 'trainings-listings'
  | 'cta'
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
    bg: '#f6edd0', // Base White (from Figma)
    text: '#474e3a', // G800 (from Figma)
    accent: '#9ac1bf', // B500 Teal (from Figma)
    headerBg: '#354443', // B800 Dark Teal (from Figma)
  },
  'approach-cta': {
    bg: '#f6edd0', // Base White
    text: '#354443', // Dark teal text
    accent: '#9ac1bf', // Teal accent
    headerBg: '#354443', // Dark teal header
  },
  pathways: {
    bg: '#354443', // Dark teal background
    text: '#f6edd0', // Light text
    accent: '#9ac1bf', // Teal accent
    headerBg: '#354443', // Dark teal header
  },
  thoughts: {
    bg: '#f6edd0', // Base White
    text: '#354443', // Dark teal text
    accent: '#9ac1bf', // Teal accent
    headerBg: '#354443', // Dark teal header
  },
  immersions: {
    bg: '#f6edd0', // Base White (from Figma)
    text: '#6a3f33', // O800 Dark Brown (from Figma)
    accent: '#d58761', // O500 Accent (from Figma)
    headerBg: '#6a3f33', // Dark Brown Header (from Figma)
  },
  'immersions-intro': {
    bg: '#f6edd0', // Base White
    text: '#6a3f33', // Dark Brown
    accent: '#d58761', // Accent
    headerBg: '#6a3f33', // Dark Brown Header
  },
  'immersions-listings': {
    bg: '#6a3f33', // Dark Brown
    text: '#d58761', // Accent
    accent: '#f6edd0', // Light
    headerBg: '#6a3f33', // Dark Brown Header
  },
  'trainings-intro': {
    bg: '#f6edd0', // Base White
    text: '#000000', // Black
    accent: '#d58761', // Accent
    headerBg: '#6a3f33', // Dark Brown Header
  },
  'trainings-listings': {
    bg: '#6a3f33', // Dark Brown
    text: '#d58761', // Accent
    accent: '#f6edd0', // Light
    headerBg: '#6a3f33', // Dark Brown Header
  },
  cta: {
    bg: '#f6edd0', // Base White
    text: '#d58761', // Accent
    accent: '#6a3f33', // Dark Brown
    headerBg: '#6a3f33', // Dark Brown Header
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

