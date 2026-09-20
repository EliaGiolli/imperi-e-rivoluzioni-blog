export const BLOG_NAME = "Imperi e Rivoluzioni"
export const LOGO_ALT_TEXT = "Il logo del blog"

// Socials

export const INSTAGRAM_URL = 'https://www.instagram.com/imperierivoluzioni/';
export const SUBSTACK_URL = "https://imperierivoluzioni.substack.com/?r=92ksfy&utm_campaign=pub-share-checklist";
export const MAIL = 'rivoluzionieimperi@gmail.com';

// Main navigation, shared by the desktop and mobile menus in Navbar.astro.

export interface NavLink {
	href: string;
	label: string;
	/** Shorter wording for the mobile menu, where the row is narrower. */
	shortLabel?: string;
	/** Rendered as the highlighted call to action that closes the menu. */
	cta?: boolean;
}

export const NAV_LINKS: NavLink[] = [
	{ href: "/articles", label: "Articoli" },
	{ href: "/readings", label: "Letture consigliate", shortLabel: "Letture" },
	{ href: "/topics", label: "Temi" },
	{ href: "/about", label: "Chi sono" },
	{ href: "/contacts", label: "Contatti", cta: true },
];
