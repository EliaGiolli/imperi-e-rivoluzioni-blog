import type { Edition, Series, SeriesArticle, SeriesPart, SortableArticle } from "../../shared/types";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";
import { toRoman } from "./roman";
import { byReadingOrder } from "./sortArticles";

/**
 * The cycle an article belongs to: every article with the same topic and category, in the
 * order the author meant them to be read. The article itself must be part of `all`.
 */
export function seriesOf<T extends SeriesArticle>(article: T, all: readonly T[]): Series<T> {
	const members = all
		.filter((entry) => entry.data.topic === article.data.topic && entry.data.category === article.data.category)
		.sort(byReadingOrder);

	const parts: SeriesPart<T>[] = members.map((entry, index) => ({
		article: entry,
		position: index + 1,
		roman: toRoman(index + 1),
		current: entry.data.slug === article.data.slug,
	}));

	const index = parts.findIndex((part) => part.current);

	if (index === -1) {
		throw new Error(`"${article.data.slug}" is not in the collection it was looked up in`);
	}

	return {
		name: capitalizeFirstLetter(article.data.category),
		topic: article.data.topic,
		parts,
		part: parts[index],
		total: parts.length,
		previous: parts[index - 1],
		next: parts[index + 1],
	};
}

/** Oldest first, so issue numbers only ever grow as articles are published. */
function byPublication(first: SortableArticle, second: SortableArticle): number {
	const difference = first.data.pubDate.getTime() - second.data.pubDate.getTime();

	return difference !== 0 ? difference : first.data.order - second.data.order;
}

/** Completed months between two dates: a month only counts once its day has come round. */
function monthsBetween(from: Date, to: Date): number {
	const months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());

	return to.getUTCDate() < from.getUTCDate() ? months - 1 : months;
}

/**
 * The newspaper numbering: one issue per article in publication order, and a new year every
 * twelve months from the first article. `article` must be part of `all`.
 */
export function editionOf<T extends SortableArticle>(article: T, all: readonly T[]): Edition {
	const sorted = [...all].sort(byPublication);
	const index = sorted.indexOf(article);

	if (index === -1) {
		throw new Error("The article is not in the collection it was numbered against");
	}

	const year = Math.floor(monthsBetween(sorted[0].data.pubDate, article.data.pubDate) / 12) + 1;

	return { year, yearRoman: toRoman(year), number: index + 1 };
}
