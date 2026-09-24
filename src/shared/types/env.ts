import type { z } from "astro/zod";
import type { envSchema } from "../../core/schemas/envSchema";

/** The validated, typed environment produced by `parseEnv`. */
export type Env = z.output<typeof envSchema>;
