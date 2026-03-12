import { test, expect } from "@playwright/test";

test("smoke: load app shell", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page.getByText("Wedding Four Cut")).toBeVisible();
});
