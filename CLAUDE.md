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
- **Lenis** for smooth scrolling
- **GSAP** (ScrollTrigger, Observer) for scroll-locking and step-based animations
- **Framer Motion** for reveal and motion primitives
- **Zustand** for lightweight state management

## Architecture

### Scroll System

The site uses a hybrid scroll approach:
- **Lenis** provides smooth scrolling globally, initialized after the splash screen completes
- **GSAP Observer** temporarily takes over scroll input for step-based sections (like card stacks)
- Lenis is exposed globally via `window.__lenis` so GSAP-controlled sections can pause/resume it

Pattern for scroll-locking sections (see `components/WeWorkTogether.tsx`):
```typescript
// Pause Lenis when Observer takes control
window.__lenis?.stop?.();

// Resume when done
window.__lenis?.start?.();
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

Antar Pravaah is a modern, motion-forward website for a healing and transformation practice. The experience is designed to feel like a guided journey: a scroll-driven introduction (splash), a narrative “Journey” section, a scroll-locked “We Work Together” card sequence, and “Voices of Transformation” testimonials.

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
- **Lenis** for smooth scrolling
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

- **Smooth scroll**: Lenis is initialized after splash completes on the home page (`app/page.tsx`).
- **Scroll lock sections**: Some interactions (like the “We Work Together” cards) use **GSAP Observer** to temporarily take over wheel/touch input. Lenis is paused/resumed via a global handle (`window.__lenis`).
- **Theme/background transitions**: Sections can drive theme state via `components/Section.tsx` + `lib/themeConfig.ts`.
