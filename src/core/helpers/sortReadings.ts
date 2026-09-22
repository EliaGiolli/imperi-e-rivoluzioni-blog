import type { SortableReading } from "../../shared/types";

/** Most recently added first, falling back to the Italian-collated title when two readings tie. */
export function byMostRecentlyAdded(first: SortableReading, second: SortableReading): number {
	const difference = second.data.addedDate.getTime() - first.data.addedDate.getTime();

	return difference !== 0 ? difference : first.data.name.localeCompare(second.data.name, "it");
}
