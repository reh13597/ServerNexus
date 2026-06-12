import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('login form renders with email and password fields', async ({ page }) => {
    await page.goto('/#/login');
    await expect(page.getByPlaceholder('herobrine@nether.com')).toBeVisible();
    await expect(page.getByPlaceholder('Ihatesteve123$')).toBeVisible();
  });

  test('login button is disabled with empty fields', async ({ page }) => {
    await page.goto('/#/login');
    const loginBtn = page.getByRole('button', { name: /login/i });
    await expect(loginBtn).toBeDisabled();
  });

  test('signup form renders with all required fields', async ({ page }) => {
    await page.goto('/#/signup');
    await expect(page.getByPlaceholder('herobrine@nether.com')).toBeVisible();
    await expect(page.getByPlaceholder('herobrine_goat_666')).toBeVisible();
    await expect(page.getByPlaceholder('Ihatesteve123$')).toBeVisible();
  });

  test('signup button is disabled with empty fields', async ({ page }) => {
    await page.goto('/#/signup');
    const signupBtn = page.getByRole('button', { name: /sign up/i });
    await expect(signupBtn).toBeDisabled();
  });

  test('login page has link to signup', async ({ page }) => {
    await page.goto('/#/login');
    const signupLink = page.getByRole('link', { name: /sign up/i });
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveAttribute('href', '#/signup');
  });

  test('signup page has link to login', async ({ page }) => {
    await page.goto('/#/signup');
    const loginLink = page.getByRole('link', { name: /login/i });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '#/login');
  });

  test('entering valid email and password enables login button', async ({ page }) => {
    await page.goto('/#/login');
    await page.getByPlaceholder('herobrine@nether.com').fill('test@example.com');
    await page.getByPlaceholder('Ihatesteve123$').fill('MyStrong1!');
    const loginBtn = page.getByRole('button', { name: /login/i });
    await expect(loginBtn).toBeEnabled();
  });
});
