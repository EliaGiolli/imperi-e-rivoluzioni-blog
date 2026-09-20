import type { CollectionEntry } from "astro:content";
import type { VariantProps } from "class-variance-authority";

import type { button } from "../utils/variants";
import type { ArticleCardArticle, ReadingCardReading } from "./content";

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

export interface ArticleCardProps {
	article: ArticleCardArticle;
	headingLevel?: HeadingLevel;
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
