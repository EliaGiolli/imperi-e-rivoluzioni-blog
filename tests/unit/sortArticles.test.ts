import { describe, expect, it } from "vitest";
import { byMostRecent, byReadingOrder } from "../../src/core/helpers";

const article = (order: number, pubDate: string) => ({ data: { order, pubDate: new Date(pubDate) } });

const meiji = article(1, "2026-09-09");
const taisho = article(2, "2026-09-13");
const generali = article(3, "2026-09-13");

describe("byReadingOrder", () => {
	it("follows the cycle order regardless of file discovery order", () => {
		const sorted = [generali, meiji, taisho].sort(byReadingOrder);

		expect(sorted.map((entry) => entry.data.order)).toEqual([1, 2, 3]);
	});

	it("falls back to the oldest publication date when the order ties", () => {
		const older = article(1, "2026-01-01");
		const newer = article(1, "2026-06-01");

		expect([newer, older].sort(byReadingOrder)).toEqual([older, newer]);
	});
});

describe("byMostRecent", () => {
	it("puts the newest article first", () => {
		const sorted = [meiji, taisho, generali].sort(byMostRecent);

		expect(sorted[sorted.length - 1]).toBe(meiji);
	});

	it("breaks a shared publication date with the later cycle order", () => {
		const sorted = [taisho, generali].sort(byMostRecent);

		expect(sorted.map((entry) => entry.data.order)).toEqual([3, 2]);
	});
});
