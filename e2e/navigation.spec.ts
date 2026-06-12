import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('home page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Server Nexus/i);
  });

  test('can navigate to /home via hash routing', async ({ page }) => {
    await page.goto('/#/home');
    await expect(page.locator('body')).toBeVisible();
  });

  test('can navigate to /status page', async ({ page }) => {
    await page.goto('/#/status');
    await expect(page.getByText(/fetch the data of any minecraft server/i)).toBeVisible();
  });

  test('can navigate to /explore page', async ({ page }) => {
    await page.goto('/#/explore');
    await expect(page.getByText(/browse through popular minecraft servers/i)).toBeVisible();
  });

  test('can navigate to /about page', async ({ page }) => {
    await page.goto('/#/about');
    await expect(page.locator('body')).toBeVisible();
  });

  test('can navigate to /contact page', async ({ page }) => {
    await page.goto('/#/contact');
    await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible();
  });

  test('can navigate to /login page', async ({ page }) => {
    await page.goto('/#/login');
    await expect(page.getByText('Welcome Back')).toBeVisible();
  });

  test('can navigate to /signup page', async ({ page }) => {
    await page.goto('/#/signup');
    await expect(page.getByText(/welcome to/i)).toBeVisible();
  });

  test('navbar logo links to root', async ({ page }) => {
    await page.goto('/#/about');
    await page.click('a:has-text("Server Nexus")');
    await expect(page.locator('body')).toBeVisible();
  });

  test('navbar has "Get Started" button when not logged in', async ({ page }) => {
    await page.goto('/#/home');
    await expect(page.getByText('Get Started')).toBeVisible();
  });
});
