import { test, expect, devices } from '@playwright/test';

test.describe('Responsive layout', () => {
  test('desktop shows navigation links', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/#/home');
    // Desktop nav links are in a nav element with hidden lg:flex
    const nav = page.locator('nav.hidden.lg\\:flex');
    await expect(nav).toBeVisible();
  });

  test('mobile hides desktop navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#/home');
    // Desktop nav should be hidden on mobile
    const desktopNav = page.locator('nav.hidden.lg\\:flex');
    await expect(desktopNav).not.toBeVisible();
  });

  test('mobile shows hamburger menu icon', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#/home');
    const hamburger = page.locator('[aria-label="Hamburger"]');
    await expect(hamburger).toBeVisible();
  });

  test('hamburger menu opens on click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#/home');
    const hamburger = page.locator('[aria-label="Hamburger"]');
    await hamburger.click();
    // Menu items should appear
    await expect(page.locator('ul.menu.menu-sm')).toBeVisible();
  });

  test('logo is visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#/home');
    await expect(page.getByText('Server Nexus').first()).toBeVisible();
  });

  test('contact form is usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#/contact');
    await expect(page.getByPlaceholder('Herobrine Persson')).toBeVisible();
    await expect(page.getByPlaceholder('herobrine@nether.com')).toBeVisible();
    await expect(page.getByPlaceholder('What is this about?')).toBeVisible();
  });

  test('status page inputs are visible on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/#/status');
    await expect(page.getByPlaceholder('hypixel.net')).toBeVisible();
    await expect(page.getByPlaceholder('25565')).toBeVisible();
  });
});
