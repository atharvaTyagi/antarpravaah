# UI Changes

## Splash Screen — Word Reveal Color

| | |
|---|---|
| **Before** | Words in the blob quote revealed with opacity only; text stayed at `#4a3833` regardless of scroll state |
| **After** | On reveal, each word animates to `#6A3F33` (dark brown) alongside the opacity fade-in |

**Files changed:** `components/SplashScreen.tsx`

## Therapies Page — "Possibilities for Change" Subtitle Typography

| | |
|---|---|
| **Before** | `tracking-[2.5px] sm:tracking-[3px] lg:tracking-[2.56px]` and `leading-normal` |
| **After** | `tracking-normal` (0) and `leading-none` (0 extra line-height) |

**Files changed:** `app/therapies/page.tsx`

## Voices of Transformation — Testimonial Card Width

| | |
|---|---|
| **Before** | `w-[calc(100vw-32px)] sm:w-[calc(100vw-48px)] lg:w-[calc(100vw-80px)]` |
| **After** | `w-[calc(100vw-32px)] sm:w-[90vw] lg:w-[1000px]` — matching the We Work Together card container width ratios |

**Files changed:** `components/VoicesOfTransformation.tsx`

## Button — Text Size

| | |
|---|---|
| **Before** | Text size scaled per breakpoint: `text-[11px] sm:text-[12px]` (small), `text-[16px] sm:text-[18px]` (medium), `text-[18px] sm:text-[20px] lg:text-[24px]` (large) |
| **After** | Fixed at `text-[18px]` across all breakpoints for all size variants |

**Files changed:** `components/Button.tsx`

## We Work Together — Card Height

| | |
|---|---|
| **Before** | Cards capped at `clamp(350px, 55vh, 550px)` on sm+; outer wrapper switched to `h-auto` breaking the height chain |
| **After** | Cards use `h-full` at all breakpoints, filling the available section height below the "We Work Together" heading |

**Files changed:** `components/WeWorkTogether.tsx`
