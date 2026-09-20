/**
 * Validation for the contact form. It lives here rather than in the component so the
 * rules can be unit-tested, and so the browser script only has to render the result.
 *
 * The form is submitted through EmailJS, which bypasses the native form validation,
 * so these checks are what stands between an empty field and a useless email.
 */

import type { ContactField, ContactFieldError, ContactFormValues } from "../../shared/types";

/** Deliberately permissive: one @, no spaces, and a dotted domain with a real TLD. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const REQUIRED_MESSAGES: Record<ContactField, string> = {
	from_name: "Inserisci il tuo nome.",
	reply_to: "Inserisci la tua email.",
	subject: "Inserisci l'oggetto del messaggio.",
	message: "Scrivi il tuo messaggio.",
};

const REQUIRED_FIELDS: ContactField[] = ["from_name", "reply_to", "subject", "message"];

export function validateContactForm(values: ContactFormValues): ContactFieldError[] {
	const errors: ContactFieldError[] = [];

	for (const field of REQUIRED_FIELDS) {
		const value = (values[field] ?? "").trim();

		if (value === "") {
			errors.push({ field, message: REQUIRED_MESSAGES[field] });
			continue;
		}

		if (field === "reply_to" && !EMAIL_PATTERN.test(value)) {
			errors.push({ field, message: "Controlla l'indirizzo email: manca una parte." });
		}
	}

	return errors;
}

/** The single line announced in the form's `role="status"` region. */
export function contactErrorSummary(errors: ContactFieldError[]): string {
	if (errors.length === 0) {
		return "";
	}

	if (errors.length === 1) {
		return errors[0].message;
	}

	return `${errors[0].message} Ci sono ${errors.length} campi da correggere.`;
}
