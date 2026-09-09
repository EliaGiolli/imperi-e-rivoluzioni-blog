import { describe, expect, it } from "vitest";
import { capitalizeFirstLetter, formatDate } from "../../src/core/helpers";

describe("capitalizeFirstLetter", () => {
	it("capitalizes the first character", () => {
		expect(capitalizeFirstLetter("storia contemporanea")).toBe("Storia contemporanea");
	});

	it("keeps an empty string unchanged", () => {
		expect(capitalizeFirstLetter("")).toBe("");
	});
});

describe("formatDate", () => {
	it("formats a Date using the Italian locale", () => {
		expect(formatDate(new Date(2024, 0, 15))).toBe("15 gennaio 2024");
	});

	it("accepts an ISO date string", () => {
		expect(formatDate("2024-06-02T12:00:00Z")).toBe("2 giugno 2024");
	});

	it("throws for an invalid date", () => {
		expect(() => formatDate("not-a-date")).toThrowError(RangeError);
	});
});
