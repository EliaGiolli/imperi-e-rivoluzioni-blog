import { describe, expect, it } from "vitest";
import { cn } from "../../src/shared/lib/cn";

describe("cn", () => {
	it("combines class names", () => {
		expect(cn("text-stone-700", "font-bold")).toBe("text-stone-700 font-bold");
	});

	it("merges conflicting Tailwind utilities", () => {
		expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
	});

	it("ignores falsey class values", () => {
		expect(cn("button", false, undefined, null, { active: true, disabled: false })).toBe("button active");
	});
});
