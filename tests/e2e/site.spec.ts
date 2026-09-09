import { expect, test } from "@playwright/test";

test.describe("public navigation", () => {
	test("navigates from the homepage to an article", async ({ page }) => {
		await page.goto("/");

		await expect(page).toHaveTitle(/Imperi e Rivoluzioni/);
		await expect(page.locator("#articles-title")).toHaveText("Articoli");

		await page.getByRole("link", { name: "Articoli" }).first().click();
		await expect(page).toHaveURL(/\/articles\/?$/);
		await expect(page.getByRole("heading", { name: "Articoli", level: 1 })).toBeVisible();

		await page.getByRole("link", { name: /Leggi l'articolo/ }).click();
		await expect(page).toHaveURL(/\/articles\/i-semi-del-militarismo-giapponese\/?$/);
		await expect(page.getByRole("heading", { level: 1 })).toContainText("I semi del militarismo giapponese");
		await expect(page.getByRole("heading", { name: /Il motto Fukoku Kyōhei/ })).toBeVisible();
	});

	test("opens the mobile navigation", async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto("/");

		const menuButton = page.getByRole("button", { name: "Apri il menu di navigazione" });
		await expect(menuButton).toHaveAttribute("aria-expanded", "false");
		await menuButton.click();

		await expect(menuButton).toHaveAttribute("aria-expanded", "true");
		await expect(page.locator("#mobile-navigation")).toBeVisible();
		await expect(page.locator("#mobile-navigation").getByRole("link", { name: "Articoli" })).toBeVisible();
	});
});
