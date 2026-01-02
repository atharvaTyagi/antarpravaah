export type SectionId =
  | 'hero'
  | 'journey'
  | 'work-together'
  | 'voices'
  | 'therapies'
  | 'therapies-intro'
  | 'therapies-asp'
  | 'therapies-modalities'
  | 'therapies-not-sure'
  | 'therapies-come-find-me'
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
  | 'contact'
  | 'contact-info'
  | 'contact-cta'
  | 'faq';

export interface Theme {
  bg: string;
  text: string;
  accent: string;
  headerBg?: string; // Header inner container background color
  headerOuterBg?: string; // Header outer area background color (for blur area)
  headerText?: string; // Explicit header text color override
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
    text: '#354443', // Dark teal text (from Figma)
    accent: '#9ac1bf', // Teal accent (from Figma)
    headerBg: '#354443', // Dark teal header (from Figma)
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  'work-together': {
    bg: '#f6edd0', // Light beige (from Figma)
    text: '#645c42', // Dark brown/yellow (from Figma)
    accent: '#d6c68e', // Light yellow/beige (from Figma)
    headerBg: '#645c42', // Dark brown header (from Figma)
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  voices: {
    bg: '#f6edd0', // Light beige background (matches section background)
    text: '#f6edd0', // Light text for dark cards
    accent: '#93a378', // Soft green accent
    headerBg: '#474e3a', // Dark green header inner (from Figma)
    headerOuterBg: '#f6edd0', // Light beige outer (matches section background)
  },
  therapies: {
    bg: '#f6edd0', // Light beige
    text: '#645c42', // Dark brown/yellow
    accent: '#d6c68e', // Card background
    headerBg: '#645c42', // Dark brown header
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  'therapies-intro': {
    bg: '#f6edd0', // Light beige
    text: '#645c42', // Dark brown/yellow
    accent: '#d6c68e', // Card background
    headerBg: '#645c42', // Dark brown header
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  'therapies-asp': {
    bg: '#f6edd0', // Light beige
    text: '#645c42', // Dark brown/yellow
    accent: '#d6c68e', // Card background
    headerBg: '#645c42', // Dark brown header
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  'therapies-modalities': {
    bg: '#f6edd0', // Light beige
    text: '#645c42', // Dark brown/yellow
    accent: '#d6c68e', // Card background
    headerBg: '#645c42', // Dark brown header
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  'therapies-not-sure': {
    bg: '#f6edd0', // Light beige
    text: '#645c42', // Dark brown/yellow
    accent: '#d6c68e', // Card background
    headerBg: '#645c42', // Dark brown header
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  'therapies-come-find-me': {
    bg: '#f6edd0', // Light beige
    text: '#645c42', // Dark brown/yellow
    accent: '#d6c68e', // Card background
    headerBg: '#645c42', // Dark brown header
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  approach: {
    bg: '#f6edd0', // Base White (from Figma)
    text: '#474e3a', // G800 (from Figma)
    accent: '#9ac1bf', // B500 Teal (from Figma)
    headerBg: '#354443', // Dark teal header (from Figma)
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  'approach-cta': {
    bg: '#f6edd0', // Base White
    text: '#354443', // Dark teal text
    accent: '#9ac1bf', // Teal accent
    headerBg: '#354443', // Dark teal header (from Figma)
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  pathways: {
    bg: '#354443', // Dark teal background
    text: '#f6edd0', // Light text
    accent: '#9ac1bf', // Teal accent
    headerBg: '#9ac1bf', // Teal inner container (inverted for dark section)
    headerOuterBg: '#354443', // Dark teal outer area (matches section bg)
    headerText: '#354443', // Dark text on teal header
  },
  thoughts: {
    bg: '#f6edd0', // Base White
    text: '#354443', // Dark teal text
    accent: '#9ac1bf', // Teal accent
    headerBg: '#354443', // Dark teal header (from Figma)
    headerOuterBg: '#f6edd0', // Light beige outer
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
    headerBg: '#f6edd0', // Light beige inner container (inverted)
    headerOuterBg: '#6a3f33', // Dark brown outer area (inverted)
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
    headerBg: '#f6edd0', // Light beige inner container (inverted)
    headerOuterBg: '#6a3f33', // Dark brown outer area (inverted)
  },
  cta: {
    bg: '#f6edd0', // Light beige background
    text: '#d58761', // Orange text
    accent: '#6a3f33', // Dark brown accent
    headerBg: '#6a3f33', // Dark Brown header (matches immersions theme)
  },
  about: {
    // Figma About page
    bg: '#f6edd0', // Base white
    text: '#93a378', // Soft green text (from Figma)
    accent: '#93a378', // Soft green accent
    headerBg: '#474e3a', // Deep green header (from Figma)
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  contact: {
    bg: '#f6edd0', // Base White/Cream (from Figma)
    text: '#474e3a', // G800 Dark Green (from Figma)
    accent: '#93a378', // G500 Soft Green (from Figma)
    headerBg: '#474e3a', // Dark green header (from Figma)
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  'contact-info': {
    bg: '#f6edd0', // Base White/Cream
    text: '#474e3a', // G800 Dark Green
    accent: '#93a378', // G500 Soft Green
    headerBg: '#474e3a', // Dark green header
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  'contact-cta': {
    bg: '#f6edd0', // Base White/Cream
    text: '#474e3a', // G800 Dark Green
    accent: '#93a378', // G500 Soft Green
    headerBg: '#474e3a', // Dark green header
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  faq: {
    bg: '#f6edd0', // Base White/Cream
    text: '#474e3a', // G800 Dark Green
    accent: '#93a378', // G500 Soft Green
    headerBg: '#474e3a', // Dark green header
    headerOuterBg: '#f6edd0', // Light beige outer
  },
};

