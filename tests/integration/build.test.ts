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

describe("front page", () => {
	const document = new JSDOM(readFileSync(homepagePath, "utf8")).window.document;
	const hrefs = () => [...document.querySelectorAll("a")].map((link) => link.getAttribute("href"));

	it("has a single h1: the masthead", () => {
		const headings = document.querySelectorAll("h1");

		expect(headings).toHaveLength(1);
		expect(headings[0].textContent?.replace(/\s+/g, " ").trim()).toBe("Imperi e Rivoluzioni");
	});

	it("leads with the latest article and links through to it", () => {
		const lead = document.querySelector('article[aria-labelledby="lead-title"]');
		const leadPath = "/articles/il-governo-dei-generali-ascesa-hideki-tojo";

		expect(lead?.querySelector("#lead-title a")?.getAttribute("href")).toBe(leadPath);
		expect([...(lead?.querySelectorAll("a") ?? [])].some((link) => link.textContent?.includes("Continua a leggere") && link.getAttribute("href") === leadPath)).toBe(true);
		expect(lead?.querySelectorAll(".drop-cap p").length).toBe(2);
	});

	it("lists the lead article's whole series", () => {
		const parts = document.querySelectorAll('section[aria-labelledby="serie-title"] li');

		expect(parts).toHaveLength(3);
		expect(parts[2].textContent).toContain("in primo piano");
	});

	it("shows the HOME_PREVIEW_COUNT most recently added readings, with the archive link", () => {
		const readings = document.querySelectorAll('section[aria-labelledby="letture-title"] article');

		expect(readings).toHaveLength(HOME_PREVIEW_COUNT);
		expect(readings[0].textContent).toContain("Perché Stalin creò Israele");
		expect(hrefs()).toContain("/readings");
	});

	it("sends the subscription form to Substack with the email field", () => {
		const form = document.querySelector("#abbonamenti form");

		expect(form?.getAttribute("action")).toMatch(/^https:\/\/imperierivoluzioni\.substack\.com\/subscribe$/);
		expect(form?.getAttribute("method")).toBe("get");
		expect(form?.querySelector('input[type="email"][name="email"][required]')).not.toBeNull();
	});
});
