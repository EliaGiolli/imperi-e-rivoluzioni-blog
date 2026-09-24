import { describe, expect, it } from "vitest";
import { envSchema } from "../../src/core/schemas/envSchema";
import { isCmsEnabled } from "../../src/core/config/envParser";

const github = {
	KEYSTATIC_GITHUB_CLIENT_ID: "Iv1.abc",
	KEYSTATIC_GITHUB_CLIENT_SECRET: "secret",
	KEYSTATIC_SECRET: "another-secret",
	PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: "imperi-cms",
};

describe("envSchema", () => {
	it("accepts an empty environment and defaults to local storage", () => {
		const env = envSchema.parse({});

		expect(env.PUBLIC_KEYSTATIC_STORAGE).toBe("local");
		expect(env.VERCEL).toBe(false);
		expect(env.KEYSTATIC).toBe(false);
	});

	it("reads only \"1\" as an enabled flag", () => {
		expect(envSchema.parse({ KEYSTATIC: "1" }).KEYSTATIC).toBe(true);
		expect(envSchema.parse({ KEYSTATIC: "true" }).KEYSTATIC).toBe(false);
	});

	it("treats blank strings as unset", () => {
		expect(envSchema.parse({ KEYSTATIC_SECRET: "  " }).KEYSTATIC_SECRET).toBeUndefined();
	});

	it("rejects an unknown storage kind", () => {
		expect(envSchema.safeParse({ PUBLIC_KEYSTATIC_STORAGE: "cloud" }).success).toBe(false);
	});

	it("rejects a partial EmailJS configuration", () => {
		const result = envSchema.safeParse({ PUBLIC_EMAILJS_SERVICE_ID: "service" });

		expect(result.success).toBe(false);
		expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
			"PUBLIC_EMAILJS_TEMPLATE_ID",
			"PUBLIC_EMAILJS_PUBLIC_KEY",
		]);
	});

	it("requires the GitHub App credentials for a GitHub-mode deploy on Vercel", () => {
		const missing = envSchema.safeParse({ VERCEL: "1", PUBLIC_KEYSTATIC_STORAGE: "github" });
		const complete = envSchema.safeParse({ VERCEL: "1", PUBLIC_KEYSTATIC_STORAGE: "github", ...github });

		expect(missing.success).toBe(false);
		expect(complete.success).toBe(true);
	});

	it("lets GitHub mode run locally without credentials, for Keystatic's setup flow", () => {
		expect(envSchema.safeParse({ PUBLIC_KEYSTATIC_STORAGE: "github" }).success).toBe(true);
	});
});

describe("isCmsEnabled", () => {
	it("stays off for the plain static build", () => {
		expect(isCmsEnabled(envSchema.parse({}))).toBe(false);
	});

	it("turns on for `npm run dev:cms`", () => {
		expect(isCmsEnabled(envSchema.parse({ KEYSTATIC: "1" }))).toBe(true);
	});

	it("keeps a Vercel deploy static until GitHub mode is configured", () => {
		expect(isCmsEnabled(envSchema.parse({ VERCEL: "1" }))).toBe(false);
		expect(isCmsEnabled(envSchema.parse({ VERCEL: "1", PUBLIC_KEYSTATIC_STORAGE: "github", ...github }))).toBe(true);
	});
});
