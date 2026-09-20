import { describe, expect, it } from "vitest";
import { navLinkCurrent } from "../../src/core/helpers/navigation";

describe("navLinkCurrent", () => {
	it("marks the exact destination as the current page", () => {
		expect(navLinkCurrent("/articles", "/articles")).toBe("page");
	});

	it("ignores trailing slashes on either side", () => {
		expect(navLinkCurrent("/articles/", "/articles")).toBe("page");
		expect(navLinkCurrent("/articles", "/articles/")).toBe("page");
	});

	it("ignores query strings and fragments", () => {
		expect(navLinkCurrent("/topics?tag=URSS", "/topics")).toBe("page");
		expect(navLinkCurrent("/topics#giappone", "/topics")).toBe("page");
	});

	it("marks a section link while a child page is open", () => {
		expect(navLinkCurrent("/articles/i-semi-del-militarismo-giapponese", "/articles")).toBe("true");
		expect(navLinkCurrent("/readings/il-giappone-moderno", "/readings")).toBe("true");
	});

	it("matches the homepage only exactly, since / prefixes every route", () => {
		expect(navLinkCurrent("/", "/")).toBe("page");
		expect(navLinkCurrent("/articles", "/")).toBeUndefined();
	});

	it("leaves unrelated links alone", () => {
		expect(navLinkCurrent("/articles", "/readings")).toBeUndefined();
	});

	it("does not treat a shared prefix as a section match", () => {
		expect(navLinkCurrent("/articles-archive", "/articles")).toBeUndefined();
	});
});
