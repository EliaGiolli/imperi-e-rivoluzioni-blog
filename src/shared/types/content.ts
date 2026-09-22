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

/** The slice of an article entry an ArticleCard renders. */
export interface ArticleCardArticle {
	id: string;
	data: {
		title: string;
		description: string;
		tags: string[];
		slug: string;
	};
}

/** The slice of a reading entry a ReadingCard renders. */
export interface ReadingCardReading {
	id: string;
	data: {
		name: string;
		author: string;
		description: string;
		tags: string[];
		topic: string;
		amazonUrl: string;
	};
}
