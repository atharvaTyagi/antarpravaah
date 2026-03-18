# Quick Testing Guide - Mobile Viewport Fix

## 🚀 Dev Server
**Status:** ✅ Running
**URL:** http://localhost:3000

---

## 📱 What to Test

### Pages to Check:
1. **Homepage** (`/`) - Has splash screen + 6 sections
2. **Approach** (`/approach`) - Has 5 sections with pathways cards

### What to Look For:

#### ✅ Good (Fixed):
- Sections fill entire viewport height (no gaps)
- Content reaches bottom of screen
- No empty white/colored space at bottom
- Smooth transitions between sections
- Splash screen fills entire screen

#### ❌ Bad (If still broken):
- Large gaps at bottom of sections
- Content doesn't reach screen bottom
- Visible empty space below content
- Sections appear "squished"

---

## 🔍 Quick Visual Test

### Desktop (Easy Check):
1. Open http://localhost:3000
2. **Expected:** Splash screen fills entire browser window
3. Scroll through splash → See homepage
4. **Expected:** Each section fills your entire window height

### Mobile (Important Check):

#### Using Phone:
1. Get your phone's IP: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Find your local IP (e.g., 192.168.1.100)
3. On phone, open: `http://YOUR_IP:3000`
4. **Test both portrait and landscape**

#### Using Chrome DevTools:
1. Open http://localhost:3000
2. Press `F12` → Click device toggle (phone icon)
3. Select "iPhone 13 Pro" or "Pixel 5"
4. Test different devices
5. **Scroll through entire page**

---

## 📊 Test Scenarios

### Scenario 1: Splash Screen
```
✅ Check: Full screen coverage
🔍 Look for: No gaps around splash screen text/animation
📱 Test: Both orientations on mobile
```

### Scenario 2: Homepage Sections
```
✅ Check: 6 sections all fill viewport
   - The Journey
   - Journey CTA (teal card)
   - We Work Together (card stack)
   - Voices testimonials
   - Ready to Begin
   - Footer

🔍 Look for: Each section should extend edge-to-edge
📱 Test: Scroll through all sections
```

### Scenario 3: Approach Page
```
✅ Check: 5 sections fill properly
   - Intro with spiral
   - Pathways (4 cards)
   - Thoughts & Ponderings
   - CTA
   - Footer

🔍 Look for: No empty space in any section
📱 Test: Cards scroll works smoothly
```

---

## 🐛 Known Issues (Expected)

### Mobile Browser Toolbar Behavior:
- URL bar shows when page first loads ✅ Normal
- URL bar hides when scrolling down ✅ Normal
- **Our scroll-lock system prevents URL bar collapse** ⚠️ Known limitation
  - This is documented in CLAUDE.md
  - Related to GSAP Observer with `preventDefault: true`
  - Not a viewport height issue

### What This Means:
- Content **will** fill screen properly ✅
- URL bar **won't** auto-hide during scroll interactions ⚠️
- This is a **feature** vs **browser UX tradeoff** of the scroll-lock architecture

---

## 📸 Quick Screenshot Guide

### Take Screenshots of:
1. **Homepage (mobile portrait)** - Splash screen
2. **Homepage (mobile portrait)** - Journey section
3. **Homepage (mobile portrait)** - We Work Together cards
4. **Approach (mobile portrait)** - Intro section
5. **Approach (mobile portrait)** - Pathways section

### Share Screenshots If:
- ❌ You see empty space at bottom of sections
- ❌ Content doesn't fill screen
- ❌ Sections appear broken
- ✅ Everything looks good (so I can see success!)

---

## 🔧 Technical Details

### What We Fixed:
| Issue | Solution |
|-------|----------|
| Duplicate inline CSS | Removed from page files |
| Wrong CSS cascade | Fixed in globals.css |
| Inconsistent heights | Single source of truth |
| Missing fallbacks | Proper 3-layer fallback |

### Browser Support:
| Browser | Method | Status |
|---------|--------|--------|
| iOS Safari 15.4+ | `100dvh` | ✅ Best |
| Chrome 108+ | `100dvh` | ✅ Best |
| Firefox 110+ | `100dvh` | ✅ Best |
| Older browsers | `var(--vh)` JS | ✅ Good |
| Ancient browsers | `100vh` | ⚠️ OK |

---

## 💡 Quick Comparison

### Before Fix (What Was Wrong):
```css
/* Page had inline CSS competing with globals.css */
.section-height {
  height: calc(100vh - 90px);           /* Line 1 */
  height: calc(var(--vh) * 100 - 90px); /* Overwrites Line 1 */
}
@supports (height: 100dvh) {
  .section-height {
    height: calc(100dvh - 90px);        /* Might not apply */
  }
}
```
**Result:** Unpredictable heights, gaps at bottom

### After Fix (Current):
```css
/* Only in globals.css, proper cascade */
.section-height {
  height: calc(100vh - var(--header-height));
  height: calc(var(--vh, 1vh) * 100 - var(--header-height));
}
@supports (height: 100dvh) {
  .section-height {
    height: calc(100dvh - var(--header-height));
  }
}
```
**Result:** Consistent heights, full viewport fill

---

## ✅ Success Criteria

### You know it's working when:
- [ ] Splash screen fills entire screen (no gaps)
- [ ] Homepage sections reach screen bottom
- [ ] Approach page sections reach screen bottom
- [ ] No visible empty space at bottom of any section
- [ ] Content stays consistent when rotating device
- [ ] All sections feel "full screen"

### If something looks wrong:
1. Take a screenshot
2. Note which page and section
3. Note device/browser (e.g., "iPhone Safari, Portrait")
4. Share details so I can investigate

---

## 🎯 Priority Test Cases

### High Priority (Must Check):
1. ✅ Mobile Safari (iPhone) - Portrait orientation
2. ✅ Mobile Chrome (Android) - Portrait orientation
3. ✅ Desktop Chrome - Full screen view

### Medium Priority (Should Check):
4. ✅ Mobile landscape orientations
5. ✅ Tablet views (iPad)
6. ✅ Desktop Firefox/Edge

### Low Priority (Nice to Check):
7. ✅ Very small screens (iPhone SE)
8. ✅ Very large screens (desktop 4K)
9. ✅ Split screen mode on tablets

---

## 📞 Quick Contact

If you see issues:
1. **Screenshot** the problem
2. **Note** the device/browser
3. **Describe** what looks wrong
4. I'll investigate immediately

If everything works:
1. ✅ Confirm "Looks good!"
2. We can close this issue
3. Move on to next task

---

**Remember:** The dev server is running at http://localhost:3000 🚀
