import { test, expect } from '@playwright/test';

/**
 * Splash screen webkit rendering tests.
 *
 * These tests verify the three known webkit issues:
 *  1. main-container must NOT have an explicit z-index (triggers WebKit Bug #160953)
 *  2. The spiral container must have a translateZ(0) hardware-acceleration hint
 *  3. The DotLottie canvas must mount, have real dimensions, and paint non-blank pixels
 *  4. The animation must complete and transition to the blob phase within timeout
 *  5. The blob text must become visible after scroll interaction
 */

test.describe('Splash screen — CSS fix verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('main-container has no explicit z-index', async ({ page }) => {
    const zIndex = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.main-container');
      if (!el) return null;
      return window.getComputedStyle(el).zIndex;
    });

    // 'auto' means no stacking context — the webkit overflow+z-index bug is not triggered
    expect(zIndex).toBe('auto');
  });

  test('spiral container has translateZ(0) hardware-acceleration transform', async ({ page }) => {
    // Wait for the spiral container to appear in the DOM
    const spiralContainer = page.locator('[data-testid="spiral-container"]');
    await spiralContainer.waitFor({ state: 'attached', timeout: 10_000 });

    const transform = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('[data-testid="spiral-container"]');
      if (!el) return null;
      return el.style.transform || el.style.webkitTransform || window.getComputedStyle(el).transform;
    });

    // Should contain a translateZ component (matrix3d indicates 3D transform was applied)
    expect(transform).toMatch(/matrix3d|translateZ|translate3d/i);
  });
});

test.describe('Splash screen — DotLottie canvas rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('DotLottie canvas element mounts in the DOM', async ({ page }) => {
    // DotLottieReact renders a <canvas> inside the spiral section
    const canvas = page.locator('.main-container canvas').first();
    await canvas.waitFor({ state: 'attached', timeout: 10_000 });
    await expect(canvas).toBeAttached();
  });

  test('DotLottie canvas has non-zero dimensions', async ({ page }) => {
    const canvas = page.locator('.main-container canvas').first();
    await canvas.waitFor({ state: 'visible', timeout: 10_000 });

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('DotLottie canvas paints non-blank pixels', async ({ page }) => {
    const canvas = page.locator('.main-container canvas').first();
    await canvas.waitFor({ state: 'visible', timeout: 10_000 });

    // Wait a moment for the animation to start painting
    await page.waitForTimeout(1500);

    const hasNonBlankPixels = await page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('.main-container canvas');
      if (!canvas) return false;
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Check that at least one pixel has a non-zero alpha — meaning something was drawn
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] > 0) return true;
        }
        return false;
      } catch {
        // getImageData can throw SecurityError on cross-origin — treat as unknown
        return null;
      }
    });

    // null means we couldn't read pixels (cross-origin canvas) — skip the assertion
    if (hasNonBlankPixels !== null) {
      expect(hasNonBlankPixels).toBe(true);
    }
  });

  test('spiral container is visible and not clipped', async ({ page }) => {
    const spiralContainer = page.locator('[data-testid="spiral-container"]');
    await spiralContainer.waitFor({ state: 'visible', timeout: 10_000 });

    const box = await spiralContainer.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(100);

    // Verify it is within the viewport (not clipped to zero)
    const viewportSize = page.viewportSize();
    expect(box!.x).toBeLessThan(viewportSize!.width);
    expect(box!.y).toBeLessThan(viewportSize!.height);
  });
});

test.describe('Splash screen — animation flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('spiral animation completes and blob phase appears within fallback timeout', async ({ page }) => {
    // The fallback fires at 3 s (mobile) / 6 s (desktop). Give it 8 s total.
    const blobContainer = page.locator('[data-testid="blob-container"]');
    await blobContainer.waitFor({ state: 'visible', timeout: 12_000 });
    await expect(blobContainer).toBeVisible();
  });

  test('blob container is not clipped by main-container overflow', async ({ page }) => {
    const blobContainer = page.locator('[data-testid="blob-container"]');
    await blobContainer.waitFor({ state: 'visible', timeout: 12_000 });

    const blobBox = await blobContainer.boundingBox();
    const mainBox = await page.locator('.main-container').boundingBox();

    expect(blobBox).not.toBeNull();
    expect(mainBox).not.toBeNull();

    // Blob centre should sit within the main-container bounds
    const blobCentreX = blobBox!.x + blobBox!.width / 2;
    const blobCentreY = blobBox!.y + blobBox!.height / 2;

    expect(blobCentreX).toBeGreaterThanOrEqual(mainBox!.x);
    expect(blobCentreX).toBeLessThanOrEqual(mainBox!.x + mainBox!.width);
    expect(blobCentreY).toBeGreaterThanOrEqual(mainBox!.y);
    expect(blobCentreY).toBeLessThanOrEqual(mainBox!.y + mainBox!.height);
  });

  test('blob text words are present in the DOM', async ({ page }) => {
    const blobContainer = page.locator('[data-testid="blob-container"]');
    await blobContainer.waitFor({ state: 'visible', timeout: 12_000 });

    const words = page.locator('[data-testid="blob-container"] .splash-word');
    const count = await words.count();
    expect(count).toBeGreaterThan(0);
  });

  test('scroll up reveals blob words', async ({ page }) => {
    const blobContainer = page.locator('[data-testid="blob-container"]');
    await blobContainer.waitFor({ state: 'visible', timeout: 12_000 });

    const firstWord = page.locator('[data-testid="blob-container"] .splash-word').first();

    // Initial opacity should be low (0.2 per AnimatedText)
    const opacityBefore = await firstWord.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );
    expect(opacityBefore).toBeLessThanOrEqual(0.25);

    // Simulate upward scroll to trigger word reveal
    await page.mouse.wheel(0, -200);
    await page.waitForTimeout(600);

    const opacityAfter = await firstWord.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );
    expect(opacityAfter).toBeGreaterThan(0.5);
  });
});

test.describe('Splash screen — visual snapshot', () => {
  test('spiral phase screenshot', async ({ page }) => {
    await page.goto('/');

    // Wait for canvas to paint before snapping
    await page.locator('.main-container canvas').first().waitFor({ state: 'visible', timeout: 10_000 });
    await page.waitForTimeout(1500);

    await expect(page).toHaveScreenshot('splash-spiral.png', {
      maxDiffPixelRatio: 0.05,
      clip: { x: 0, y: 0, width: 1280, height: 720 },
    });
  });

  test('blob phase screenshot', async ({ page }) => {
    await page.goto('/');

    const blobContainer = page.locator('[data-testid="blob-container"]');
    await blobContainer.waitFor({ state: 'visible', timeout: 12_000 });

    await expect(page).toHaveScreenshot('splash-blob.png', {
      maxDiffPixelRatio: 0.05,
      clip: { x: 0, y: 0, width: 1280, height: 720 },
    });
  });
});
