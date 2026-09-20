import { describe, expect, it } from "vitest";
import { buildArticleSchema } from "../../src/core/helpers/structuredData";

const base = {
	title: "I semi del militarismo giapponese",
	description: "Come l'Epoca Meiji ha preparato la guerra.",
	author: "Elia Giolli",
	pubDate: new Date("2026-09-09T00:00:00.000Z"),
	tags: ["Giappone", "militarismo"],
	url: "https://example.test/articles/i-semi-del-militarismo-giapponese",
	imageUrl: "https://example.test/og-image.png",
	blogName: "Imperi e Rivoluzioni",
	siteUrl: "https://example.test/",
};

describe("buildArticleSchema", () => {
	it("describes a BlogPosting in Italian", () => {
		const schema = buildArticleSchema(base);

		expect(schema["@context"]).toBe("https://schema.org");
		expect(schema["@type"]).toBe("BlogPosting");
		expect(schema.inLanguage).toBe("it-IT");
		expect(schema.headline).toBe(base.title);
	});

	it("falls back to the publication date when the article was never updated", () => {
		const schema = buildArticleSchema(base);

		expect(schema.datePublished).toBe("2026-09-09T00:00:00.000Z");
		expect(schema.dateModified).toBe("2026-09-09T00:00:00.000Z");
	});

	it("prefers the update date when there is one", () => {
		const schema = buildArticleSchema({ ...base, updatedDate: new Date("2026-09-15T00:00:00.000Z") });

		expect(schema.datePublished).toBe("2026-09-09T00:00:00.000Z");
		expect(schema.dateModified).toBe("2026-09-15T00:00:00.000Z");
	});

	it("credits the author and the publisher separately", () => {
		const schema = buildArticleSchema(base);

		expect(schema.author).toEqual({ "@type": "Person", name: "Elia Giolli" });
		expect(schema.publisher).toEqual({
			"@type": "Organization",
			name: "Imperi e Rivoluzioni",
			url: "https://example.test/",
		});
	});

	it("points mainEntityOfPage at the article's own absolute URL", () => {
		const schema = buildArticleSchema(base);

		expect(schema.mainEntityOfPage).toEqual({ "@type": "WebPage", "@id": base.url });
		expect(schema.url).toBe(base.url);
	});

	it("flattens the tags into keywords", () => {
		expect(buildArticleSchema(base).keywords).toBe("Giappone, militarismo");
	});

	it("serialises to valid JSON for the ld+json script", () => {
		expect(() => JSON.parse(JSON.stringify(buildArticleSchema(base)))).not.toThrow();
	});
});
