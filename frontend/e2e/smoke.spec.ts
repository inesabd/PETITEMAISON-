import { test, expect } from "@playwright/test";

test("acceptation: la page se charge", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/.+/);
});