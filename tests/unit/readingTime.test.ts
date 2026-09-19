import { describe, expect, it } from "vitest";
import { readingTime } from "../../src/core/helpers";

const words = (count: number): string => Array.from({ length: count }, (_, index) => `parola${index}`).join(" ");

describe("readingTime", () => {
	it("estimates whole minutes at 200 words per minute", () => {
		expect(readingTime(words(400))).toBe(2);
		expect(readingTime(words(500))).toBe(3);
	});

	it("never returns less than one minute for a non-empty text", () => {
		expect(readingTime("Una frase molto breve.")).toBe(1);
	});

	it("returns zero for an empty or punctuation-only text", () => {
		expect(readingTime("")).toBe(0);
		expect(readingTime("--- ### > *** ")).toBe(0);
	});

	it("ignores fenced code blocks and ASCII diagrams", () => {
		const markdown = `${words(400)}\n\n\`\`\`\n${words(4000)}\n\`\`\`\n`;

		expect(readingTime(markdown)).toBe(2);
	});

	it("counts the link text but not the URL", () => {
		expect(readingTime("[Costituzione Meiji](https://example.com/una/url/molto/lunga)", 2)).toBe(1);
	});

	it("does not count Markdown syntax as words", () => {
		const markdown = `## Un titolo\n\n> **${words(200)}**\n`;

		expect(readingTime(markdown)).toBe(1);
	});

	it("accepts a custom reading speed", () => {
		expect(readingTime(words(400), 100)).toBe(4);
	});

	it("rejects a non-positive reading speed", () => {
		expect(() => readingTime(words(10), 0)).toThrowError(RangeError);
	});
});
