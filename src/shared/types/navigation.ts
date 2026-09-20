/**
 * The `aria-current` value a navigation link deserves for the page being rendered:
 * "page" for the exact destination, "true" for a section ancestor (the "Articoli"
 * link while reading `/articles/<slug>`), and `undefined` to leave the attribute off.
 */
export type NavLinkCurrent = "page" | "true" | undefined;

/** One entry of the main navigation, shared by the desktop and mobile menus. */
export interface NavLink {
	href: string;
	label: string;
	/** Shorter wording for the mobile menu, where the row is narrower. */
	shortLabel?: string;
	/** Rendered as the highlighted call to action that closes the menu. */
	cta?: boolean;
}
