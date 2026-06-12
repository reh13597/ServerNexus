import { test, expect } from '@playwright/test';

test.describe('Server status page', () => {
  test('status page shows IP and port inputs', async ({ page }) => {
    await page.goto('/#/status');
    await expect(page.getByPlaceholder('hypixel.net')).toBeVisible();
    await expect(page.getByPlaceholder('25565')).toBeVisible();
  });

  test('fetch button is disabled without IP input', async ({ page }) => {
    await page.goto('/#/status');
    const fetchBtn = page.getByRole('button', { name: /fetch server data/i });
    await expect(fetchBtn).toBeDisabled();
  });

  test('fetch button becomes enabled with valid IP', async ({ page }) => {
    await page.goto('/#/status');
    await page.getByPlaceholder('hypixel.net').fill('hypixel.net');
    const fetchBtn = page.getByRole('button', { name: /fetch server data/i });
    await expect(fetchBtn).toBeEnabled();
  });

  test('shows fetching state when button is clicked', async ({ page }) => {
    await page.goto('/#/status');
    await page.getByPlaceholder('hypixel.net').fill('hypixel.net');

    // Intercept the API call and delay it
    await page.route('**/api.mcstatus.io/**', async (route) => {
      await new Promise((r) => setTimeout(r, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          online: true,
          host: 'hypixel.net',
          port: 25565,
          ip_address: '172.65.238.142',
          version: { name_raw: '1.20.4', name_clean: '1.20.4', name_html: '1.20.4', protocol: 765 },
          players: { online: 45000, max: 100000 },
          motd: { raw: 'Welcome', clean: 'Welcome', html: 'Welcome' },
          srv_record: { host: 'mc.hypixel.net', port: 25565 },
        }),
      });
    });

    await page.getByRole('button', { name: /fetch server data/i }).click();
    await expect(page.getByText(/fetching/i)).toBeVisible();
  });

  test('page heading is visible', async ({ page }) => {
    await page.goto('/#/status');
    await expect(page.getByText(/fetch the data of any minecraft server/i)).toBeVisible();
  });
});
