import type { NavLink } from "../types";

export const BLOG_NAME = "Imperi e Rivoluzioni"
export const LOGO_ALT_TEXT = "Il logo del blog"

export const BLOG_AUTHOR = "Elia Giolli"
export const BLOG_LOCALE = "it_IT"

/** The one-line pitch reused as the default meta description and the RSS channel blurb. */
export const BLOG_DESCRIPTION = "Imperi e Rivoluzioni: storia contemporanea, lungo XX secolo, geopolitica e rapporti di potere per capire il presente attraverso le sue radici storiche."

/** Social preview card, rendered from the homepage hero and committed to public/. */
export const OG_IMAGE_PATH = "/og-image.png"
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

// Socials

export const INSTAGRAM_URL = 'https://www.instagram.com/imperierivoluzioni/';
export const SUBSTACK_URL = "https://imperierivoluzioni.substack.com/?r=92ksfy&utm_campaign=pub-share-checklist";
export const MAIL = 'rivoluzionieimperi@gmail.com';

// Main navigation, shared by the desktop and mobile menus in Navbar.astro.

export const NAV_LINKS: NavLink[] = [
	{ href: "/about", label: "Chi sono" },
	{ href: "/articles", label: "Articoli" },
	{ href: "/readings", label: "Letture consigliate", shortLabel: "Letture" },
	{ href: "/topics", label: "Temi" },
	{ href: "/contacts", label: "Contatti", cta: true },
];
