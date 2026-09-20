import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { byMostRecent } from "../core/helpers";
import { BLOG_DESCRIPTION, BLOG_NAME } from "../shared/utils/constants";

export async function GET(context: APIContext) {
	const articles = [...(await getCollection("articles"))].sort(byMostRecent);

	return rss({
		title: `${BLOG_NAME} — Articoli`,
		description: BLOG_DESCRIPTION,
		// `site` from astro.config.mjs; @astrojs/rss throws without it, which is the
		// behaviour we want rather than a feed full of relative links.
		site: context.site!,
		customData: "<language>it-IT</language>",
		items: articles.map((article) => ({
			title: article.data.title,
			description: article.data.description,
			pubDate: article.data.pubDate,
			author: article.data.author,
			categories: article.data.tags,
			link: `/articles/${article.data.slug}/`,
		})),
	});
}
