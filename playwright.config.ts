import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	// Every worker launches its own headless Chromium. Playwright's default (a quarter of
	// the cores) starves them on a dev machine that already has a browser open: the workers
	// die with an out-of-memory crash rather than a test failure. Two is stable, and it
	// still finishes the suite faster than running serially.
	workers: 2,
	reporter: "list",
	use: {
		baseURL: "http://127.0.0.1:4321",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
