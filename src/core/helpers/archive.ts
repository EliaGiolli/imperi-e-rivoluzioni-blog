import type { ArchiveTopic, SeriesArticle } from "../../shared/types";
import { seriesOf } from "./series";

const byItalianName = (first: string, second: string): number => first.localeCompare(second, "it");

/**
 * The archive's index: topics in alphabetical order, each with its series (one per
 * category), each series in reading order. A new topic or series appears on its own.
 */
export function archiveOf<T extends SeriesArticle>(articles: readonly T[]): ArchiveTopic<T>[] {
	const topics = [...new Set(articles.map((article) => article.data.topic))].sort(byItalianName);

	return topics.map((topic) => {
		const inTopic = articles.filter((article) => article.data.topic === topic);
		const categories = [...new Set(inTopic.map((article) => article.data.category))].sort(byItalianName);

		return {
			topic,
			series: categories.map((category) => {
				const series = seriesOf(inTopic.find((article) => article.data.category === category)!, articles);

				// No part is "current" in an index.
				return { name: series.name, parts: series.parts.map((part) => ({ ...part, current: false })) };
			}),
		};
	});
}
