import { test, expect } from "@playwright/test";

test.describe("Auth pages", () => {
  test("/login page renders login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/DealFlow/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("/register page renders registration form", async ({ page }) => {
    await page.goto("/register");
    await expect(page).toHaveTitle(/DealFlow/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test("/forgot-password page renders reset form", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page).toHaveTitle(/DealFlow/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test("/update-password page renders update form", async ({ page }) => {
    await page.goto("/update-password");
    await expect(page).toHaveTitle(/DealFlow/i);
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });
});

test.describe("Auth redirects", () => {
  test("unauthenticated user is redirected from /dashboard/admin", async ({
    page,
  }) => {
    await page.goto("/dashboard/admin");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("/login");
  });

  test("unauthenticated user is redirected from /dashboard/buyer", async ({
    page,
  }) => {
    await page.goto("/dashboard/buyer");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("/login");
  });

  test("unauthenticated user is redirected from /dashboard/seller", async ({
    page,
  }) => {
    await page.goto("/dashboard/seller");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("/login");
  });

  test("unauthenticated user is redirected from /dashboard/broker", async ({
    page,
  }) => {
    await page.goto("/dashboard/broker");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("/login");
  });
});
