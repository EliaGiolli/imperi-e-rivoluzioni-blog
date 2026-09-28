const NUMERALS: [number, string][] = [
	[1000, "M"],
	[900, "CM"],
	[500, "D"],
	[400, "CD"],
	[100, "C"],
	[90, "XC"],
	[50, "L"],
	[40, "XL"],
	[10, "X"],
	[9, "IX"],
	[5, "V"],
	[4, "IV"],
	[1, "I"],
];

/** Roman numerals for series parts and edition years ("Parte III", "Anno I"). */
export function toRoman(value: number): string {
	if (!Number.isInteger(value) || value < 1 || value > 3999) {
		throw new RangeError("Roman numerals cover the integers 1–3999");
	}

	let remainder = value;
	let result = "";

	for (const [amount, numeral] of NUMERALS) {
		while (remainder >= amount) {
			result += numeral;
			remainder -= amount;
		}
	}

	return result;
}
