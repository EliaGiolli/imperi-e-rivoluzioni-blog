/** The four controls of the contact form, named after their EmailJS template fields. */
export type ContactField = "from_name" | "reply_to" | "subject" | "message";

export interface ContactFieldError {
	field: ContactField;
	message: string;
}

export type ContactFormValues = Partial<Record<ContactField, string>>;
