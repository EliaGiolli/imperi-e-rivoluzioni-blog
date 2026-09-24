import { loadEnv } from "vite";
import { z } from "astro/zod";
import { envSchema } from "../schemas/envSchema";
import type { Env } from "../../shared/types";

/**
 * Validates the environment at config time.
 *
 * `astro.config.mjs` runs before Vite loads `.env`, so the files are read here explicitly;
 * real process variables (Vercel's dashboard, `cross-env` in npm scripts) take precedence.
 */
export function parseEnv(mode: string = process.env.NODE_ENV ?? "development"): Env {
	const raw = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
	const result = envSchema.safeParse(raw);

	if (!result.success) {
		throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
	}

	return result.data;
}

/**
 * Whether to build with the Vercel adapter and the Keystatic admin.
 *
 * On: `npm run dev:cms` locally, or a Vercel deploy configured for GitHub mode.
 * Off: everything else — the plain static build that `astro preview` and the tests rely on.
 * A Vercel deploy without `PUBLIC_KEYSTATIC_STORAGE=github` also stays static, so the site
 * keeps deploying before the GitHub App exists.
 */
export function isCmsEnabled(env: Env): boolean {
	return env.KEYSTATIC || (env.VERCEL && env.PUBLIC_KEYSTATIC_STORAGE === "github");
}
