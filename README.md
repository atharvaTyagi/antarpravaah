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

### License

Private project. All rights reserved.
