import { z } from "astro/zod";

/** Vercel and our npm scripts spell a boolean flag as "1"; anything else, or unset, is off. */
const flag = z
	.string()
	.optional()
	.transform((value) => value === "1");

/** Hosting dashboards happily store empty strings, which should count as "not set". */
const optionalSecret = z.preprocess(
	(value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
	z.string().trim().optional(),
);

const EMAILJS_KEYS = [
	"PUBLIC_EMAILJS_SERVICE_ID",
	"PUBLIC_EMAILJS_TEMPLATE_ID",
	"PUBLIC_EMAILJS_PUBLIC_KEY",
] as const;

const KEYSTATIC_GITHUB_KEYS = [
	"KEYSTATIC_GITHUB_CLIENT_ID",
	"KEYSTATIC_GITHUB_CLIENT_SECRET",
	"KEYSTATIC_SECRET",
	"PUBLIC_KEYSTATIC_GITHUB_APP_SLUG",
] as const;

/**
 * Every environment variable the build reads. Unknown keys (PATH, HOME, …) are stripped.
 */
export const envSchema = z
	.object({
		VERCEL: flag,
		KEYSTATIC: flag,

		// "local" writes straight to src/content; "github" commits through the GitHub App.
		PUBLIC_KEYSTATIC_STORAGE: z.enum(["local", "github"]).default("local"),
		KEYSTATIC_GITHUB_CLIENT_ID: optionalSecret,
		KEYSTATIC_GITHUB_CLIENT_SECRET: optionalSecret,
		KEYSTATIC_SECRET: optionalSecret,
		PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: optionalSecret,

		PUBLIC_EMAILJS_SERVICE_ID: optionalSecret,
		PUBLIC_EMAILJS_TEMPLATE_ID: optionalSecret,
		PUBLIC_EMAILJS_PUBLIC_KEY: optionalSecret,
	})
	.superRefine((env, ctx) => {
		// The contact form falls back to mailto: when EmailJS is unset, but a partial set
		// would make it try to send and fail at runtime.
		const emailJsSet = EMAILJS_KEYS.filter((key) => env[key] !== undefined);
		if (emailJsSet.length > 0 && emailJsSet.length < EMAILJS_KEYS.length) {
			for (const key of EMAILJS_KEYS.filter((key) => env[key] === undefined)) {
				ctx.addIssue({ code: "custom", path: [key], message: "EmailJS needs all three variables, or none" });
			}
		}

		// A deployed GitHub-mode CMS without its App credentials serves a broken /keystatic.
		// Locally they may still be missing: Keystatic's own setup flow is what creates them.
		if (env.VERCEL && env.PUBLIC_KEYSTATIC_STORAGE === "github") {
			for (const key of KEYSTATIC_GITHUB_KEYS.filter((key) => env[key] === undefined)) {
				ctx.addIssue({ code: "custom", path: [key], message: "required when the CMS is deployed in GitHub mode" });
			}
		}
	});
