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
