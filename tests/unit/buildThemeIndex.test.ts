import { describe, expect, it } from "vitest";
import { buildThemeIndex, slugifyTheme } from "../../src/core/helpers";

const articles = [
	{
		id: "Giappone/l-illusione-democratica.md",
		data: {
			title: "L'illusione democratica",
			description: "La crisi Taishō e il crollo delle istituzioni.",
			tags: ["Giappone", "Democrazia"],
			topic: "Giappone",
			category: "militarismo giapponese",
			slug: "l-illusione-democratica-crisi-taisho",
		},
	},
	{
		id: "Giappone/i-semi-del-militarismo.md",
		data: {
			title: "I semi del militarismo giapponese",
			description: "Come l'Epoca Meiji ha preparato la guerra.",
			tags: ["Giappone", "Colonialismo"],
			topic: "Giappone",
			category: "militarismo giapponese",
			slug: "i-semi-del-militarismo-giapponese",
		},
	},
];

const readings = [
	{
		id: "il-giappone-moderno",
		data: {
			name: "Il Giappone moderno",
			author: "Andrea Revelant",
			description: "Il Giappone imperiale dall'Ottocento al 1945.",
			tags: ["Giappone", "Impero"],
			topic: "Asia orientale e imperialismo",
		},
	},
	{
		id: "perche-stalin-creo-israele",
		data: {
			name: "Perché Stalin creò Israele",
			author: "Leonid Mlecin",
			description: "Il ruolo dell'URSS nella nascita dello Stato d'Israele.",
			tags: ["URSS", "Israele"],
			topic: "URSS e nascita di Israele",
		},
	},
];

describe("slugifyTheme", () => {
	it("builds an anchor-safe slug from an Italian topic name", () => {
		expect(slugifyTheme("Medio Oriente e questione israelo-palestinese")).toBe("medio-oriente-e-questione-israelo-palestinese");
	});

	it("strips accents and punctuation", () => {
		expect(slugifyTheme("Periodo Taishō (1912-1926)")).toBe("periodo-taisho-1912-1926");
	});
});

describe("buildThemeIndex", () => {
	it("groups articles and readings under the same topic when a tag names it", () => {
		const { topics } = buildThemeIndex(articles, readings);
		const giappone = topics.find((topic) => topic.name === "Giappone");

		expect(giappone).toBeDefined();
		expect(giappone?.articleCount).toBe(2);
		expect(giappone?.readingCount).toBe(1);
		expect(giappone?.entries.map((entry) => entry.title)).toEqual([
			"I semi del militarismo giapponese",
			"L'illusione democratica",
			"Il Giappone moderno",
		]);
	});

	it("keeps every topic of both collections and sorts them alphabetically", () => {
		const { topics } = buildThemeIndex(articles, readings);

		expect(topics.map((topic) => topic.name)).toEqual([
			"Asia orientale e imperialismo",
			"Giappone",
			"URSS e nascita di Israele",
		]);
	});

	it("links each entry to its own route", () => {
		const { topics } = buildThemeIndex(articles, readings);
		const hrefs = topics.flatMap((topic) => topic.entries.map((entry) => entry.href));

		expect(hrefs).toContain("/articles/i-semi-del-militarismo-giapponese");
		expect(hrefs).toContain("/readings/il-giappone-moderno");
	});

	it("indexes tags across both collections", () => {
		const { tags } = buildThemeIndex(articles, readings);
		const giappone = tags.find((tag) => tag.name === "Giappone");

		expect(giappone?.entries).toHaveLength(3);
		expect(giappone?.articleCount).toBe(2);
		expect(giappone?.readingCount).toBe(1);
		expect(tags.map((tag) => tag.name)).toEqual(["Colonialismo", "Democrazia", "Giappone", "Impero", "Israele", "URSS"]);
	});

	it("returns empty groups for empty collections", () => {
		expect(buildThemeIndex([], [])).toEqual({ topics: [], tags: [] });
	});
});
