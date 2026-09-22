import { describe, expect, it } from "vitest";
import { byMostRecentlyAdded } from "../../src/core/helpers";

const reading = (name: string, addedDate: string) => ({ data: { name, addedDate: new Date(addedDate) } });

const stalin = reading("Perché Stalin creò Israele", "2026-09-22");
const brevissima = reading("Brevissima storia del conflitto tra Israele e Palestina", "2026-09-15");
const giappone = reading("Il Giappone moderno", "2026-09-08");

describe("byMostRecentlyAdded", () => {
	it("puts the most recently added reading first", () => {
		const sorted = [giappone, stalin, brevissima].sort(byMostRecentlyAdded);

		expect(sorted).toEqual([stalin, brevissima, giappone]);
	});

	it("breaks a shared addedDate with the Italian-collated title", () => {
		const zebra = reading("Zebra", "2026-09-22");
		const alfa = reading("Alfa", "2026-09-22");

		expect([zebra, alfa].sort(byMostRecentlyAdded)).toEqual([alfa, zebra]);
	});
});
