# Mobile Testing Checklist

## Pre-Testing Setup

- [ ] Clear browser cache on mobile device
- [ ] Ensure dev server is running (`npm run dev`)
- [ ] Have DevTools console open (if testing on desktop emulation)
- [ ] Test on real mobile devices (not just emulation)

## Critical Tests

### 1. Splash Screen Visibility
- [ ] **Brown background (#6a3f33) is visible**
- [ ] **Lottie spiral animation plays**
  - Check console for: `[SplashScreen] Lottie DOM loaded`
  - Check console for: `[SplashScreen] Lottie images loaded`
- [ ] **Spiral fades out after animation completes**
- [ ] **Blob with text fades in**
- [ ] **Text is readable (not too faint)**
  - Initial opacity should be 0.2 but increase as you scroll
  - If stuck at 0.2, mobile auto-reveal should trigger after 10s
- [ ] **Scrolling reveals text word by word**
- [ ] **After all text revealed, can scroll to next section**

### 2. Homepage Sections
- [ ] **Journey section loads and is visible**
- [ ] **WeWorkTogether cards section is visible**
- [ ] **VoicesOfTransformation carousel is visible**
- [ ] **ReadyToBegin CTA is visible**
- [ ] **Footer is visible**

### 3. Header Behavior
- [ ] **Header is hidden during splash screen**
- [ ] **Header appears after splash completes**
- [ ] **Header has correct background color**
- [ ] **Logo is visible and correct color**
- [ ] **Hamburger menu icon is visible**
- [ ] **Clicking hamburger opens menu**
- [ ] **Menu overlay covers screen properly**
- [ ] **Clicking close button closes menu**

### 4. Z-Index Stacking
- [ ] **No invisible overlays blocking content**
- [ ] **MobileDebug panel shows (if in dev mode)**
  - Check that no unexpected high z-index elements are listed
  - Verify body overflow is not 'hidden' when it shouldn't be
- [ ] **Content is clickable/tappable**
- [ ] **Scroll works properly**

### 5. Viewport Height
- [ ] **Content fits in viewport**
- [ ] **No content cut off at bottom**
- [ ] **Mobile browser toolbar doesn't hide content**
- [ ] **Rotating device recalculates layout properly**

## Console Checks

Look for these debug messages in console:

### Expected Messages (Good):
```
[Mobile VH] Set --vh to: X.XX px, innerHeight: XXX
[SplashScreen VH] Set --vh to: X.XX px, innerHeight: XXX
[SplashScreen] Container ref: XXX
[SplashScreen] Blob container ref: XXX
[SplashScreen] Initial setup complete
[SplashScreen] Container dimensions: { width: XXX, height: XXX }
[SplashScreen] Lottie DOM loaded
[SplashScreen] Lottie images loaded
```

### Warning Messages (Investigate):
```
[SplashScreen] Mobile auto-reveal triggered
[SplashScreen] Safety timeout triggered - forcing completion
```
These indicate fallback mechanisms activated - may suggest GSAP Observer issues.

### Error Messages (Critical):
- Any JavaScript errors
- Failed to load assets (404s)
- GSAP errors
- Lottie errors

## Device-Specific Tests

### iOS Safari
- [ ] Test on iPhone (various sizes: SE, 12/13, 14 Pro Max)
- [ ] Test in portrait orientation
- [ ] Test in landscape orientation
- [ ] Test with Safari toolbar visible
- [ ] Test after scrolling (toolbar hides)
- [ ] Test after rotating device

### Android Chrome
- [ ] Test on Android phone (various sizes)
- [ ] Test in portrait orientation
- [ ] Test in landscape orientation
- [ ] Test with Chrome toolbar visible
- [ ] Test after scrolling (toolbar hides)

### Tablet Devices
- [ ] Test on iPad (Safari)
- [ ] Test on Android tablet (Chrome)
- [ ] Test in portrait and landscape

## Performance Tests

- [ ] **Page loads within 3 seconds**
- [ ] **Lottie animation plays smoothly**
- [ ] **Scroll is smooth (no jank)**
- [ ] **Transitions are smooth**
- [ ] **No layout shifts**

## Edge Cases

- [ ] **Very small screens (320px width)**
- [ ] **Very tall screens (aspect ratio > 2:1)**
- [ ] **Slow network connection**
- [ ] **With ad blockers enabled**
- [ ] **With data saver mode enabled**
- [ ] **After refreshing page multiple times**
- [ ] **After navigating away and back**

## Modal Tests (If Applicable)

### Guided Journey Modal
- [ ] **Modal opens properly**
- [ ] **Modal content is visible**
- [ ] **Modal can be closed**
- [ ] **Body scroll is prevented when open**
- [ ] **Body scroll is restored when closed**
- [ ] **No z-index conflicts with other elements**

### Privacy Policy Modal
- [ ] **Modal opens properly**
- [ ] **Modal content is visible**
- [ ] **Modal can be closed**
- [ ] **Body scroll is prevented when open**
- [ ] **Body scroll is restored when closed**

## Regression Tests

After fixing, verify these still work:

- [ ] **Desktop version still works**
- [ ] **Tablet version still works**
- [ ] **All other pages work (About, Therapies, etc.)**
- [ ] **Navigation between pages works**
- [ ] **All animations work**
- [ ] **All interactive elements work**

## Known Issues to Monitor

1. **GSAP Observer with preventDefault**
   - May prevent mobile browser toolbar from collapsing
   - Monitor user feedback about scroll behavior

2. **Lottie Animation Size**
   - Large animation files may load slowly on mobile
   - Monitor loading times and consider optimization

3. **Multiple Body Overflow Managers**
   - If modals and hamburger menu open simultaneously (edge case)
   - Should be prevented by UI logic, but monitor

## Success Criteria

✅ **All critical tests pass**
✅ **No console errors**
✅ **Content is visible on all tested devices**
✅ **Scroll works properly**
✅ **Animations play smoothly**
✅ **No z-index conflicts**
✅ **Viewport height calculated correctly**

## If Issues Persist

1. **Check MobileDebug panel** for clues
2. **Review console logs** for error patterns
3. **Test with simplified version** (disable animations)
4. **Compare with desktop version** (what's different?)
5. **Test on different mobile browsers**
6. **Check network tab** for failed asset loads
7. **Review MOBILE_BLANK_SCREEN_FIXES.md** for additional recommendations

## Cleanup After Testing

Once all tests pass:

1. Remove `<MobileDebug />` from `app/page.tsx`
2. Remove debug console.log statements
3. Delete `components/MobileDebug.tsx`
4. Update this checklist with any new findings
5. Document any remaining known issues
