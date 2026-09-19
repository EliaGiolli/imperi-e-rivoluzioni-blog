/** Average silent reading speed for Italian prose, in words per minute. */
const DEFAULT_WORDS_PER_MINUTE = 200;

/**
 * Strips the Markdown syntax that should not be read aloud — fenced code, ASCII
 * diagrams, image and link targets, inline marks — so only the prose is counted.
 */
function toPlainText(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/~~~[\s\S]*?~~~/g, " ")
		.replace(/`[^`]*`/g, " ")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/^\s{0,3}>\s?/gm, " ")
		.replace(/^\s{0,3}#{1,6}\s+/gm, " ")
		.replace(/[*_~]+/g, " ");
}

/**
 * Word-count based reading-time estimate, in whole minutes (never below 1).
 * Only tokens containing a letter or a digit count as words, so punctuation and
 * the box-drawing characters used in the articles' diagrams are ignored.
 */
export function readingTime(markdown: string, wordsPerMinute: number = DEFAULT_WORDS_PER_MINUTE): number {
	if (wordsPerMinute <= 0) {
		throw new RangeError("wordsPerMinute must be greater than 0");
	}

	const words = toPlainText(markdown)
		.split(/\s+/)
		.filter((token) => /[\p{L}\p{N}]/u.test(token));

	if (words.length === 0) {
		return 0;
	}

	return Math.max(1, Math.round(words.length / wordsPerMinute));
}
