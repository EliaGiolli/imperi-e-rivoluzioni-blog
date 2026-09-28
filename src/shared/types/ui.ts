import type { CollectionEntry } from "astro:content";
import type { VariantProps } from "class-variance-authority";

import type { button } from "../utils/variants";
import type { ReadingCardReading, Series } from "./content";

/**
 * The `Props` of every component, in one place. Each component aliases the type it needs
 * (`type Props = CardProps`) so the markup stays the only thing left in the .astro file.
 */

/**
 * Card titles sit one level below whatever heading introduces the list, so they have to
 * follow the surrounding page. h3 covers the common case: a card grid under an h2.
 */
export type HeadingLevel = "h2" | "h3" | "h4";

export interface MainLayoutProps {
	title?: string;
	description?: string;
	/** "article" adds the article-specific Open Graph properties. */
	ogType?: "website" | "article";
	publishedTime?: Date;
	modifiedTime?: Date;
	/** Keeps a page out of search results without hiding it from visitors. */
	noindex?: boolean;
	/** The article whose issue number the header shows; defaults to the latest one. */
	issueSlug?: string;
	/** Only the front page sets this: it prints the full masthead. */
	masthead?: boolean;
}

export interface NavbarProps {
	issueSlug?: string;
	/** The front page's full masthead (with the page's h1) instead of the compact strip. */
	masthead?: boolean;
}

export interface EditionSwitchProps {
	/** "Sera" in the compact strip, "Edizione della sera" in the front-page masthead. */
	label?: "short" | "long";
}

/** The opening of an inner page: kicker, the page's h1 and an optional italic dek. */
export interface PageHeaderProps {
	kicker: string;
	title: string;
	dek?: string;
	id?: string;
}

/** A section opening: a double rule, a letter-spaced kicker and the heading. */
export interface SectionHeadingProps {
	id: string;
	kicker: string;
	title: string;
	/** An optional link aligned to the right of the heading row, e.g. "Tutte le letture". */
	link?: { href: string; label: string };
}

export interface LeadStoryProps {
	article: CollectionEntry<"articles">;
	series: Series<CollectionEntry<"articles">>;
	paragraphs: string[];
}

export interface SeriesBoxProps {
	series: Series<CollectionEntry<"articles">>;
	/** What the current part is called in the list: "in primo piano" on the front page. */
	currentNote: string;
}

export interface ReadingEntryProps {
	reading: CollectionEntry<"readings">;
	headingLevel?: HeadingLevel;
}

export interface CardProps {
	as?: "div" | "article" | "section";
	class?: string;
	[key: string]: unknown;
}

export interface ButtonProps extends VariantProps<typeof button> {
	href?: string;
	type?: "button" | "submit" | "reset";
	target?: string;
	rel?: string;
	class?: string;
}

export interface FormProps {
	id: string;
	action?: string;
	serviceId?: string;
	templateId?: string;
	publicKey?: string;
	class?: string;
}

export interface InputProps {
	name: string;
	label: string;
	type?: "text" | "email" | "tel" | "url";
	placeholder?: string;
	required?: boolean;
	autocomplete?: string;
	class?: string;
}

export interface ReadingCardProps {
	reading: ReadingCardReading;
	headingLevel?: HeadingLevel;
}

export interface ReadingTagFiltersProps {
	readings: CollectionEntry<"readings">[];
	label: string;
	title: string;
	description: string;
}

/** Astro hands the 500 page whatever was thrown; the template never renders it. */
export interface ServerErrorPageProps {
	error: unknown;
}
