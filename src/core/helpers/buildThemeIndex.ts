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

const compare = (first: string, second: string): number => first.localeCompare(second, "it");

/** URL/id-safe slug for anchors, e.g. "Medio Oriente e questione israelo-palestinese" -> "medio-oriente-e-questione-israelo-palestinese". */
export function slugifyTheme(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function toArticleEntry(article: ThemeIndexArticle): ThemeEntry {
	return {
		kind: "article",
		title: article.data.title,
		subtitle: article.data.category,
		description: article.data.description,
		href: `/articles/${article.data.slug}`,
		tags: article.data.tags,
		topic: article.data.topic,
	};
}

function toReadingEntry(reading: ThemeIndexReading): ThemeEntry {
	return {
		kind: "reading",
		title: reading.data.name,
		subtitle: reading.data.author,
		description: reading.data.description,
		href: `/readings/${reading.id}`,
		tags: reading.data.tags,
		topic: reading.data.topic,
	};
}

function sortEntries(entries: ThemeEntry[]): ThemeEntry[] {
	return [...entries].sort((first, second) => {
		if (first.kind !== second.kind) {
			return first.kind === "article" ? -1 : 1;
		}

		return compare(first.title, second.title);
	});
}

function toGroups(buckets: Map<string, ThemeEntry[]>): ThemeGroup[] {
	return [...buckets.entries()]
		.map(([name, entries]) => {
			const sorted = sortEntries(entries);

			return {
				name,
				slug: slugifyTheme(name),
				entries: sorted,
				tags: [...new Set(sorted.flatMap((entry) => entry.tags))].sort(compare),
				articleCount: sorted.filter((entry) => entry.kind === "article").length,
				readingCount: sorted.filter((entry) => entry.kind === "reading").length,
			};
		})
		.sort((first, second) => compare(first.name, second.name));
}

/**
 * Builds the cross-collection theme index behind /topics.
 *
 * Entries are grouped twice: by `topic` — where an entry also joins the topics named by its own
 * tags, which is what bridges the two collections — and by tag, for an analytical index.
 */
export function buildThemeIndex(articles: ThemeIndexArticle[], readings: ThemeIndexReading[]): ThemeIndex {
	const entries = [...articles.map(toArticleEntry), ...readings.map(toReadingEntry)];
	const topicNames = new Map(entries.map((entry) => [entry.topic.toLowerCase(), entry.topic]));

	const topicBuckets = new Map<string, ThemeEntry[]>();
	const tagBuckets = new Map<string, ThemeEntry[]>();

	for (const entry of entries) {
		const matchedTopics = new Set([entry.topic]);

		for (const tag of entry.tags) {
			const topic = topicNames.get(tag.toLowerCase());

			if (topic) {
				matchedTopics.add(topic);
			}
		}

		for (const topic of matchedTopics) {
			topicBuckets.set(topic, [...(topicBuckets.get(topic) ?? []), entry]);
		}

		for (const tag of new Set(entry.tags)) {
			tagBuckets.set(tag, [...(tagBuckets.get(tag) ?? []), entry]);
		}
	}

	return { topics: toGroups(topicBuckets), tags: toGroups(tagBuckets) };
}
