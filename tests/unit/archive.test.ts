import { describe, expect, it } from "vitest";
import { archiveOf } from "../../src/core/helpers";

const article = (slug: string, topic: string, category: string, order: number) => ({
	data: { title: slug, slug, topic, category, order, pubDate: new Date("2026-09-01") },
});

const all = [
	article("taisho", "Giappone", "militarismo giapponese", 2),
	article("stalin", "URSS", "guerra fredda", 1),
	article("meiji", "Giappone", "militarismo giapponese", 1),
	article("kokutai", "Giappone", "ideologia imperiale", 1),
];

describe("archiveOf", () => {
	it("orders topics and their series alphabetically, in Italian", () => {
		const archive = archiveOf(all);

		expect(archive.map((entry) => entry.topic)).toEqual(["Giappone", "URSS"]);
		expect(archive[0].series.map((series) => series.name)).toEqual(["Ideologia imperiale", "Militarismo giapponese"]);
	});

	it("lists each series in reading order, with no part marked current", () => {
		const militarismo = archiveOf(all)[0].series[1];

		expect(militarismo.parts.map((part) => part.article.data.slug)).toEqual(["meiji", "taisho"]);
		expect(militarismo.parts.map((part) => part.roman)).toEqual(["I", "II"]);
		expect(militarismo.parts.some((part) => part.current)).toBe(false);
	});

	it("returns an empty index for an empty collection", () => {
		expect(archiveOf([])).toEqual([]);
	});
});
