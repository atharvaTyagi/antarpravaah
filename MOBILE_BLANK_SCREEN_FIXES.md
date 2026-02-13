# Mobile Blank Screen Debugging & Fixes

## Issue Description
The splash screen and homepage were loading as blank screens on mobile devices (as shown in the provided screenshots), while working fine on desktop.

## UPDATE: Root Cause Identified
After receiving additional screenshots showing the blob appearing then disappearing, the actual root cause was identified as a **FOUC (Flash of Unstyled Content) + useEffect re-initialization bug**. See `FOUC_FIX_SUMMARY.md` for detailed explanation of the final fix.

The blob was fading in correctly, but then the useEffect was re-running due to state changes and resetting the opacity back to 0, causing the blank screen.

## Root Causes Identified

### 1. **Z-Index Stacking Conflicts** ⚠️ CRITICAL
- **Problem**: Modals had extremely high z-index values (200-201) that could interfere with main content
- **Components affected**: 
  - `GuidedJourneyModal`: z-[200] and z-[201]
  - `PrivacyPolicyModal`: z-[100] and z-[101]
  - `Header`: z-[60]
  - `main-container`: z-[30]
- **Fix**: Normalized z-index hierarchy:
  - Header: z-50
  - Main container: z-10
  - Background: z--1
  - Content: z-1
  - Modals remain at z-100+ (only when open)

### 2. **Modal Rendering When Closed**
- **Problem**: `AnimatePresence` might leave invisible DOM elements even when `isOpen={false}`
- **Fix**: Added early return in both modal components to prevent any rendering when closed:
  ```typescript
  if (!isOpen) return null;
  ```

### 3. **Body Overflow Management Conflicts**
- **Problem**: Multiple components (homepage + modals) were setting `body.style.overflow = 'hidden'`, causing race conditions
- **Fix**: Improved cleanup logic in modal useEffect hooks to only restore overflow if the modal was the one that set it

### 4. **Mobile Viewport Height Issues**
- **Problem**: SplashScreen blob had minimum size of 380px which could overflow on small mobile screens
- **Fix**: Changed from fixed clamp to responsive sizing:
  ```typescript
  // Before:
  width: 'clamp(380px, 60vmin, 760px)'
  
  // After:
  className="relative w-full h-full max-w-[760px] max-h-[760px]"
  style={{
    minWidth: 'min(320px, 90vw)',
    minHeight: 'min(320px, 90vh)',
  }}
  ```

### 5. **Missing Viewport Height Recalculation**
- **Problem**: `--vh` CSS variable wasn't being recalculated with sufficient delay for mobile browser chrome
- **Fix**: Added additional delayed recalculation (500ms) to catch browser UI adjustments

### 6. **GSAP Observer Not Triggering on Mobile**
- **Problem**: If GSAP Observer doesn't properly capture touch events on mobile, the splash text (starting at opacity 0.2) would remain faint
- **Fix**: Added mobile-specific safety timeout (10 seconds) that auto-reveals text if it hasn't been revealed by scroll
  ```typescript
  // Mobile safety: auto-reveal after 10s if words still faint
  if (window.innerWidth < 768 && firstWordOpacity < 0.5) {
    gsap.to(words, { opacity: 1, stagger: 0.05 });
  }
  ```

### 7. **Body Overflow Conflicts from Multiple Components**
- **Problem**: HamburgerMenu, modals, and homepage all independently manage body overflow
- **Fix**: Standardized overflow management pattern across all components with proper cleanup

## Files Modified

1. **components/GuidedJourneyModal.tsx**
   - Added early return when `!isOpen`
   - Improved body overflow cleanup logic
   - Prevents rendering of blocking elements when closed

2. **components/PrivacyPolicyModal.tsx**
   - Improved body overflow cleanup logic
   - Prevents conflicts with homepage overflow settings

3. **components/SplashScreen.tsx**
   - Fixed blob container sizing for mobile
   - Added padding to prevent overflow
   - Added debug logging for mobile viewport
   - Added Lottie event handlers for debugging
   - Improved viewport height calculation

4. **app/page.tsx**
   - Reduced main-container z-index from 30 to 10
   - Added MobileDebug component (development only)
   - Improved --vh recalculation with additional delay
   - Added debug logging for mobile

5. **components/Header.tsx**
   - Changed from className z-[60] to inline style z-50
   - Normalized z-index in stacking hierarchy

6. **components/BackgroundWrapper.tsx**
   - Changed from className z-classes to inline styles
   - Ensured proper z-index hierarchy

7. **components/HamburgerMenu.tsx**
   - Improved body overflow cleanup logic
   - Changed z-index from z-[70] to inline style z-60
   - Standardized with other component overflow management

8. **components/MobileDebug.tsx** (NEW)
   - Development-only component to diagnose mobile issues
   - Shows viewport dimensions, body overflow state, and high z-index elements
   - Only visible on mobile devices in development mode

## Testing Instructions

1. **Clear browser cache** on mobile device
2. **Open DevTools** (if testing on desktop with mobile emulation)
3. **Navigate to** http://localhost:3000 (or your deployed URL)
4. **Check console logs** for mobile debug information:
   - `[Mobile VH]` - Viewport height calculations
   - `[SplashScreen]` - Component initialization
   - `[SplashScreen VH]` - SplashScreen viewport calculations
5. **Check MobileDebug panel** at bottom of screen (development only)
   - Verify no high z-index elements are blocking content
   - Verify body overflow is not set to 'hidden' unexpectedly

## Additional Recommendations

### If Issue Persists:

1. **Check for GSAP Observer conflicts**:
   - The GSAP Observer with `preventDefault: true` blocks native scroll
   - This might prevent mobile browser toolbars from collapsing
   - Consider conditional `preventDefault` based on device type

2. **Test Lottie animation loading**:
   - Check if Lottie animation loads on mobile
   - Verify spiral_animation.json file size isn't too large
   - Consider lazy loading or reducing animation complexity

3. **Verify CSS custom properties**:
   - Ensure `--vh` is being set correctly
   - Check that `--header-height` matches actual header height
   - Use browser DevTools to inspect computed styles

4. **Check for third-party interference**:
   - Browser extensions (ad blockers, etc.)
   - Mobile browser settings (data saver mode)
   - Network issues preventing asset loading

## Cleanup After Testing

Once the issue is resolved, remove the debug components:

1. Remove `<MobileDebug />` from `app/page.tsx`
2. Remove debug console.log statements from:
   - `app/page.tsx`
   - `components/SplashScreen.tsx`
3. Delete `components/MobileDebug.tsx`

## Prevention for Future Development

1. **Use consistent z-index scale**:
   - Background: -1
   - Content: 1-10
   - Header/Navigation: 40-50
   - Overlays/Dropdowns: 60-80
   - Modals: 100-120
   - Tooltips: 130-150

2. **Test on real mobile devices early**:
   - Desktop emulation doesn't catch all mobile issues
   - Test on both iOS Safari and Android Chrome
   - Check different screen sizes (small phones, tablets)

3. **Use viewport units carefully**:
   - Always provide fallbacks for `dvh`
   - Test with mobile browser chrome visible/hidden
   - Consider using `svh` (small viewport height) for critical content

4. **Manage body overflow centrally**:
   - Consider a global modal manager
   - Use a counter to track multiple modals
   - Ensure cleanup on unmount
