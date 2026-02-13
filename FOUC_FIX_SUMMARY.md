# FOUC (Flash of Unstyled Content) Fix Summary

## Problem Identified from New Screenshots

The new screenshots revealed the actual issue:
1. **Image 1**: Blob with text appears correctly
2. **Image 2**: Screen goes completely blank
3. **Image 3**: Remains blank

This is a **Flash of Unstyled Content (FOUC)** combined with **GSAP animation timing issues**.

## Root Cause

### The Sequence of Events (Before Fix):

1. **React renders component** → Both spiral and blob containers exist in DOM
2. **Brief moment** → Blob is visible (FOUC) before GSAP runs
3. **useEffect runs** → GSAP sets blob opacity to 0
4. **Lottie completes** → Triggers transition timeline
5. **Timeline animates** → Blob fades in
6. **useEffect re-runs** (due to state changes) → **RESETS blob to opacity 0** ← THE BUG!
7. **Screen stays blank** → Animation state is lost

### Why This Happened:

The main useEffect had dependencies `[onCompleteSafe, sequenceComplete]`, which meant:
- Every time `sequenceComplete` changed, the effect re-ran
- Re-running the effect reset GSAP properties
- This killed ongoing animations and reset opacity values
- The blob would fade in, then immediately reset to opacity 0

## The Fix

### 1. **Inline Initial Styles** (Prevent FOUC)

Added inline `style` props to prevent flash before GSAP initializes:

```typescript
// Spiral starts visible
<div
  ref={spiralContainerRef}
  style={{ opacity: sequenceComplete ? 0 : 1 }}
>

// Blob starts hidden
<div
  ref={blobContainerRef}
  style={{ opacity: sequenceComplete ? 1 : 0 }}
>
```

### 2. **Split useEffect into Two** (Prevent Re-initialization)

**Before** (BAD):
```typescript
useEffect(() => {
  // Both initialization AND completion logic
  if (sequenceComplete) { /* final state */ }
  else { /* initial state */ }
  // Timeouts, etc.
}, [onCompleteSafe, sequenceComplete]); // ← Re-runs on state change!
```

**After** (GOOD):
```typescript
// Effect 1: Only handles completion state
useEffect(() => {
  if (!sequenceComplete) return;
  // Set final state
}, [sequenceComplete]);

// Effect 2: Only runs ONCE on mount
useEffect(() => {
  // Initial setup
  // Timeouts
  // Return cleanup
}, []); // ← Empty deps, runs once!
```

### 3. **Added Defensive Checks in Timeline**

```typescript
const handleLottieComplete = useCallback(() => {
  // Prevent double execution
  if (lottieCompletedRef.current) return;
  
  // Kill existing timeline to prevent conflicts
  if (timelineRef.current) {
    timelineRef.current.kill();
  }
  
  // Create new timeline
  const tl = gsap.timeline({
    onStart: () => console.log('Timeline started'),
    onComplete: () => console.log('Timeline completed')
  });
  
  // ... animations
}, [onCompleteSafe]);
```

### 4. **Enhanced Debug Logging**

Added console logs at every critical step:
- `[SplashScreen] Initializing...`
- `[SplashScreen] Lottie animation completed`
- `[SplashScreen] Transition timeline started`
- `[SplashScreen] Fading out spiral`
- `[SplashScreen] Fading in blob`
- `[SplashScreen] Blob fade-in complete`
- `[SplashScreen] Found X words to reveal`

## Testing the Fix

### What to Look For:

1. **No FOUC on page load** - Spiral should be visible immediately, blob hidden
2. **Smooth transition** - Spiral fades out, blob fades in, no flashing
3. **Blob stays visible** - Should NOT disappear after fading in
4. **Console logs show progression** - Check that timeline completes without interruption

### Expected Console Output:

```
[SplashScreen] Initializing...
[SplashScreen] Initial GSAP setup complete
[SplashScreen] Container dimensions: { width: XXX, height: XXX }
[SplashScreen VH] Set --vh to: X.XX px
[SplashScreen] Lottie DOM loaded
[SplashScreen] Lottie images loaded
[SplashScreen] Lottie animation completed, starting transition
[SplashScreen] Transition timeline started
[SplashScreen] Fading out spiral
[SplashScreen] Fading in blob
[SplashScreen] Blob fade-in complete
[SplashScreen] Found 42 words to reveal
```

### Warning Signs (Should NOT Appear):

```
[SplashScreen] Lottie complete already handled, skipping
[SplashScreen] Missing refs for transition
[SplashScreen] Blob container ref lost
```

If these appear, it indicates refs are being lost or the component is re-mounting.

## Technical Details

### React Hydration & GSAP Timing

The issue was a classic **React hydration + animation library** timing problem:

1. **Server-side render** (or initial render) creates DOM with default styles
2. **Client-side hydration** attaches React event handlers
3. **useEffect runs** to initialize animations
4. **State changes** trigger re-renders
5. **useEffect re-runs** due to dependencies
6. **Animations get reset** mid-flight

### Solution Pattern

The solution follows this pattern:

1. **Inline styles** for initial state (prevents FOUC)
2. **Single initialization** useEffect with empty deps
3. **Separate effects** for different concerns
4. **useCallback** for stable function references
5. **Refs** to track state without causing re-renders

### Why Empty Dependency Array Works

```typescript
useEffect(() => {
  // Setup code
  return () => {
    // Cleanup code
  };
}, []); // Empty deps = runs once on mount, cleanup on unmount
```

This ensures:
- Initialization happens exactly once
- No re-initialization on state changes
- Cleanup only happens on unmount
- GSAP animations run uninterrupted

## Additional Fixes Applied

### 1. Mobile Auto-Reveal (10s timeout)

If GSAP Observer doesn't trigger on mobile, text auto-reveals after 10 seconds:

```typescript
setTimeout(() => {
  if (window.innerWidth < 768 && firstWordOpacity < 0.5) {
    gsap.to(words, { opacity: 1, stagger: 0.05 });
  }
}, 10000);
```

### 2. Lottie Fallback (6s timeout)

If Lottie doesn't complete within 6 seconds, skip to blob:

```typescript
setTimeout(() => {
  if (!lottieCompletedRef.current) {
    handleLottieComplete();
  }
}, 6000);
```

### 3. Absolute Safety (30s timeout)

Force completion after 30 seconds regardless of state:

```typescript
setTimeout(() => {
  if (!isCompleting.current) {
    // Force complete
  }
}, 30000);
```

## Files Modified

1. **components/SplashScreen.tsx**
   - Added inline initial styles
   - Split useEffect into two separate effects
   - Made handleLottieComplete a useCallback
   - Added timeline conflict prevention
   - Enhanced debug logging
   - Improved mobile safety timeouts

## Verification Checklist

- [ ] No flash of blob on page load
- [ ] Spiral animation plays smoothly
- [ ] Spiral fades out completely
- [ ] Blob fades in smoothly
- [ ] Blob STAYS VISIBLE (doesn't disappear)
- [ ] Text is readable (opacity 0.2 initially)
- [ ] Scrolling reveals text word by word
- [ ] Console shows complete progression
- [ ] No error messages in console
- [ ] Works on mobile devices
- [ ] Works on desktop
- [ ] Works after page refresh
- [ ] Works after navigating away and back

## If Issue Persists

If the blob still disappears:

1. **Check console logs** - Look for the exact sequence of events
2. **Check for component re-mounts** - Look for multiple "Initializing..." messages
3. **Check parent component** - Ensure `app/page.tsx` isn't re-mounting SplashScreen
4. **Check GSAP version** - Ensure compatible version
5. **Check for CSS conflicts** - Ensure no CSS is overriding opacity
6. **Test with animations disabled** - Temporarily set blob to `opacity: 1` inline to verify it's an animation issue

## Related Issues Fixed

This fix also resolves:
- The "blob appears for split second before spiral" issue mentioned by user
- Mobile blank screen issue
- Z-index conflicts
- Body overflow management conflicts

All these were symptoms of the same root cause: **useEffect re-running and resetting animation state**.
