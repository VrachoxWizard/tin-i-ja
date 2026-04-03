import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("homepage loads and has the correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/DealFlow/i);
  });

  test("homepage has main heading", async ({ page }) => {
    await page.goto("/");
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
  });

  test("/buy page loads", async ({ page }) => {
    await page.goto("/buy");
    await expect(page).toHaveTitle(/DealFlow/i);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("/sell page loads", async ({ page }) => {
    await page.goto("/sell");
    await expect(page).toHaveTitle(/DealFlow/i);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("/valuate page loads", async ({ page }) => {
    await page.goto("/valuate");
    await expect(page).toHaveTitle(/DealFlow/i);
  });

  test("/contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveTitle(/DealFlow/i);
  });

  test("/listings page loads", async ({ page }) => {
    await page.goto("/listings");
    await expect(page).toHaveTitle(/DealFlow/i);
  });

  test("/privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page).toHaveTitle(/DealFlow/i);
  });

  test("/terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page).toHaveTitle(/DealFlow/i);
  });

  test("/succession page loads", async ({ page }) => {
    await page.goto("/succession");
    await expect(page).toHaveTitle(/DealFlow/i);
  });
});
