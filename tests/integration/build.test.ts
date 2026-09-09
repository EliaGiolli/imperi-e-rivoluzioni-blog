import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "../..");
const astroCli = resolve(projectRoot, "node_modules/astro/bin/astro.mjs");
const articlePath = resolve(projectRoot, "dist/articles/i-semi-del-militarismo-giapponese/index.html");
const readingsIndexPath = resolve(projectRoot, "dist/readings/index.html");

let buildOutput = "";

try {
	buildOutput = execFileSync(process.execPath, [astroCli, "build"], {
		cwd: projectRoot,
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
});
