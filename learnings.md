# Antar Pravaah — Knowledge Base (Learnings)

This document consolidates **everything discussed in a multi-session UI/UX and content audit**: scrollbar behavior, card layouts, scroll orchestration, theme/color tokens, cross-browser fixes, build pitfalls, contact/modal wiring, and **copy review** vs. the canonical content spec.

Use it when onboarding tools (e.g. Claude Code), continuing design polish, or debugging scroll/theme regressions.

**Related files in repo:** `CHANGES.md` (before/after commit-style changelog), `CLAUDE.md` (stack, commands, scroll/theme architecture).

---

## 1. Tech Stack (Quick Reference)

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS v4** (`@import "tailwindcss"` in `app/globals.css`)
- **GSAP** + **Observer** for scroll-locking and step-based sections
- **Framer Motion** for reveals
- **Zustand** — `useThemeStore`, `useUiStore`   
- **Sanity** — testimonials, etc. (see `sanity/`)

Path alias: `@/*` → project root.

---

## 2. Hidden Scrollbars (Expanded Card States)

**Goal:** Scrollable areas inside expanded cards must scroll **without** visible scrollbars (desktop + mobile).

**Implementation:**

- Utility class **`no-scrollbar`** in `app/globals.css`.
- **Tailwind v4:** Must be declared as **`@utility no-scrollbar`** (not only a plain `.no-scrollbar { }` rule), or the class may not apply reliably in production builds.

```css
@utility no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

**Where it was applied:**

| Location | File(s) |
|----------|---------|
| Desktop modalities (“Our Modalities”) | `components/ModalitiesScrollCard.tsx` |
| Mobile modalities | `components/MobileModalityCard.tsx`, `components/ModalitiesCardStack.tsx` (expanded layer) |
| Approach pathway cards | `components/PathwayCard.tsx` |
| Immersions workshops / training carousels | `components/ImmersionTrainingCard.tsx` |

**Pattern:** Add `no-scrollbar` next to `overflow-y-auto` on the scroll container.

---

## 3. We Work Together — Final CTA Card Colors

**Spec:**

- **Non-hover:** CTA button treatment aligned with `#D6C68E` (light) on dark card `#645C42`.
- **Hover (card):** Card background → `#d6c68e`.
- **Hover (button):** Button background → `#645c42`, button text → `#d6c68e`.

**File:** `components/WeWorkTogether.tsx` — `Link` wrapper `hover:bg-[#d6c68e]`; inner `Button` gets explicit `colors`: `fg`, `fgHover`, `bgHover` as needed (see `components/Button.tsx` for prop shape).

---

## 4. Pathway Card (Approach) — Desktop Layout & Scroll-Through

### 4.1 Cross-browser bounds (Safari/Firefox)

**Problem:** Inner content card looked cut off in non-Chromium browsers when using `flex items-end` + `maxHeight: calc(100% - 1rem)` on a flex child.

**Approach:**

- Outer card: **`relative overflow-hidden`** (not `flex items-end` for the main wrapper).
- Inner content card: **`absolute bottom-0 left-0`**, `maxHeight: calc(100% - 3rem)` (accounts for margins).
- Inner structure: **`flex flex-col`** with:
  - **Scroll region:** `flex-1 min-h-0 overflow-y-auto no-scrollbar` + default padding (`p-3 sm:p-4 lg:p-5`).
  - **CTA:** **`shrink-0`** wrapper so the button stays pinned to the bottom.

**File:** `components/PathwayCard.tsx`

### 4.2 Scroll delegation to parent stack (desktop)

**Goal:** User finishes scrolling the **inner** text first; only then should the **parent** advance to the next pathway card.

**Implementation:**

- `PathwayCard` exposes **`onEdgeReached?: (edge: 'start' | 'end') => void`**.
- **`desktopScrollRef`** on the scrollable div; **`wheel`** listener (passive) detects top/bottom overflow and calls `onEdgeReached` with cooldown.
- **`PathwaysCardStack.tsx`:**
  - Renders **`PathwayCard` directly** for both mobile and desktop when `pathways` prop exists (not only pre-built `card.render` on desktop).
  - **`handleCardEdgeReached`** moves to next/previous index or bubbles `onEdgeReached` to the page.
  - **`animateToIndexStable`** centralizes index animation logic.
  - On **desktop + pathways:** GSAP Observer uses **`type: 'touch,pointer'` only** (no `wheel`), so wheel is handled inside `PathwayCard` without fighting the stack.

**Files:** `components/PathwayCard.tsx`, `components/PathwaysCardStack.tsx`

---

## 5. Global Color Tokens (Theme + Hardcoded Overrides)

Central themes live in **`lib/themeConfig.ts`** (`SECTION_THEMES`, `SectionId`). Header/logo often follow `headerText`, `logoColor`, `headerBg`.

### 5.1 Journey (homepage)

- Accent / nav / logo on journey: **`#a2c0bf`** (was `#9ac1bf`).
- Journey CTA card: background **`#a2c0bf`**; body text **`#384443`**; button uses explicit `colors` — default fg `#384443`, hover bg `#384443`, hover text `#a2c0bf`.
- **Files:** `lib/themeConfig.ts` (`journey`), `app/page.tsx` (CTA section), `components/TheJourney.tsx` (connector SVG fill, step title color).

### 5.2 Therapies page

- **Light accent:** `#d4c795` (logo, header nav, footer quick links on therapies-footer, blob styling as designed).
- **Dark variant:** `#635d45` (buttons default text; hover bg; header bar on many therapies sections).
- **Button pattern:** default text `#635d45`; hover bg `#635d45`, hover text `#d4c795`.
- **Files:** `lib/themeConfig.ts` (all `therapies-*` and `therapies-footer`), `components/TherapiesBlobScroll.tsx`, `components/ModalitiesScrollCard.tsx`, `components/MobileModalityCard.tsx`, `components/TherapyCard.tsx`, `components/ModalitiesCardStack.tsx`. Footer link colors on that page follow footer theme from store.
- **Blob asset:** Therapies blob may use **`/therapy_blob.svg`** (pre-tinted) instead of filter on generic blob — verify in `TherapiesBlobScroll.tsx` if adjusting.

### 5.3 Contact + FAQ

- **Green accent:** `#96a37c` (header/logo, FAQ subheads, separators, `FaqItem` borders/icons).
- **Dark text/CTA:** `#494e3c` (e.g. “Book your session” default); hover bg `#494e3c`, hover text `#96a37c`.
- **Files:** `lib/themeConfig.ts` (`contact`, `contact-info`, `contact-cta`, `faq`), `app/contact/page.tsx`, `components/FaqItem.tsx`.

**Note:** SVG “recolor” via CSS `filter` is fragile; when changing hex targets, recalculate filter or swap to a dedicated SVG asset.

---

## 6. Mobile Modality Cards — Figma Alignment

**Reference:** Figma node `388:4146` (mobile modality card) — title + subtitle **left-aligned**; icon centered in upper area; **Read More** full-width / centered treatment per design.

**Layout changes (collapsed state):**

- Padding **`px-10 py-7`** (~40px / 28px), **`gap-4`**, **`items-start justify-end`**.
- Title **`text-[36px] leading-normal`**, subtitle **`text-[16px] leading-[24px]`**, **`#635d45`**.
- CTA full width where specified.

**Critical bug once introduced:** In **`ModalitiesCardStack.tsx`** collapsed layer, an `<img>` briefly **lost `src={modality.iconSrc}`** during a refactor — icons stopped loading. Always keep **`src`** bound to data.

**Files:** `components/MobileModalityCard.tsx`, `components/ModalitiesCardStack.tsx`

---

## 7. About Page — Blob & “My Inspiration” Flash on Section Change

**Symptom:** After reading to the **last paragraph** (blob) or **last inspiration card**, navigating to the **next section** briefly showed the **first** paragraph again.

**Root cause:** `useLayoutEffect` in **`AboutBlobScroll.tsx`** and **`InspirationScroll.tsx`** listed **`onEdgeReached`** in the dependency array. Parent passes **`useCallback`** handlers that depend on **`currentSection`**, so the callback identity changes every section change → effect **re-runs** → GSAP **re-initializes** all paragraphs to index 0 → visible flash.

**Fix:** Store **`onEdgeReached`** (and **`onParagraphChange`** on the blob) in **refs** updated via `useEffect`; **`useLayoutEffect` depends only on `[isClient]`** (or equivalent stable deps). Handlers always call **`ref.current?.()`**.

**Files:** `components/AboutBlobScroll.tsx`, `components/InspirationScroll.tsx`

**Related:** About page section navigation and `blobResetToStart` / `blobResetToEnd` / inspiration resets live in **`app/about/page.tsx`** (`goToSection`).

---

## 8. Production Build — GSAP `onComplete` TypeScript

**Error (Netlify / `next build`):**  
`Type '() => gsap.core.Tween' is not assignable to type 'Callback'` because `() => gsap.set(...)` **returns** the Tween.

**Fix:** Use a block body so the callback returns **`void`:**

```ts
onComplete: () => { gsap.set(el, { ... }); },
```

**File:** `components/ModalitiesCardStack.tsx` (and apply same pattern anywhere else with this issue).

---

## 9. Contact Page — “Book your first session” → Guided Journey Modal

**Behavior:** The FAQ footer CTA should open **`GuidedJourneyModal`**, not only navigate away.

**Implementation:**

- `import GuidedJourneyModal from '@/components/GuidedJourneyModal'`
- State: `const [isModalOpen, setIsModalOpen] = useState(false)`
- Button: `onClick={() => setIsModalOpen(true)}`
- Render: `<GuidedJourneyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />`

**File:** `app/contact/page.tsx`

---

## 10. Documentation & Git Workflow (From Session)

- **`CHANGES.md`** was added as a **before/after** changelog for the large UI pass (scrollbars, colors, pathway scroll, copy-related file touches, etc.).
- Commits were made to **`dev`** with **`git push --force origin dev`** when requested — be careful with force-push on shared branches.

---

## 11. Where Content Lives (Quick Map)

| Area | Primary files |
|------|----------------|
| Home — splash hero lines | `components/SplashScreen.tsx` (`TEXT_LINES`) |
| Home — journey steps | `components/TheJourney.tsx` (`journeySteps`) |
| Home — journey CTA card | `app/page.tsx` (section ~469–525) |
| Home — We Work Together | `components/WeWorkTogether.tsx` (`workCards`) |
| Home — testimonials CTA | `components/ReadyToBegin.tsx` |
| Approach — pathway cards | `data/pathwaysContent.ts` |
| Approach page shell | `app/approach/page.tsx` |
| Therapies — all modalities | `data/therapiesContent.ts` |
| Therapies — mobile stack / blob | `app/therapies/page.tsx`, `components/ModalitiesCardStack.tsx`, `components/TherapiesBlobScroll.tsx` |
| About — blob paragraphs | `components/AboutBlobScroll.tsx` (`aboutParagraphs`) |
| Immersions | `app/immersions/page.tsx` |
| Contact + FAQ | `app/contact/page.tsx`, `data/faqContent.ts` |
| Footer quick links | `components/Footer.tsx` |
| Guided journey modal | `components/GuidedJourneyModal.tsx`, `data/guidedJourneyContent.ts`, `components/guided-journey/*.tsx` |
| Theme / section colors | `lib/themeConfig.ts` |

---

## 12. Copy Review — Discrepancies (Website vs. Content Spec)

**Canonical spec (external):** `Antar Pravaah Website Content.md` (or client PDF). Re-validate after spec updates.

### Home page

1. **Journey CTA — missing secondary button** — Spec: “Begin Your Journey” + “Explore Our Approach”. Site: only first button in `app/page.tsx`.
2. **We Work Together** — Long spec intro split across cards in `WeWorkTogether.tsx`; verify narrative order.
3. **“happening too” vs “happening to”** — Editorial flag in journey step 2 body.

### Approach page

4. **Missing sentences** — Spec: *“The start is always from the place where you are. Every step matters.”* — not on site in pathway/we-work-together content.

### Therapies page

5. **Access Bars®** — Spec: control, joy, calm, body, money, relationships. Site: creativity, money, relationships in `therapiesContent.ts`.
6. **Access Consciousness CTA** — Spec: “Book a Session”. Site: longer `ctaText`.
7. **“Come and find me”** — Spec: `…` three dots. Site: `....` in `TherapiesBlobScroll.tsx`.
8. **“Find Your Path”** — Heading vs body styling in `app/therapies/page.tsx`.

### Footer

9. **Quick links** — Spec lists About Antar Pravaah, Events & Trainings, Contact & FAQ. Site: different labels/splits (`Footer.tsx`).

### Contact & FAQ

10. **Intro headline casing** — Title case vs sentence case.
11. **Still have questions** — Spec: Contact Us + Schedule 30-min consultation. Site: single “Book your first session” → modal.

### Guided journey

12. **Welcome headline casing** — `WelcomeScreen.tsx`.
13. **Direct path recommendation** — Missing closing “Starting something new takes courage…” block in `guidedJourneyContent.ts` vs other paths.
14. **Recommendation titles / CTA strings** — Compare to spec.

### Immersions page

15. **Missing headline** — “Ready to Step Into Your Power?”
16. **Truncated CTA body** — Missing “Your healing journey ripples outward…” sentence in `app/immersions/page.tsx`.

### Spec errors already fixed on site (do not revert)

| Topic | Bad in doc | Good on site |
|-------|------------|----------------|
| FAQ — children | “children 15” | “children **under** 15” — `faqContent.ts` |
| FAQ — location | “btoh, in perso” | “both, in person” — `faqContent.ts` |

### Testimonials & Privacy

- Testimonials may be **Sanity-driven**; reconcile with long-form quotes in content doc.
- Privacy policy copy in spec may need a dedicated route — search `app/` for `privacy`.

---

## 13. Known Product / Architecture Caveats (from CLAUDE.md)

- GSAP Observer with **`preventDefault: true`** can block native scroll → mobile browser toolbars may not collapse.
- Some pages duplicate viewport CSS; prefer **`globals.css`** for `.main-container`, `.section-height`, `--vh`.
- Scroll sections with **nested native scroll** can conflict with pinning — test thoroughly.

---

## 14. Session Fixes — March 2026

### Pathway Cards — Jittery Overflow Scroll (Desktop)
- **Root cause:** GSAP Observer (`type: 'touch,pointer'`) was competing with the card's native wheel scroll at boundaries.
- **Fix (`PathwayCard.tsx`):** Switched wheel listener to `passive: false`, added `e.stopPropagation()` so wheel events stay owned by the card, added `e.preventDefault()` only at top/bottom edges, added a `minDelta` threshold to ignore trackpad micro-jitter.
- **Fix (`PathwaysCardStack.tsx`):** Changed desktop observer type from `'touch,pointer'` to `'touch'` only — wheel is fully handled by the card's own listener.

### Immersions Carousel — Card Gap Collapse on First Render
- **Root cause:** `ImmersionCard` desktop had large `min-w-[320px] sm:min-w-[600px] lg:min-w-[900px]` constraints that overflowed the `calc(60vw - 64px)` carousel slot, eating the gap until a resize reflow fixed it.
- **Fix (`ImmersionTrainingCard.tsx`):** Replaced `min-w-*` with `w-full min-w-0` so card width follows the parent slot.

### Privacy Policy Modal — Not Rendering / Not Scrollable
- **Root cause:** Modal was rendered inside `<Footer>`, which lives inside transformed/overflow-clipped page containers. `position: fixed` children get trapped in parent stacking contexts.
- **Fix (`PrivacyPolicyModal.tsx`):** Rendered via `createPortal(…, document.body)` to escape all parent stacking contexts. Added `isMounted` guard for SSR safety.
- **Scroll fix:** Added `onWheel` and `onTouchMove` with `e.stopPropagation()` on the modal panel, plus `overscroll-contain`, so page-level GSAP/global scroll handlers don't steal events.
- **Style parity with GuidedJourneyModal:** Added `backdrop-blur-sm` to backdrop, aligned panel background to `bg-[#3e3629]`.
- **Bonus:** Added `Escape` key listener to close modal.

### Booking Calendar — Selected Date UI
- Removed "Immersion Title" label and "Workshop/Training" pill from selected date cell.
- Selected date now shows only the date number with `bg-[#f4edd3]` highlight.
- Out-of-month placeholder cells (bordered boxes with `-`) replaced with invisible transparent grid slots — grid alignment preserved, visual clutter removed.

### TherapyCard Mobile (ASP) — Visible Scrollbar
- **Fix (`TherapyCard.tsx`):** Added `no-scrollbar` to the mobile ASP scrollable content container. Scroll behavior unchanged.

### PathwayCard Mobile — Image as Full Card Background
- **Fix (`PathwayCard.tsx`):** Background image div now uses `w-full h-full object-cover` so the image fills the entire card (cropping is acceptable). Removed old `scale(1.1)` transform that only slightly enlarged the image without covering the card.

### SplashScreen Blob — Mobile Sizing Aligned to About Blob
- **Fix (`SplashScreen.tsx`):** Replaced the old square `680px` fixed-size + padded center-box approach with the same responsive sizing pattern used in `AboutBlobScroll`:
  - Blob: `w-[640px] sm:w-[400px] md:w-[480px] lg:w-[560px] max-w-none` (overflows viewport on mobile intentionally).
  - Text frame: `max-w-[320px] h-[320px]` on mobile, responsive up.
- Removed unused `next/image` import.

### ModalitiesScrollCard — "Best For" Label on Access Consciousness™
- **Root cause:** Best For section rendered unconditionally even when `bestFor.column1` and `column2` are both empty arrays.
- **Fix (`ModalitiesScrollCard.tsx`):** Wrapped the section with `{(column1.length > 0 || column2.length > 0) && (…)}` — same guard already used in `MobileModalityCard`.

---

## 15. How to Use This File

1. **UI regression:** Check §2–§9, §14, and `CHANGES.md` for what was intentionally changed.  
2. **Copy pass:** Use §11 + §12 with the client content doc.  
3. **New scroll + callback props:** Avoid unstable function identities in `useLayoutEffect` deps (§7 pattern).  
4. **After you fix something:** Update §12 or §14 or add a dated “Resolved” note so the KB stays truthful.

---

*Consolidated from full project chat: UI/UX fixes, technical patterns, build notes, contact modal, copy audit, and doc workflow. Update when behavior or spec changes.*
