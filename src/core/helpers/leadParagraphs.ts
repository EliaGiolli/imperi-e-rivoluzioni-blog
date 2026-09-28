/** Blocks that are not running prose: headings, lists, quotes, tables, rules and code. */
const NON_PROSE = /^(#|>|\||[-*+] |\d+[.)] |```|~~~|---|\*\*\*|    |\t)/;

/** Markdown inline syntax reduced to the words a reader would see. */
function toPlainText(markdown: string): string {
	return markdown
		.replace(/\s*\[[^\]]*\]\(#fonte-[^)]*\)/g, "") // source markers carry no prose
		.replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links keep their text
		.replace(/(\*\*|__)(.+?)\1/g, "$2")
		.replace(/(\*|_)(.+?)\1/g, "$2")
		.replace(/`([^`]*)`/g, "$1")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * The opening paragraphs of an article, as plain text, for the front page's lead story.
 * Headings, lists, tables and code are skipped, so it starts where the prose starts.
 */
export function leadParagraphs(body: string, count: number): string[] {
	const paragraphs: string[] = [];

	for (const block of body.replace(/\r\n/g, "\n").split(/\n{2,}/)) {
		if (paragraphs.length >= count) {
			break;
		}

		if (block.trim() === "" || NON_PROSE.test(block)) {
			continue;
		}

		const text = toPlainText(block);

		if (text !== "") {
			paragraphs.push(text);
		}
	}

	return paragraphs;
}
