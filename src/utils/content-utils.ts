import { getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

export async function getSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}

export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap = allBlogPosts
		.flatMap((post) => post.data.tags)
		.reduce(
			(acc, tag) => {
				acc[tag] = (acc[tag] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

	return Object.keys(countMap)
		.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
		.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap = allBlogPosts.reduce(
		(acc, post) => {
			let categoryName = post.data.category;
			if (!categoryName) {
				categoryName = i18n(I18nKey.uncategorized);
			} else {
				categoryName = String(categoryName).trim();
			}

			acc[categoryName] = (acc[categoryName] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	return Object.keys(countMap)
		.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
		.map((key) => ({
			name: key,
			count: countMap[key],
			url: getCategoryUrl(key),
		}));
}
