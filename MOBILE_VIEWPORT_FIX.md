# Mobile Viewport Height Fix - Summary

## Problem Solved
Fixed mobile viewport issues where content wasn't filling the screen properly due to mobile browser toolbars (URL bar, navigation bar) that dynamically show/hide.

## Changes Made

### 1. Removed Duplicate Inline CSS
**Files Modified:**
- `app/page.tsx` - Removed inline `<style jsx global>` block
- `app/approach/page.tsx` - Removed inline `<style jsx global>` block

**Why:** The inline CSS was duplicating and overriding the global CSS definitions in `app/globals.css`, causing inconsistent height calculations.

### 2. Enhanced Global CSS
**File Modified:** `app/globals.css`

**Changes:**
- Improved CSS cascade order for `.main-container` and `.section-height` classes
- Added clear comments explaining the fallback strategy
- Ensured `100dvh` takes precedence in supporting browsers

**CSS Strategy (in order of precedence):**
```css
/* 1. Fallback for older browsers */
height: calc(100vh - var(--header-height, 90px));

/* 2. Better fallback using JS-set --vh variable */
height: calc(var(--vh, 1vh) * 100 - var(--header-height, 90px));

/* 3. Modern browsers with dynamic viewport support */
@supports (height: 100dvh) {
  height: calc(100dvh - var(--header-height, 90px));
}
```

### 3. SplashScreen Enhancement
**File Modified:** `components/SplashScreen.tsx`

**Changes:**
- Confirmed `100dvh` is used for the splash screen height
- Added clarifying comments

### 4. JavaScript Viewport Height Setter
**Status:**
- ✅ Already present in `app/page.tsx` (lines 87-98)
- ✅ Already present in `app/approach/page.tsx` (lines 102-109)

The JavaScript sets `--vh` CSS variable on mount and resize:
```javascript
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
```

## How It Works

### Three-Layer Fallback System:

1. **`100vh`** - Works on desktop and older mobile browsers (but doesn't account for dynamic toolbars)

2. **`calc(var(--vh) * 100)`** - JavaScript-calculated viewport height that updates on resize
   - Accounts for mobile browser toolbars
   - Updates when device orientation changes
   - Fallback for browsers without `dvh` support

3. **`100dvh`** - Modern CSS solution (Dynamic Viewport Height)
   - Native browser support for dynamic toolbars
   - Most reliable on modern mobile browsers (iOS Safari 15.4+, Chrome 108+)

### Browser Support:
- ✅ iOS Safari 15.4+
- ✅ Chrome/Edge 108+
- ✅ Firefox 110+
- ✅ Samsung Internet 21+
- ⚠️ Older browsers fall back to `--vh` JavaScript solution

## Testing Instructions

### Desktop Testing:
1. Run `npm run dev`
2. Open `http://localhost:3000`
3. Verify sections fill viewport height properly
4. Resize browser window - sections should adapt

### Mobile Testing:

#### iOS Safari:
1. Open site on iPhone/iPad
2. Initial load: URL bar visible at top
3. Scroll down: URL bar should collapse
4. **Expected behavior:** Content should fill viewport without gaps at any point
5. Test both portrait and landscape orientations

#### Android Chrome:
1. Open site on Android device
2. Check that sections fill screen properly
3. Scroll to ensure no jumpy behavior when URL bar hides
4. Test both portrait and landscape orientations

### Specific Test Cases:

1. **Splash Screen:**
   - Should fill entire screen (no gaps at top/bottom)
   - Text blob should be centered properly

2. **Homepage Sections:**
   - The Journey section
   - Journey CTA card
   - We Work Together cards
   - Voices testimonials
   - All should fill viewport height minus header

3. **Approach Page:**
   - All 5 sections should fill viewport properly
   - Pathways cards scroll section
   - Thoughts section

### Known Issues (From CLAUDE.md):
- GSAP Observer with `preventDefault: true` blocks native scroll detection
- This prevents mobile browser toolbars from collapsing naturally
- This is a **known limitation** of the scroll-lock architecture

## Additional Notes

### Why Remove Inline CSS?
The inline CSS in both page files was:
1. Duplicating global CSS definitions
2. Potentially causing specificity conflicts
3. Making the cascade order unpredictable
4. Harder to maintain (changes needed in 3 places instead of 1)

### Why Keep Global CSS?
- Single source of truth for viewport height calculations
- Easier to maintain and update
- Consistent across all pages
- Proper CSS cascade handling

### Header Height Responsive Values:
```
Mobile (< 640px):  90px
Tablet (640-1023): 108px
Desktop (≥ 1024):  148px
```

These are defined in `app/globals.css` at `:root` level and automatically apply across the app.

## Build Status
✅ Build successful - All pages compile without errors
