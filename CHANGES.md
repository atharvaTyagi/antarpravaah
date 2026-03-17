# UI/UX Fixes & Colour Corrections

---

## 1. Scrollbar Visibility in Expanded Card States

Scrollbars were visible inside expanded card states across multiple sections. Scroll functionality is retained; only the scrollbar track is hidden.

| | |
|---|---|
| **Before** | `overflow-y-auto` containers had no scrollbar suppression — a native scrollbar track appeared on all platforms |
| **After** | `no-scrollbar` utility class applied to every scrollable container in expanded states |

**Files changed:** `components/MobileModalityCard.tsx`, `components/ModalitiesCardStack.tsx`, `components/ModalitiesScrollCard.tsx`, `components/PathwayCard.tsx`, `components/ImmersionTrainingCard.tsx`

---

## 2. `no-scrollbar` Utility — Tailwind v4 Compatibility

The `.no-scrollbar` class was defined as a plain CSS rule, which Tailwind v4 does not recognise as a utility and may purge or fail to apply.

| | |
|---|---|
| **Before** | `.no-scrollbar { scrollbar-width: none; }` and `.no-scrollbar::-webkit-scrollbar { display: none; }` as separate top-level CSS rules |
| **After** | Converted to `@utility no-scrollbar { … &::-webkit-scrollbar { display: none; } }` — the correct Tailwind v4 pattern for custom utilities |

**Files changed:** `app/globals.css`

---

## 3. We Work Together — CTA Hover Colours

The CTA card at the end of the "We Work Together" stack had incorrect hover colours.

| | |
|---|---|
| **Before** | Card background hovered to `#555141`; button used default `mode="light"` colours with no explicit overrides |
| **After** | Card background hovers to `#d6c68e`; button text is `#d6c68e` (non-hover), button background hovers to `#645c42` with text remaining `#d6c68e` |

**Files changed:** `components/WeWorkTogether.tsx`

---

## 4. Pathway Card — Desktop Layout & Cross-Browser Bounds

The content card inside `PathwayCard` on desktop was cut off in non-Chromium browsers (Safari, Firefox) because `maxHeight: calc(100% - 1rem)` resolved inconsistently inside a flex container.

| | |
|---|---|
| **Before** | Parent used `flex items-end`; content card was a flex child with `maxHeight: calc(100% - 1rem)` and `overflow-y-auto` on the whole card |
| **After** | Parent changed to `relative overflow-hidden`; content card is `absolute bottom-0 left-0 flex flex-col` with `maxHeight: calc(100% - 3rem)`. Content text area is `flex-1 overflow-y-auto no-scrollbar`; CTA is `shrink-0` pinned at the bottom |

**Files changed:** `components/PathwayCard.tsx`

---

## 5. Pathway Card — Scroll-Through to Next Card (Desktop)

After the layout fix, desktop wheel scroll on the content card did not propagate to the parent stack — users had to scroll past the card separately.

| | |
|---|---|
| **Before** | `PathwaysCardStack` GSAP Observer captured all `wheel,touch,pointer` events; `PathwayCard` had no scroll-edge detection |
| **After** | `PathwayCard` attaches a `wheel` listener to its inner scroll container and calls `onEdgeReached('end' \| 'start')` when the scroll boundary is hit. `PathwaysCardStack` switches its Observer to `touch,pointer` only on desktop (wheel is handled by the card), and a new `handleCardEdgeReached` callback advances or retreats the card stack accordingly |

**Files changed:** `components/PathwayCard.tsx`, `components/PathwaysCardStack.tsx`

---

## 6. Journey Section — Colour Correction

Logo, header navigation, connector SVG paths, and step titles were using a slightly off teal.

| | |
|---|---|
| **Before** | `#9ac1bf` used for `accent`, `headerText`, `logoColor` in the `journey` theme; connector SVG `fill="#9AC1BF"`; step title `text-[#9ac1bf]` |
| **After** | All updated to `#a2c0bf`; Journey CTA card background `bg-[#a2c0bf]`, paragraph text `text-[#384443]`, button uses explicit `colors` prop (`fg: '#384443'`, `fgHover: '#a2c0bf'`, `bgHover: '#384443'`) |

**Files changed:** `lib/themeConfig.ts`, `components/TheJourney.tsx`, `app/page.tsx`

---

## 7. Therapies Page — Colour Correction

Logo, header navigation, blob text, modality card text, and button colours across the Therapies page used an incorrect dark variant.

| | |
|---|---|
| **Before** | Dark variant `#645c42`, light variant `#e9d89e` / `#d6c68e` used throughout all therapies themes and components |
| **After** | Dark variant corrected to `#635d45`, light variant corrected to `#d4c795` across all `therapies-*` themes, `ModalitiesScrollCard`, `MobileModalityCard`, `TherapiesBlobScroll`, `TherapyCard`, and `ModalitiesCardStack` |

**Files changed:** `lib/themeConfig.ts`, `components/ModalitiesScrollCard.tsx`, `components/MobileModalityCard.tsx`, `components/TherapiesBlobScroll.tsx`, `components/TherapyCard.tsx`, `components/ModalitiesCardStack.tsx`

---

## 8. Contact Page — Colour Correction

Logo, header navigation, FAQ subheadings, section separator SVG, and the "Book your session" button used slightly off greens.

| | |
|---|---|
| **Before** | Header/logo `#93a378`, dark variant `#474e3a`; FAQ `h3` and `FaqItem` borders/arrows used `#93a378`; button `fg: '#474e3a'`, `fgHover: '#f6edd0'`, `bgHover: '#474e3a'` |
| **After** | Header/logo corrected to `#96a37c`, dark variant to `#494e3c`; FAQ items, borders, and arrow SVG filter updated to `#96a37c`; button `fg: '#494e3c'`, `fgHover: '#96a37c'`, `bgHover: '#494e3c'` |

**Files changed:** `lib/themeConfig.ts`, `app/contact/page.tsx`, `components/FaqItem.tsx`

---

## 9. Mobile Modality Card — Layout Alignment (Figma Match)

The collapsed state of the mobile modality card had centred text and incorrect padding, not matching the Figma design.

| | |
|---|---|
| **Before** | Card used `p-6` (uniform 24px padding), `items-center justify-center` layout; title `text-[28px] text-center`, subtitle `text-[14px] leading-[1.5] text-center`; CTA button not full-width |
| **After** | Card uses `px-10 py-7` (40px/28px, matching Figma), `items-start justify-end` layout; title `text-[36px] leading-normal` left-aligned, subtitle `text-[16px] leading-[24px]` left-aligned; CTA button full-width (`w-full`) |

**Files changed:** `components/MobileModalityCard.tsx`, `components/ModalitiesCardStack.tsx`

---

## 10. Blob Scroll & Inspiration Scroll — Flash on Section Exit

When leaving the `AboutBlobScroll` or `InspirationScroll` sections, the component briefly flashed back to its first paragraph before the transition completed.

| | |
|---|---|
| **Before** | `onEdgeReached` (and `onParagraphChange`) were listed as dependencies of `useLayoutEffect`. Because these callbacks are `useCallback` functions that depend on `currentSection`, they were recreated on every section change — causing `useLayoutEffect` to re-run and reset all paragraphs to index 0, visible as a flash |
| **After** | Both callbacks are stored in refs (`onEdgeReachedRef`, `onParagraphChangeRef`) that are kept in sync via `useEffect`. `useLayoutEffect` depends only on `[isClient]` and never re-runs on section changes; the refs always call the latest version of the callback |

**Files changed:** `components/AboutBlobScroll.tsx`, `components/InspirationScroll.tsx`
