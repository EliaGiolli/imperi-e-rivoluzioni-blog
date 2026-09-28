/**
 * The `aria-current` value a navigation link deserves for the page being rendered:
 * "page" for the exact destination, "true" for a section ancestor (the "Articoli"
 * link while reading `/articles/<slug>`), and `undefined` to leave the attribute off.
 */
export type NavLinkCurrent = "page" | "true" | undefined;

/** One entry of the section nav, the single row of links under the header. */
export interface NavLink {
	href: string;
	label: string;
}
