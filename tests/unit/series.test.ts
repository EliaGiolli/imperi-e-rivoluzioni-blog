import { describe, expect, it } from "vitest";
import { editionOf, seriesOf, toRoman } from "../../src/core/helpers";

const article = (slug: string, order: number, pubDate: string, category = "militarismo giapponese", topic = "Giappone") => ({
	data: { title: slug, slug, topic, category, order, pubDate: new Date(pubDate) },
});

const meiji = article("meiji", 1, "2026-09-09");
const taisho = article("taisho", 2, "2026-09-13");
const generali = article("generali", 3, "2026-09-13");
const elsewhere = article("stalin", 1, "2026-09-20", "guerra fredda", "URSS");
const all = [generali, elsewhere, meiji, taisho];

describe("toRoman", () => {
	it("writes the numerals series and editions use", () => {
		expect([1, 3, 4, 9, 14, 40].map(toRoman)).toEqual(["I", "III", "IV", "IX", "XIV", "XL"]);
	});

	it("rejects values Roman numerals cannot express", () => {
		expect(() => toRoman(0)).toThrow(RangeError);
		expect(() => toRoman(1.5)).toThrow(RangeError);
	});
});

describe("seriesOf", () => {
	it("gathers the articles sharing topic and category, in reading order", () => {
		const series = seriesOf(taisho, all);

		expect(series.parts.map((part) => part.article)).toEqual([meiji, taisho, generali]);
		expect(series.parts.map((part) => part.roman)).toEqual(["I", "II", "III"]);
		expect(series.name).toBe("Militarismo giapponese");
		expect(series.topic).toBe("Giappone");
	});

	it("places the current article and its neighbours", () => {
		const series = seriesOf(taisho, all);

		expect(series.part.position).toBe(2);
		expect(series.total).toBe(3);
		expect(series.previous?.article).toBe(meiji);
		expect(series.next?.article).toBe(generali);
		expect(series.parts.filter((part) => part.current)).toHaveLength(1);
	});

	it("leaves the ends of the series open", () => {
		expect(seriesOf(meiji, all).previous).toBeUndefined();
		expect(seriesOf(generali, all).next).toBeUndefined();
	});

	it("treats a standalone article as a series of one", () => {
		const series = seriesOf(elsewhere, all);

		expect(series.total).toBe(1);
		expect(series.part.position).toBe(1);
	});

	it("refuses an article missing from the collection", () => {
		expect(() => seriesOf(article("ghost", 9, "2026-01-01"), all)).toThrow();
	});
});

describe("editionOf", () => {
	it("numbers issues by publication date, breaking ties with the reading order", () => {
		expect(all.map((entry) => editionOf(entry, all).number)).toEqual([3, 4, 1, 2]);
	});

	it("starts the numbering in Anno I", () => {
		expect(editionOf(generali, all)).toEqual({ year: 1, yearRoman: "I", number: 3 });
	});

	it("opens a new year twelve months after the first article", () => {
		const later = article("later", 1, "2027-09-01", "altro");
		const muchLater = article("much-later", 1, "2027-10-01", "altro");
		const collection = [...all, later, muchLater];

		expect(editionOf(later, collection).year).toBe(1);
		expect(editionOf(muchLater, collection)).toMatchObject({ year: 2, yearRoman: "II", number: 6 });
	});
});
