# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Run ESLint
```

## Tech Stack

- **Next.js 16** (App Router) with React 19 and TypeScript
- **Tailwind CSS v4** for styling
- **GSAP** (ScrollTrigger, Observer) for scroll-locking and step-based animations
- **Framer Motion** for reveal and motion primitives
- **Zustand** for lightweight state management

## Architecture

### Scroll System

The site uses GSAP for scroll-controlled animations:
- **GSAP Observer** temporarily takes over scroll input for step-based sections (like card stacks, blob scroll)
- Pages with full-page snapping use a fixed container with manual `gsap.to()` animation

Pattern for scroll-locking sections (see `components/AboutBlobScroll.tsx`):
```typescript
// Create Observer for scroll handling
const observer = Observer.create({
  type: 'wheel,touch,pointer',
  wheelSpeed: -1,
  tolerance: 50,
  preventDefault: true,
  onDown: () => handleScroll('up'),
  onUp: () => handleScroll('down'),
});

// Enable/disable based on active state
observer.enable();
observer.disable();
```

### Mobile Viewport Height

Mobile browsers have dynamic toolbars that affect viewport height. The site uses:
- CSS `100dvh` (dynamic viewport height) where supported
- JavaScript fallback that sets `--vh` CSS variable from `window.innerHeight`

```css
.section {
  height: calc(100dvh - var(--header-height, 90px));
  height: calc(var(--vh, 1vh) * 100 - var(--header-height, 90px)); /* Fallback */
}
```

### Theme System

Dynamic background/theme transitions are driven by scroll position:

1. **`lib/themeConfig.ts`** - Defines `SectionId` type and `SECTION_THEMES` record mapping each section to colors (bg, text, accent, headerBg)
2. **`lib/stores/useThemeStore.ts`** - Zustand store holding current theme (`currentTheme: SectionId`)
3. **`components/Section.tsx`** - Wrapper that uses Framer Motion's `useInView` to update theme when section enters viewport
4. **`components/BackgroundWrapper.tsx`** - Fixed background div that transitions color based on current theme

To add a new themed section: add its ID to `SectionId`, define colors in `SECTION_THEMES`, wrap content in `<Section id="your-section-id">`.

### State Management

Two Zustand stores in `lib/stores/`:
- **`useThemeStore`** - Current theme/section for background transitions
- **`useUiStore`** - UI state like splash screen completion

### Path Alias

`@/*` maps to the project root (configured in tsconfig.json).

## Antar Pravaah — Healing & Transformation

Antar Pravaah is a modern, motion-forward website for a healing and transformation practice. The experience is designed to feel like a guided journey: a scroll-driven introduction (splash), a narrative "Journey" section, a scroll-locked "We Work Together" card sequence, and "Voices of Transformation" testimonials.

### Website sections

- **Splash / Introduction**: scroll-to-advance overlay that reveals the site.
- **The Journey**: narrative steps with scroll-reveal + connector animations.
- **We Work Together**: a pinned card experience (GSAP Observer) where each scroll advances one card, ending with a CTA.
- **Voices of Transformation**: testimonials carousel with a scroll takeover interaction.
- **Additional pages**: About, Approach, Therapies, Trainings, Immersions, Contact, FAQ.

### Tech stack

- **Next.js (App Router)** + **React**
- **TypeScript**
- **Tailwind CSS v4**
- **GSAP** (`ScrollTrigger`, `Observer`) for scroll locking / step-based sequences
- **Framer Motion** for reveal and motion primitives
- **Zustand** for lightweight UI/theme state

### Project structure (high-level)

- **`app/`**: routes (`/`, `/about`, `/approach`, etc.)
- **`components/`**: reusable UI + animated sections (e.g. `SplashScreen`, `TheJourney`, `WeWorkTogether`)
- **`lib/`**: stores + theme config
- **`data/`**: static content used across sections
- **`public/`**: static assets

### Run locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

Build and run production:

```bash
npm run build
npm run start
```

### Notes for developers

- **Scroll lock sections**: Some interactions (like the "We Work Together" cards, AboutBlobScroll) use **GSAP Observer** to temporarily take over wheel/touch input
- **Theme/background transitions**: Sections can drive theme state via `components/Section.tsx` + `lib/themeConfig.ts`
- **Mobile viewport**: Use `100dvh` with fallback to `calc(var(--vh) * 100)` for sections that need full viewport height
- **Mobile toolbar issue**: The current GSAP Observer approach with `preventDefault: true` blocks native scroll detection, which prevents mobile browser toolbars from collapsing. This is a known limitation.

---

## Project Learnings & Development Guide

Use this section when continuing development. It documents the section-wise architecture, responsiveness patterns, and conventions.

### 1. Section-Based Page Architecture

Pages use a **fixed container** with GSAP vertical translation to move between full-height sections (no native scroll).

**Section configuration pattern:**
```typescript
// Single config (homepage)
const SECTIONS: { id: string; type: string; themeId: SectionId }[] = [...]

// Desktop vs Mobile (approach, therapies, etc.)
const SECTIONS_DESKTOP = [...];
const SECTIONS_MOBILE = [...];
const SECTIONS = isMobile ? SECTIONS_MOBILE : SECTIONS_DESKTOP;
```

**Section types:** `static` | `journey-scroll` | `cards-scroll` | `carousel-scroll` | `pathways-scroll` | `modalities-scroll` | `modalities-carousel` | `blob-scroll` | `asp-scroll` | `footer`

**Core mechanics:**
- `goToSection(index, direction)` – animates `gsap.to(container, { y: -index * sectionHeight })`
- Each section: `ref={(el) => { if (el) sectionsRef.current[i] = el; }}`
- Scroll sections receive: `isActive`, `resetToStart`, `resetToEnd`, `onEdgeReached`
- Use `sectionScrollCooldown` (800–1000ms) to prevent rapid double-triggers

### 2. GSAP Observer Pattern

Scroll-locking sections use Observer to capture scroll input:
```typescript
gsap.registerPlugin(Observer);
const observer = Observer.create({
  type: 'wheel,touch,pointer',
  wheelSpeed: -1,
  tolerance: 50,
  preventDefault: true,
  onDown: () => handleScroll('up'),
  onUp: () => handleScroll('down'),
});
// Enable/disable via observer.enable() / observer.disable() based on isActive
```

**Components using Observer:** TheJourney, WeWorkTogether, VoicesOfTransformation, PathwaysCardStack, AboutBlobScroll, TherapiesBlobScroll

### 3. Theme System

- **`lib/themeConfig.ts`**: `SectionId` type, `SECTION_THEMES` record
- **`useThemeStore`**: current theme; Header, Footer, BackgroundWrapper read from it
- **Theme shape**: `{ bg, text, accent, headerBg?, headerOuterBg?, headerText? }`
- **Adding a theme**: Add to `SectionId`, add entry in `SECTION_THEMES`, use `themeId` in section config

### 4. Responsiveness

**Breakpoints:** Mobile `width < 640` or `< 768` (varies by page). Tailwind: `sm` 640px, `md` 768px, `lg` 1024px.

**Header height (globals.css):** Mobile 90px, Tablet 108px, Desktop 148px

**Mobile-specific layouts:** Therapies page differs: desktop has modalities-scroll + static blob; mobile has modalities-carousel + blob-scroll.

### 5. Mobile Viewport Height

**Problem:** `100vh` includes area behind mobile browser toolbars → content cut off.

**Solution:** Three-layer fallback in `globals.css`:
1. `100vh` (base)
2. `calc(var(--vh, 1vh) * 100 - var(--header-height))` (JS-set `--vh`)
3. `@supports (height: 100dvh)` → `calc(100dvh - var(--header-height))`

**Pages must set `--vh`:** `document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)` on mount, resize, orientationchange.

**SplashScreen:** Use `height: 100dvh`, `minHeight: 100vh`; blob uses `clamp(260px, min(60vmin, 85dvh), 760px)` to fit viewport.

### 6. Page Structure & CSS Classes

- **Layout:** `BackgroundWrapper` > `Header` > `{children}` in `app/layout.tsx`
- **Section pages:** `main.main-container` > `div.will-change-transform` > `div.section-height` per section
- **Classes:** `main-container` (fixed, full viewport minus header), `section-height` (one section = one viewport)

**Note:** Some pages (approach, therapies, about, immersions) have inline `<style jsx global>` duplicating `.main-container` and `.section-height`. Prefer `globals.css` as single source.

### 7. Content & CMS

- **Sanity:** Types `testimonial`, `thought`. Queries in `sanity/lib/queries.ts`
- **Static data:** `data/content.ts`, `therapiesContent.ts`, `pathwaysContent.ts`, `faqContent.ts`, `guidedJourneyContent.ts`

### 8. Known Issues

- GSAP Observer with `preventDefault: true` blocks native scroll → mobile toolbars may not collapse
- Duplicate inline CSS for viewport classes on some pages; consolidate in globals.css
- Scroll sections with internal native scroll (e.g. ThoughtsAndPonderings) can conflict with pinning

### 9. Conventions

- Path alias: `@/*` → project root
- Fonts: `--font-saphira`, `--font-graphik` (globals.css)
- Design colors: hex in theme config (`#f6edd0`, `#354443`, `#9ac1bf`, etc.)
- Buttons: `components/Button.tsx` with `colors`, `size`, optional `href`

### 10. File Reference

| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage: splash, journey, cards, carousel, footer |
| `app/approach/page.tsx` | Pathways stack, thoughts, CTA |
| `app/therapies/page.tsx` | Modalities (scroll/carousel), blob, different mobile layout |
| `lib/themeConfig.ts` | All section IDs and theme definitions |
| `app/globals.css` | `--header-height`, `--vh`, `.main-container`, `.section-height` |
| `components/Section.tsx` | IntersectionObserver for theme updates on scroll pages |
