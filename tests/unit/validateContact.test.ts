import { describe, expect, it } from "vitest";
import { contactErrorSummary, validateContactForm } from "../../src/core/helpers/validateContact";

const valid = {
	from_name: "Elia",
	reply_to: "lettore@example.com",
	subject: "Il menu mobile non si vede",
	message: "Succede su iPhone con Safari.",
};

describe("validateContactForm", () => {
	it("accepts a fully filled form", () => {
		expect(validateContactForm(valid)).toEqual([]);
	});

	it("reports every empty required field", () => {
		const errors = validateContactForm({});

		expect(errors.map((error) => error.field)).toEqual(["from_name", "reply_to", "subject", "message"]);
	});

	it("treats whitespace as empty", () => {
		const errors = validateContactForm({ ...valid, from_name: "   " });

		expect(errors).toHaveLength(1);
		expect(errors[0].field).toBe("from_name");
	});

	it("rejects an address without a dotted domain", () => {
		const errors = validateContactForm({ ...valid, reply_to: "lettore@example" });

		expect(errors).toHaveLength(1);
		expect(errors[0].field).toBe("reply_to");
	});

	it("rejects an address with spaces or no @", () => {
		expect(validateContactForm({ ...valid, reply_to: "lettore example.com" })).toHaveLength(1);
		expect(validateContactForm({ ...valid, reply_to: "lettore at example.com" })).toHaveLength(1);
	});

	it("reports an empty address as missing rather than malformed", () => {
		const errors = validateContactForm({ ...valid, reply_to: "" });

		expect(errors[0].message).toBe("Inserisci la tua email.");
	});
});

describe("contactErrorSummary", () => {
	it("is empty when nothing is wrong", () => {
		expect(contactErrorSummary([])).toBe("");
	});

	it("announces a single error on its own", () => {
		expect(contactErrorSummary(validateContactForm({ ...valid, subject: "" }))).toBe(
			"Inserisci l'oggetto del messaggio.",
		);
	});

	it("counts the remaining fields when several are wrong", () => {
		expect(contactErrorSummary(validateContactForm({}))).toBe("Inserisci il tuo nome. Ci sono 4 campi da correggere.");
	});
});
