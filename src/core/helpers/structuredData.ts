/**
 * schema.org JSON-LD for article pages. Search engines read this to show the author,
 * the publication date and the headline, so it is built from the Phase 2 frontmatter
 * rather than from anything the template happens to render.
 */

export interface ArticleSchemaInput {
	title: string;
	description: string;
	author: string;
	pubDate: Date;
	updatedDate?: Date;
	tags: string[];
	/** Absolute URL of the article itself. */
	url: string;
	/** Absolute URL of the social preview image. */
	imageUrl: string;
	blogName: string;
	siteUrl: string;
}

export function buildArticleSchema(article: ArticleSchemaInput): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: article.title,
		description: article.description,
		inLanguage: "it-IT",
		datePublished: article.pubDate.toISOString(),
		dateModified: (article.updatedDate ?? article.pubDate).toISOString(),
		author: {
			"@type": "Person",
			name: article.author,
		},
		publisher: {
			"@type": "Organization",
			name: article.blogName,
			url: article.siteUrl,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": article.url,
		},
		url: article.url,
		image: article.imageUrl,
		keywords: article.tags.join(", "),
	};
}
