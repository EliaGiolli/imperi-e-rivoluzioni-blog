import { expect, test, type Page } from "@playwright/test";

/**
 * Every destination in NAV_LINKS, in the order the navbar renders them. Each entry names
 * the h1 the route is supposed to answer with, so a link that resolves to the wrong page
 * — or to the 404 — fails rather than passing on the URL alone.
 */
const NAV_DESTINATIONS = [
	{ label: "Chi sono", path: "/about", heading: /^Chi sono e perché scrivo$/ },
	{ label: "Articoli", path: "/articles", heading: /^Articoli$/ },
	{ label: "Letture consigliate", path: "/readings", heading: /^Letture per capire il presente$/ },
	{ label: "Temi", path: "/topics", heading: /^L'indice dei percorsi$/ },
	{ label: "Contatti", path: "/contacts", heading: /^Mettiamo in ordine il problema\.$/ },
];

/** The `dark` class has to be read exactly: the html element also carries `dark:` utilities. */
const isDark = (page: Page) => page.evaluate(() => document.documentElement.classList.contains("dark"));

/**
 * Waits for a client-side navigation's view transition to finish. While it animates, the
 * browser hit-tests against the transition overlay, so a click fired straight after the new
 * page appears is swallowed and the next navigation silently never happens.
 * Astro clears `data-astro-transition` on <html> once the transition has finished.
 */
const transitionFinished = (page: Page) =>
	expect(page.locator("html")).not.toHaveAttribute("data-astro-transition", /.*/);

test.describe("public navigation", () => {
	test("navigates from the homepage to an article", async ({ page }) => {
		await page.goto("/");

		await expect(page).toHaveTitle(/Imperi e Rivoluzioni/);
		await expect(page.locator("#articles-title")).toHaveText("Articoli");

		// Scoped and exact: the homepage's "Tutti gli articoli" CTA would match a bare substring search.
		await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Articoli", exact: true }).click();
		await expect(page).toHaveURL(/\/articles\/?$/);
		await expect(page.getByRole("heading", { name: "Articoli", level: 1 })).toBeVisible();
		await transitionFinished(page);

		await page.getByRole("link", { name: /Leggi l'articolo/ }).first().click();
		await expect(page).toHaveURL(/\/articles\/i-semi-del-militarismo-giapponese\/?$/);
		await expect(page.getByRole("heading", { level: 1 })).toContainText("I semi del militarismo giapponese");
		await expect(page.getByRole("heading", { name: /Il motto Fukoku Kyōhei/ })).toBeVisible();
	});

	test("resolves every link in the navbar", async ({ page }) => {
		await page.goto("/");

		const mainNav = page.getByRole("navigation", { name: "Main navigation" });

		for (const { label, path, heading } of NAV_DESTINATIONS) {
			const link = mainNav.getByRole("link", { name: label, exact: true });

			await link.click();
			await expect(page).toHaveURL(new RegExp(`${path}/?$`));
			await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
			await expect(link).toHaveAttribute("aria-current", "page");
			await transitionFinished(page);
		}

		// The logo closes the loop back to the homepage.
		await page.getByRole("link", { name: "Homepage" }).click();
		await expect(page).toHaveURL(/\/$/);
		await expect(page.getByRole("heading", { name: /^Imperi e rivoluzioni\.$/, level: 1 })).toBeVisible();
	});

	test("opens the mobile navigation and follows a link", async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto("/");

		const menuButton = page.getByRole("button", { name: "Apri il menu di navigazione" });
		await expect(menuButton).toHaveAttribute("aria-expanded", "false");
		await menuButton.click();

		await expect(menuButton).toHaveAttribute("aria-expanded", "true");
		const mobileNav = page.locator("#mobile-navigation");
		await expect(mobileNav).toBeVisible();
		await expect(mobileNav.getByRole("link", { name: "Articoli", exact: true })).toBeVisible();
		await expect(mobileNav.getByRole("link", { name: "Chi sono", exact: true })).toBeVisible();

		// The mobile menu uses the shorter wording, and closes itself on the way out.
		await mobileNav.getByRole("link", { name: "Letture", exact: true }).click();
		await expect(page).toHaveURL(/\/readings\/?$/);
		await expect(page.getByRole("heading", { name: /^Letture per capire il presente$/, level: 1 })).toBeVisible();
		await expect(menuButton).toHaveAttribute("aria-expanded", "false");
	});

	test("marks the open section in the navbar", async ({ page }) => {
		const mainNav = page.getByRole("navigation", { name: "Main navigation" });

		await page.goto("/articles");
		await expect(mainNav.getByRole("link", { name: "Articoli" })).toHaveAttribute("aria-current", "page");
		await expect(mainNav.getByRole("link", { name: "Temi" })).not.toHaveAttribute("aria-current", /.*/);

		// A single article is not the archive, but the archive link still owns the section.
		await page.goto("/articles/i-semi-del-militarismo-giapponese");
		await expect(mainNav.getByRole("link", { name: "Articoli" })).toHaveAttribute("aria-current", "true");
	});
});

test.describe("homepage tabs", () => {
	for (const group of ["Seleziona un articolo", "Seleziona una lettura"]) {
		test(`follows the WAI-ARIA keyboard pattern in "${group}"`, async ({ page }) => {
			await page.goto("/");
			// Alpine strips every x-cloak when it starts; keys pressed before that would be lost.
			await expect(page.locator("[x-cloak]")).toHaveCount(0);

			const tabs = page.getByRole("tablist", { name: group }).getByRole("tab");
			await expect(tabs).toHaveCount(3);

			/** Exactly one tab selected, focused and in the tab order, and only its panel shown. */
			const expectActive = async (active: number) => {
				for (let index = 0; index < 3; index++) {
					const tab = tabs.nth(index);
					const panel = page.locator(`#${await tab.getAttribute("aria-controls")}`);
					const isActive = index === active;

					await expect(tab).toHaveAttribute("aria-selected", String(isActive));
					await expect(tab).toHaveAttribute("tabindex", isActive ? "0" : "-1");
					await (isActive ? expect(panel).toBeVisible() : expect(panel).toBeHidden());
				}
				await expect(tabs.nth(active)).toBeFocused();
			};

			await tabs.first().focus();

			await page.keyboard.press("ArrowRight");
			await expectActive(1);
			await page.keyboard.press("ArrowRight");
			await expectActive(2);
			await page.keyboard.press("ArrowRight");
			await expectActive(0); // wraps forwards

			await page.keyboard.press("ArrowLeft");
			await expectActive(2); // wraps backwards

			await page.keyboard.press("Home");
			await expectActive(0);
			await page.keyboard.press("End");
			await expectActive(2);

			// Roving tabindex: Tab leaves the tablist straight into the active panel.
			await page.keyboard.press("Tab");
			await expect(page.locator(`#${await tabs.nth(2).getAttribute("aria-controls")}`)).toBeFocused();
		});
	}

	test("switches panels on click", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("[x-cloak]")).toHaveCount(0);

		const tabs = page.getByRole("tablist", { name: "Seleziona una lettura" }).getByRole("tab");
		const firstPanel = page.locator(`#${await tabs.nth(0).getAttribute("aria-controls")}`);
		const secondPanel = page.locator(`#${await tabs.nth(1).getAttribute("aria-controls")}`);

		await tabs.nth(1).click();

		await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
		await expect(secondPanel).toBeVisible();
		await expect(firstPanel).toBeHidden();
	});
});

test.describe("theme toggle", () => {
	// Pinned so the starting point is the light theme whatever the machine running this prefers.
	test.use({ colorScheme: "light" });

	test("remembers the chosen theme across navigation and reloads", async ({ page }) => {
		await page.goto("/");

		const toggle = page.getByRole("button", { name: "Tema scuro" });
		await expect(toggle).toHaveAttribute("aria-pressed", "false");
		expect(await isDark(page)).toBe(false);

		await toggle.click();
		await expect(toggle).toHaveAttribute("aria-pressed", "true");
		await expect.poll(() => isDark(page)).toBe(true);

		// A client-side navigation replaces the html attributes, so the class has to be re-applied.
		await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Temi", exact: true }).click();
		await expect(page).toHaveURL(/\/topics\/?$/);
		expect(await isDark(page)).toBe(true);

		// A full reload has to pick the choice back up from localStorage, before the first paint.
		await page.reload();
		expect(await isDark(page)).toBe(true);
		await expect(page.getByRole("button", { name: "Tema scuro" })).toHaveAttribute("aria-pressed", "true");

		await page.getByRole("button", { name: "Tema scuro" }).click();
		await expect.poll(() => isDark(page)).toBe(false);
	});

	test("follows the operating system when no choice has been made", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/");

		expect(await isDark(page)).toBe(true);
		await expect(page.getByRole("button", { name: "Tema scuro" })).toHaveAttribute("aria-pressed", "true");
	});
});

test.describe("client-side navigation", () => {
	test("keeps Alpine working on the page it swaps in", async ({ page }) => {
		await page.goto("/");

		await page
			.getByRole("navigation", { name: "Main navigation" })
			.getByRole("link", { name: "Letture consigliate", exact: true })
			.click();
		await expect(page).toHaveURL(/\/readings\/?$/);

		// View transitions replace the body, so the tag filter only responds if Alpine
		// re-initialised the markup it was handed.
		const israelePalestina = page.getByRole("article").filter({ hasText: "Brevissima storia del conflitto" });
		const giappone = page.getByRole("article").filter({ hasText: "Il Giappone moderno" });

		await expect(israelePalestina).toBeVisible();
		await expect(giappone).toBeVisible();

		await page.getByRole("button", { name: "Colonialismo", exact: true }).click();

		await expect(israelePalestina).toBeVisible();
		await expect(giappone).toBeHidden();
	});
});
