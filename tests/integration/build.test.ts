import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { HOME_PREVIEW_COUNT } from "../../src/shared/utils/constants";

const projectRoot = resolve(import.meta.dirname, "../..");
const astroCli = resolve(projectRoot, "node_modules/astro/bin/astro.mjs");
const articlePath = resolve(projectRoot, "dist/articles/i-semi-del-militarismo-giapponese/index.html");
const readingsIndexPath = resolve(projectRoot, "dist/readings/index.html");
const homepagePath = resolve(projectRoot, "dist/index.html");
// Google Search Console ownership proof: it only verifies if public/ copies it to the site root.
const searchConsolePath = resolve(projectRoot, "dist/googleebfa12ca84c3f0f0.html");

let buildOutput = "";

try {
	buildOutput = execFileSync(process.execPath, [astroCli, "build"], {
		cwd: projectRoot,
		// Vitest sets NODE_ENV=test and the child would inherit it. Libraries that branch on it
		// at build time then ship their dev path: Vercel Analytics, for one, compiles to its
		// external debug script, which stalls page loads for the e2e suite that serves this dist/.
		env: { ...process.env, NODE_ENV: "production" },
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
	});
} catch (error) {
	const output =
		error && typeof error === "object"
			? `${error instanceof Error ? error.message : ""}\n${"stdout" in error ? String(error.stdout) : ""}\n${"stderr" in error ? String(error.stderr) : ""}`
		: "";
	throw new Error(`Astro build failed during integration tests.\n${output}`);
}

describe("Astro production build", () => {
	it("builds the article and readings routes", () => {
		expect(buildOutput).toContain("/articles/i-semi-del-militarismo-giapponese/index.html");
		expect(existsSync(articlePath)).toBe(true);
		expect(existsSync(readingsIndexPath)).toBe(true);
	});

	it("renders article frontmatter and Markdown content", () => {
		const articleHtml = readFileSync(articlePath, "utf8");

		expect(articleHtml).toContain("I semi del militarismo giapponese");
		expect(articleHtml).toContain("Il motto Fukoku Kyōhei");
		expect(articleHtml).toContain("STATO MAGGIORE MILITARE");
	});

	it("copies the Search Console verification file to the site root", () => {
		expect(existsSync(searchConsolePath)).toBe(true);
	});
});

describe("homepage tab carousels", () => {
	const document = new JSDOM(readFileSync(homepagePath, "utf8")).window.document;
	const tablists = [...document.querySelectorAll('[role="tablist"]')];

	it("renders one tablist per section, each capped at HOME_PREVIEW_COUNT", () => {
		expect(tablists.map((tablist) => tablist.getAttribute("aria-label")).sort()).toEqual([
			"Seleziona un articolo",
			"Seleziona una lettura",
		]);
		for (const tablist of tablists) {
			expect(tablist.querySelectorAll('[role="tab"]')).toHaveLength(HOME_PREVIEW_COUNT);
		}
		expect(document.querySelectorAll('[role="tabpanel"]')).toHaveLength(HOME_PREVIEW_COUNT * 2);
	});

	it("server-renders a roving tabindex with the first tab active", () => {
		// Panels carry tabindex="0" as well, so only role="tab" elements count here.
		const focusableTabs = document.querySelectorAll('[role="tab"][tabindex="0"]');

		expect(focusableTabs).toHaveLength(2);
		for (const tablist of tablists) {
			const firstTab = tablist.querySelector('[role="tab"]');

			expect(firstTab?.getAttribute("tabindex")).toBe("0");
			expect(firstTab?.getAttribute("aria-selected")).toBe("true");
		}
	});

	it("leaves only the first panel of each group visible before Alpine loads", () => {
		const visiblePanels = [...document.querySelectorAll('[role="tabpanel"]')]
			.filter((panel) => !panel.hasAttribute("x-cloak"))
			.map((panel) => panel.id);
		const firstPanels = tablists.map((tablist) => tablist.querySelector('[role="tab"]')?.getAttribute("aria-controls"));

		expect(visiblePanels.sort()).toEqual(firstPanels.sort());
	});

	it("links each section to its full archive", () => {
		const ctas = [...document.querySelectorAll("a")].map((link) => [link.textContent?.trim(), link.getAttribute("href")]);

		expect(ctas).toContainEqual(["Tutti gli articoli", "/articles"]);
		expect(ctas).toContainEqual(["Tutte le letture", "/readings"]);
	});
});
