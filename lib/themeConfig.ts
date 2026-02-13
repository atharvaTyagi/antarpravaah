export type SectionId =
  | 'hero'
  | 'journey'
  | 'journey-footer'
  | 'work-together'
  | 'voices'
  | 'voices-footer'
  | 'ready-to-begin'
  | 'therapies'
  | 'therapies-intro'
  | 'therapies-asp'
  | 'therapies-modalities'
  | 'therapies-not-sure'
  | 'therapies-come-find-me'
  | 'therapies-footer'
  | 'approach'
  | 'approach-cta'
  | 'approach-footer'
  | 'pathways'
  | 'thoughts'
  | 'immersions'
  | 'immersions-intro'
  | 'immersions-listings'
  | 'trainings-intro'
  | 'trainings-listings'
  | 'cta'
  | 'immersions-footer'
  | 'about'
  | 'about-intro'
  | 'about-body'
  | 'about-cta'
  | 'about-footer'
  | 'inspiration'
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
  logoFilter?: string; // CSS filter for logo (e.g. to tint to #6a3f33)
  logoColor?: string; // Exact logo color when using inline SVG (e.g. #9ac1bf)
}

export const SECTION_THEMES: Record<SectionId, Theme> = {
  hero: {
    bg: '#6a3f33', // Dark Brown (splash section background)
    text: '#6a3f33', // Text color on beige background
    accent: '#f6edd0', // Beige background
    headerBg: '#d88762', // Warm orange/copper header when splash visible
    headerOuterBg: '#6a3f33', // Dark brown - splash section background
    headerText: '#6a3f33', // Dark brown text and logo on header
    logoFilter: 'brightness(0) saturate(100%) invert(18%) sepia(28%) saturate(2500%) hue-rotate(350deg) brightness(94%) contrast(92%)', // #6a3f33
  },
  journey: {
    bg: '#f6edd0', // Light beige (from Figma)
    text: '#354443', // Dark teal text (from Figma)
    accent: '#9ac1bf', // Teal accent (from Figma)
    headerBg: '#354443', // Dark teal header (from Figma)
    headerOuterBg: '#f6edd0', // Light beige outer
    headerText: '#9ac1bf', // Teal nav text and logo in journey section
    logoColor: '#9ac1bf', // Exact teal logo color (inline SVG, no filter)
  },
  'journey-footer': {
    bg: '#354443', // Dark teal background (footer bg)
    text: '#9ac1bf', // Teal text
    accent: '#f6edd0', // Light beige accent
    headerBg: '#9ac1bf', // Light teal header (light on dark section)
    headerOuterBg: '#354443', // Dark teal outer (matches footer bg)
    headerText: '#354443', // Dark text on light header
  },
  'work-together': {
    bg: '#f6edd0', // Light beige (from Figma)
    text: '#645c42', // Dark brown/yellow (from Figma)
    accent: '#d6c68e', // Light yellow/beige (from Figma)
    headerBg: '#645c42', // Dark brown header (from Figma)
    headerOuterBg: '#f6edd0', // Light beige outer
    headerText: '#d6c68e', // Gold nav text and logo
    logoColor: '#d6c68e', // Exact gold logo color (inline SVG)
  },
  voices: {
    bg: '#f6edd0', // Light beige background (matches section background)
    text: '#f6edd0', // Light text for dark cards
    accent: '#93a378', // Soft green accent
    headerBg: '#474e3a', // Dark green header inner (from Figma)
    headerOuterBg: '#f6edd0', // Light beige outer (matches section background)
    headerText: '#93a378', // Soft green nav text and logo
    logoColor: '#93a378', // Soft green logo (inline SVG)
  },
  'voices-footer': {
    bg: '#474e3a', // Dark green background (matches voices section header/dark accent)
    text: '#93a378', // Soft green text
    accent: '#f6edd0', // Light beige accent
    headerBg: '#93a378', // Soft green header when footer visible
    headerOuterBg: '#474e3a', // Dark green outer (matches footer bg)
    headerText: '#474e3a', // Dark text on light header when footer visible
    logoColor: '#474e3a', // Dark green logo when footer visible (inline SVG)
  },
  'ready-to-begin': {
    bg: '#f6edd0', // Light beige background
    text: '#93a378', // Soft green text
    accent: '#474e3a', // Dark green accent
    headerBg: '#474e3a', // Dark green header
    headerOuterBg: '#f6edd0', // Light beige outer
    headerText: '#93a378', // Same as voices: soft green nav text and logo
    logoColor: '#93a378', // Same as voices: soft green logo (inline SVG)
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
  'therapies-footer': {
    bg: '#645c42', // Dark brown background (footer bg)
    text: '#d6c68e', // Light gold text
    accent: '#f6edd0', // Light beige accent
    headerBg: '#d6c68e', // Light gold header (light on dark section)
    headerOuterBg: '#645c42', // Dark brown outer (matches footer bg)
    headerText: '#645c42', // Dark brown text on light header
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
  'approach-footer': {
    bg: '#354443', // Dark teal background (footer bg)
    text: '#9ac1bf', // Teal text
    accent: '#f6edd0', // Light beige accent
    headerBg: '#9ac1bf', // Light teal header (light on dark section)
    headerOuterBg: '#354443', // Dark teal outer (matches footer bg)
    headerText: '#354443', // Dark text on light header
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
  'immersions-footer': {
    bg: '#6a3f33', // Dark brown background (footer bg)
    text: '#d58761', // Orange text
    accent: '#f6edd0', // Light beige accent
    headerBg: '#f6edd0', // Light beige header (light on dark section)
    headerOuterBg: '#6a3f33', // Dark brown outer (matches footer bg)
    headerText: '#6a3f33', // Dark brown text on light header
  },
  about: {
    // Figma About page
    bg: '#f6edd0', // Base white
    text: '#93a378', // Soft green text (from Figma)
    accent: '#93a378', // Soft green accent
    headerBg: '#474e3a', // Deep green header (from Figma)
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  'about-intro': {
    bg: '#f6edd0', // Base white
    text: '#93a378', // Soft green text
    accent: '#93a378', // Soft green accent
    headerBg: '#474e3a', // Deep green header
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  'about-body': {
    bg: '#474e3a', // Deep green background
    text: '#f6edd0', // Light text
    accent: '#93a378', // Soft green accent
    headerBg: '#93a378', // Soft green header (inverted)
    headerOuterBg: '#474e3a', // Deep green outer
    headerText: '#474e3a', // Dark text on light header
  },
  'about-cta': {
    bg: '#f6edd0', // Base white
    text: '#93a378', // Soft green text
    accent: '#474e3a', // Deep green accent
    headerBg: '#474e3a', // Deep green header
    headerOuterBg: '#f6edd0', // Light beige outer
  },
  'about-footer': {
    bg: '#474e3a', // Deep green background (footer bg)
    text: '#93a378', // Soft green text
    accent: '#f6edd0', // Light beige accent
    headerBg: '#93a378', // Light green header (light on dark section)
    headerOuterBg: '#474e3a', // Deep green outer (matches footer bg)
    headerText: '#474e3a', // Dark green text on light header
  },
  inspiration: {
    bg: '#f6edd0', // Base white (section bg, card is green)
    text: '#474e3a', // Deep green text
    accent: '#93a378', // Soft green accent
    headerBg: '#474e3a', // Deep green header
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

