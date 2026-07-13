import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { initPostIdMap } from "@utils/permalink-utils";
import { getCategoryUrl, getPostUrl } from "@utils/url-utils";

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		// 首先按置頂狀態排序，置頂文章在前
		if (a.data.pinned && !b.data.pinned) {
			return -1;
		}
		if (!a.data.pinned && b.data.pinned) {
			return 1;
		}

		// 如果置頂狀態相同，優先按 Priority 排序（數值越小越靠前）
		if (a.data.pinned && b.data.pinned) {
			const priorityA = a.data.priority;
			const priorityB = b.data.priority;
			if (priorityA !== undefined && priorityB !== undefined) {
				if (priorityA !== priorityB) {
					return priorityA - priorityB;
				}
			} else if (priorityA !== undefined) {
				return -1;
			} else if (priorityB !== undefined) {
				return 1;
			}
		}

		// 否則按發佈日期排序
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].id;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].id;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export interface PostForList {
	id: string;
	data: CollectionEntry<"posts">["data"];
	url?: string; // 預計算的文章 URL
}
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// 初始化文章 ID 映射（用於 permalink 功能）
	initPostIdMap(sortedFullPosts);

	// delete post.body，並預計算 URL
	const sortedPostsList = sortedFullPosts.map((post) => ({
		id: post.id,
		data: post.data,
		url: getPostUrl(post),
	}));

	return sortedPostsList;
}
export interface Tag {
	name: string;
	count: number;
}

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: Record<string, number> = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) {
				countMap[tag] = 0;
			}
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export interface Category {
	name: string;
	count: number;
	url: string;
}

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: Record<string, number> = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}

/**
 * 對文本進行分詞，支持中英文混合
 *
 * - 優先使用 Intl.Segmenter（在支持的運行時中效果更好）
 * - 在不支持 Segmenter 的環境（如部分 Node 運行時）下
 *   回退到基於正則的簡單分詞，以避免構建報錯
 * - 過濾標點和空白，英文統一小寫
 */
function tokenize(text: string): Set<string> {
	const tokens = new Set<string>();

	const hasSegmenter =
		typeof Intl !== "undefined" &&
		"Segmenter" in Intl &&
		typeof (Intl as unknown as { Segmenter?: unknown }).Segmenter ===
			"function";

	if (!hasSegmenter) {
		const basicTokens = text
			.toLowerCase()
			.split(/[\s\p{P}]+/gu)
			.filter(Boolean);
		for (const t of basicTokens) {
			tokens.add(t);
		}
		return tokens;
	}

	const segmenter = new (
		Intl as unknown as {
			Segmenter: new (
				locale: string,
				options: { granularity: string },
			) => {
				segment: (
					text: string,
				) => Iterable<{ segment: unknown; isWordLike: boolean | undefined }>;
			};
		}
	).Segmenter("zh", {
		granularity: "word",
	});
	for (const { segment, isWordLike } of segmenter.segment(text)) {
		if (!isWordLike) {
			continue;
		}
		tokens.add((segment as string).toLowerCase());
	}
	return tokens;
}

/**
 * 計算兩個集合的 Jaccard 相似度
 */
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
	if (a.size === 0 && b.size === 0) {
		return 0;
	}
	let intersection = 0;
	for (const item of a) {
		if (b.has(item)) {
			intersection++;
		}
	}
	const union = a.size + b.size - intersection;
	return union === 0 ? 0 : intersection / union;
}

/**
 * 計算標籤的 IDF（逆文檔頻率）權重
 * 稀有標籤（出現頻率低）獲得更高權重，常見標籤權重更低
 * IDF(tag) = log(N / (1 + df(tag)))，N = 總文章數，df = 包含該標籤的文章數
 */
function computeTagIDF(
	allPosts: { data: { tags?: string[] } }[],
): Map<string, number> {
	const tagDF = new Map<string, number>();
	const N = allPosts.length;

	for (const post of allPosts) {
		const tags = post.data.tags || [];
		for (const tag of tags) {
			tagDF.set(tag, (tagDF.get(tag) || 0) + 1);
		}
	}

	const tagIDF = new Map<string, number>();
	for (const [tag, df] of tagDF) {
		tagIDF.set(tag, Math.log(N / (1 + df)));
	}
	return tagIDF;
}

/**
 * 計算 IDF 加權標籤相似度
 * 對共有標籤的 IDF 值求和，歸一化到 [0, 1]
 */
function idfWeightedTagSimilarity(
	currentTags: string[],
	candidateTags: string[],
	tagIDF: Map<string, number>,
): number {
	if (currentTags.length === 0 || candidateTags.length === 0) {
		return 0;
	}

	const candidateSet = new Set(candidateTags);
	let intersectionWeight = 0;
	let currentTotalWeight = 0;

	for (const tag of currentTags) {
		const idf = tagIDF.get(tag) ?? 0;
		currentTotalWeight += idf;
		if (candidateSet.has(tag)) {
			intersectionWeight += idf;
		}
	}

	return currentTotalWeight === 0 ? 0 : intersectionWeight / currentTotalWeight;
}

/**
 * 獲取相關文章推薦 — 多算法加權評分
 *
 * 評分維度（權重可通過 relatedPostsConfig.weights 配置）：
 * - tagSimilarity: 標籤相似度（Jaccard 或 IDF 加權）
 * - titleSimilarity: 標題分詞 Jaccard 相似度
 * - descriptionSimilarity: 描述文本分詞相似度
 * - categoryMatch: 同分類加分
 * - freshness: 時間新鮮度（指數衰減）
 *
 * 總分 = Σ(維度分數 × 權重) / Σ權重
 */
export async function getRelatedPosts(
	currentPost: CollectionEntry<"posts">,
	maxCount = 5,
): Promise<PostForList[]> {
	const { relatedPostsConfig } = await import("../config/index.js");
	const weights = relatedPostsConfig.weights ?? {};
	const halfLife = relatedPostsConfig.freshnessHalfLife ?? 180;

	const w = {
		tagSimilarity: weights.tagSimilarity ?? 1.0,
		titleSimilarity: weights.titleSimilarity ?? 0.6,
		descriptionSimilarity: weights.descriptionSimilarity ?? 0.4,
		categoryMatch: weights.categoryMatch ?? 0.3,
		freshness: weights.freshness ?? 0.2,
		useIDF: weights.tagIDF ?? true,
	};

	const allPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	// 排除自身和加密文章
	const candidates = allPosts.filter(
		(p) => p.id !== currentPost.id && !p.data.password,
	);

	if (candidates.length === 0) return [];

	const currentTags = currentPost.data.tags || [];
	const currentTokens = tokenize(currentPost.data.title);
	const currentDesc = tokenize(currentPost.data.description || "");
	const currentCategory = currentPost.data.category || "";
	const now = Date.now();

	// 預計算標籤 IDF
	const tagIDF = w.useIDF ? computeTagIDF(allPosts) : new Map<string, number>();

	// 權重總和（用於歸一化）
	const totalWeight =
		w.tagSimilarity +
		w.titleSimilarity +
		w.descriptionSimilarity +
		w.categoryMatch +
		w.freshness;

	const scored = candidates.map((post) => {
		const postTags = post.data.tags || [];

		// 標籤相似度
		let tagScore: number;
		if (w.useIDF && currentTags.length > 0 && postTags.length > 0) {
			tagScore = idfWeightedTagSimilarity(currentTags, postTags, tagIDF);
		} else {
			tagScore = jaccardSimilarity(new Set(currentTags), new Set(postTags));
		}

		// 標題相似度
		const postTokens = tokenize(post.data.title);
		const titleScore = jaccardSimilarity(currentTokens, postTokens);

		// 描述相似度
		const postDesc = tokenize(post.data.description || "");
		const descScore = jaccardSimilarity(currentDesc, postDesc);

		// 分類匹配
		const postCategory = post.data.category || "";
		const catScore =
			currentCategory && postCategory && currentCategory === postCategory
				? 1
				: 0;

		// 時間新鮮度（指數衰減，半衰期可配）
		const daysSincePublished =
			(now - new Date(post.data.published).getTime()) / (1000 * 60 * 60 * 24);
		const freshnessScore = Math.exp(
			(-Math.LN2 * daysSincePublished) / halfLife,
		);

		// 加權總分（歸一化到 [0, 1]）
		const totalScore =
			totalWeight === 0
				? 0
				: (tagScore * w.tagSimilarity +
						titleScore * w.titleSimilarity +
						descScore * w.descriptionSimilarity +
						catScore * w.categoryMatch +
						freshnessScore * w.freshness) /
					totalWeight;

		return { post, totalScore, tagScore };
	});

	// 按總分降序排列
	scored.sort((a, b) => b.totalScore - a.totalScore);

	// 優先取有標籤匹配的，不足時從剩餘候選中補充
	const withTagMatch = scored.filter((s) => s.tagScore > 0);
	const withoutTagMatch = scored.filter((s) => s.tagScore === 0);

	const result: PostForList[] = [];

	for (const s of withTagMatch) {
		if (result.length >= maxCount) break;
		result.push({ id: s.post.id, data: s.post.data });
	}

	for (const s of withoutTagMatch) {
		if (result.length >= maxCount) break;
		result.push({ id: s.post.id, data: s.post.data });
	}

	return result;
}
