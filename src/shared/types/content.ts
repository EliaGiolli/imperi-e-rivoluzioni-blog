/**
 * The shapes the content collections are read through.
 *
 * They are written structurally rather than as `CollectionEntry<"articles">` on purpose:
 * the helpers that consume them only need a few fields, and stating those fields keeps the
 * helpers unit-testable from plain objects instead of from a built content store.
 */

export interface ThemeIndexArticle {
	data: {
		title: string;
		description: string;
		tags: string[];
		topic: string;
		category: string;
		slug: string;
	};
}

export interface ThemeIndexReading {
	id: string;
	data: {
		name: string;
		author: string;
		description: string;
		tags: string[];
		topic: string;
	};
}

export interface ThemeEntry {
	kind: "article" | "reading";
	title: string;
	subtitle: string;
	description: string;
	href: string;
	tags: string[];
	topic: string;
}

export interface ThemeGroup {
	name: string;
	slug: string;
	entries: ThemeEntry[];
	tags: string[];
	articleCount: number;
	readingCount: number;
}

export interface ThemeIndex {
	topics: ThemeGroup[];
	tags: ThemeGroup[];
}

/** The two frontmatter fields the article comparators order on. */
export interface SortableArticle {
	data: {
		order: number;
		pubDate: Date;
	};
}

/** The frontmatter fields the reading comparator orders on. */
export interface SortableReading {
	data: {
		name: string;
		addedDate: Date;
	};
}

/** Everything the JSON-LD `BlogPosting` payload is built from. */
export interface ArticleSchemaInput {
	title: string;
	description: string;
	author: string;
	pubDate: Date;
	updatedDate?: Date;
	tags: string[];
	/** Absolute URL of the article itself. */
	url: string;
	/** Absolute URL of the social preview image. */
	imageUrl: string;
	blogName: string;
	siteUrl: string;
}

/** The slice of an article a series box needs: identity, place in the cycle, and date. */
export interface SeriesArticle {
	data: {
		title: string;
		slug: string;
		topic: string;
		category: string;
		order: number;
		pubDate: Date;
	};
}

/** One instalment of a series, as the series box and the "Parte X di N" kicker show it. */
export interface SeriesPart<T extends SeriesArticle = SeriesArticle> {
	article: T;
	/** 1-based position in the reading order. */
	position: number;
	roman: string;
	current: boolean;
}

/** A multi-part cycle: every article sharing a topic and a category, in reading order. */
export interface Series<T extends SeriesArticle = SeriesArticle> {
	name: string;
	topic: string;
	parts: SeriesPart<T>[];
	/** The current article's part. */
	part: SeriesPart<T>;
	total: number;
	previous?: SeriesPart<T>;
	next?: SeriesPart<T>;
}

/** The newspaper numbering of an article: "Anno I · N. 3". */
export interface Edition {
	/** 1-based year of publication, counted in 12-month steps from the first article. */
	year: number;
	yearRoman: string;
	/** 1-based issue number: one issue per article, in publication order. */
	number: number;
}

/** One series in the archive: its name and its parts in reading order. */
export interface ArchiveSeries<T extends SeriesArticle = SeriesArticle> {
	name: string;
	parts: SeriesPart<T>[];
}

/** One topic in the archive, with its series. */
export interface ArchiveTopic<T extends SeriesArticle = SeriesArticle> {
	topic: string;
	series: ArchiveSeries<T>[];
}
