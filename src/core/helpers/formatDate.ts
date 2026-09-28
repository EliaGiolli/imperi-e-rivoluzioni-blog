export function formatDate(date: Date | string): string {
	const parsedDate = date instanceof Date ? date : new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		throw new RangeError("Invalid date");
	}

	return new Intl.DateTimeFormat("it-IT", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(parsedDate);
}

/** The front page's dateline: weekday first, capitalised, as a newspaper prints it. */
export function formatDateline(date: Date): string {
	const formatted = new Intl.DateTimeFormat("it-IT", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);

	return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
