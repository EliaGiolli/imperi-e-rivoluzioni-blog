import type { NavLinkCurrent } from "../../shared/types";

/** Trailing slashes and query strings must not change whether a link counts as active. */
function normalizePath(path: string): string {
	const withoutSuffix = path.split(/[?#]/)[0].replace(/\/+$/, "");

	return withoutSuffix === "" ? "/" : withoutSuffix;
}

export function navLinkCurrent(pathname: string, href: string): NavLinkCurrent {
	const current = normalizePath(pathname);
	const target = normalizePath(href);

	if (current === target) {
		return "page";
	}

	// "/" prefixes every route, so the homepage link only ever matches exactly.
	if (target !== "/" && current.startsWith(`${target}/`)) {
		return "true";
	}

	return undefined;
}
