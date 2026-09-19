export interface SortableArticle {
	data: {
		order: number;
		pubDate: Date;
	};
}

/** Cycle order: the sequence the author intended a multi-part series to be read in. */
export function byReadingOrder(first: SortableArticle, second: SortableArticle): number {
	if (first.data.order !== second.data.order) {
		return first.data.order - second.data.order;
	}

	return first.data.pubDate.getTime() - second.data.pubDate.getTime();
}

/** Newest first, falling back to the cycle order when two articles share a date. */
export function byMostRecent(first: SortableArticle, second: SortableArticle): number {
	const difference = second.data.pubDate.getTime() - first.data.pubDate.getTime();

	return difference !== 0 ? difference : second.data.order - first.data.order;
}
