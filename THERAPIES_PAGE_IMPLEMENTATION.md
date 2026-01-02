# Therapies Page Implementation Summary

## Overview
The therapies page has been fully implemented with a locked scroll card stack effect for the therapy modalities section, combined with normal scroll for other sections, and subtle parallax effects throughout.

## Implementation Details

### 1. Page Structure
The page is divided into the following sections:

- **Introduction Section** (`therapies-intro`)
  - Title: "Therapies"
  - Subtitle: "Possibilities for Change"
  - Introductory text about healing modalities
  - Normal scroll behavior

- **Modalities Section** (`therapies-modalities`)
  - Locked scroll card stack effect
  - 6 therapy modality cards that stack and scale as you scroll
  - Cards include:
    1. Systemic & Family Constellations
    2. Transpersonal Regression Therapy
    3. Shamanism
    4. Foot Reflexology
    5. Access Consciousness™
    6. Antar Smaran Process (ASP)

- **Not Sure Section** (`therapies-not-sure`)
  - Free consultation CTA
  - Normal scroll behavior

- **Come and Find Me Section** (`therapies-come-find-me`)
  - Poetic call to action
  - Decorative background blob
  - Normal scroll behavior

### 2. Locked Scroll Effect
- Uses the existing `StickyCardStack` component
- Cards stack on top of each other and scale down as you scroll
- Similar to the "We Work Together" section on the homepage
- Smooth transitions between cards
- After all cards are shown, normal scroll resumes

### 3. Parallax Effects
- Subtle parallax motion applied to background spiral elements
- Fixed position background with scroll-based transforms
- Multiple spirals at different depths creating layered parallax
- Very low opacity (0.04) for subtlety
- Scroll event listener with different speeds per spiral

### 4. Design System Integration

#### Colors
- Background: `#f6edd0` (light beige)
- Card background: `#d6c68e` (tan/beige)
- Text: `#645c42` (dark brown)
- Header: `#645c42` (dark brown)

#### Typography
- Titles: Safira March (48px)
- Subtitles: Graphik Light (24px, uppercase, tracked)
- Body: Graphik Regular/Light (12px)
- Lists: Graphik Medium (12px)

#### Components Used
- `Section` - For semantic section structure
- `StickyCardStack` - For locked scroll card effect
- `TherapyCard` - Custom card component for each therapy
- `Button` - Consistent CTA buttons

### 5. Therapy Card Component

The `TherapyCard` component handles three layout types:

1. **Standard Layout** (Icon Left/Right)
   - Icon positioned on left or right side
   - Content includes title, subtitle, description, "Best For" list, duration, and CTA
   - Alternating icon positions for visual variety

2. **Center Layout** (ASP special case)
   - Icon centered at top
   - All content centered
   - Special highlighted treatment for the signature offering

3. **Complex Description Support**
   - Handles string descriptions
   - Handles array of strings (multiple paragraphs)
   - Handles structured descriptions with headings (for Access Consciousness™)

### 6. Header Theme Integration
All therapy sections use the same theme:
- Header background: `#645c42` (dark brown)
- Header outer background: `#f6edd0` (light beige)
- Consistent with the rest of the site's dynamic header behavior

### 7. Responsive Considerations
- Cards use flexbox with column/row switching for mobile
- Max widths for readability
- Icons scale appropriately
- Card stack works on all screen sizes

## Files Created/Modified

### New Files
1. `data/therapiesContent.ts` - Therapy data structure and content
2. `components/TherapyCard.tsx` - Therapy card component
3. `THERAPIES_ICONS_TODO.md` - Documentation for icon requirements

### Modified Files
1. `app/therapies/page.tsx` - Complete page implementation
2. `lib/themeConfig.ts` - Added therapies section themes

## Technical Features

### Smooth Scroll Integration
- Uses Lenis for smooth scrolling
- Integrates with StickyCardStack's Observer
- Lenis instance stored globally for card stack control
- Seamless transitions between locked and normal scroll

### Parallax Implementation
- Scroll event listener with passive flag for performance
- Different parallax speeds for depth perception
- Transform-based animation (GPU accelerated)
- `willChange` property for optimization

### Accessibility
- Semantic HTML structure
- Alt text for decorative images
- Proper heading hierarchy
- Focus-visible states on buttons

## Known Limitations & TODOs

1. **Icons**: Currently using placeholder SVGs from existing assets
   - Need to export actual therapy icons from Figma
   - See `THERAPIES_ICONS_TODO.md` for details

2. **Button Links**: CTAs are currently set up but need actual booking/consultation URLs

3. **Performance**: Parallax scroll listener could be throttled/debounced for even better performance on slower devices

4. **Mobile**: May need additional mobile-specific optimizations for the card stack effect

## Testing Checklist

- [x] Page loads without errors
- [x] Locked scroll effect works smoothly
- [x] Normal scroll resumes after card stack
- [x] Parallax effects are subtle and performant
- [x] Header theme changes correctly
- [x] Typography matches design
- [x] Colors match design
- [x] Cards display correctly
- [x] All content is readable
- [x] No linter errors

## Next Steps

1. Replace placeholder icons with actual therapy icons from Figma
2. Add actual booking/consultation URLs to buttons
3. Test on various devices and browsers
4. Fine-tune parallax speeds if needed
5. Consider adding intersection observer for better scroll performance
6. Add fade-in animations for content as it enters viewport (optional)

