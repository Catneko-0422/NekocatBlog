import type { CollectionEntry } from "astro:content";

import { permalinkConfig } from "../config";
import { removeFileExtension } from "./url-utils";

// 文章 ID 映射緩存（用於存儲按時間排序後的文章序號）
let postIdMap: Map<string, number> | null = null;

/**
 * 初始化文章 ID 映射
 * 按發佈時間升序排列（最早的文章 id = 1），草稿文章不參與計算
 * @param posts 所有非草稿文章
 */
export function initPostIdMap(
	posts: CollectionEntry<"posts">[],
): Map<string, number> {
	if (postIdMap) {
		return postIdMap;
	}

	// 按發佈時間升序排序（最早的在前）
	const sortedPosts = [...posts].sort(
		(a, b) => a.data.published.getTime() - b.data.published.getTime(),
	);

	postIdMap = new Map();
	sortedPosts.forEach((post, index) => {
		// id 從 1 開始
		postIdMap?.set(post.id, index + 1);
	});

	return postIdMap;
}

/**
 * 獲取文章的序號 ID
 * @param postId 文章的 content collection id
 * @returns 文章序號，如果未初始化則返回 0
 */
export function getPostNumericId(postId: string): number {
	if (!postIdMap) {
		// 在客戶端或未初始化時返回 0，使用默認 slug
		console.warn("Post ID map not initialized. Returning 0 for post_id.");
		return 0;
	}
	return postIdMap.get(postId) ?? 0;
}

/**
 * 清除文章 ID 映射緩存（用於測試或重新初始化）
 */
export function clearPostIdMap(): void {
	postIdMap = null;
}

/**
 * 生成 permalink slug
 * 根據配置的格式模板和文章數據生成 URL slug
 * @param post 文章數據
 * @returns 生成的 slug（不包含 /posts/ 前綴）
 */
export function generatePermalinkSlug(post: CollectionEntry<"posts">): string {
	// 如果文章有自定義 permalink，優先使用（不在 /posts/ 下）
	if (post.data.permalink) {
		// 移除開頭和結尾的斜槓
		return post.data.permalink.replace(/^\/+/, "").replace(/\/+$/, "");
	}

	// 如果全局 permalink 功能未啓用，使用默認 slug
	if (!permalinkConfig.enable) {
		// 如果有 alias，使用 alias
		if (post.data.alias) {
			return post.data.alias.replace(/^\/+/, "").replace(/\/+$/, "");
		}
		// 否則使用文件名
		return removeFileExtension(post.id);
	}

	// 使用全局 permalink 格式模板
	const format = permalinkConfig.format;

	const published = post.data.published;
	const postname = removeFileExtension(post.id);

	let rawPostname = postname;
	// Use original file name preserving case from filePath if available
	if (post.filePath) {
		const parts = post.filePath.split("/");
		const filename = parts[parts.length - 1];
		if (filename) {
			rawPostname = removeFileExtension(filename);
		}
	}
	const category = post.data.category || "uncategorized";

	// 替換佔位符
	const slug = format
		.replace(/%year%/g, published.getFullYear().toString())
		.replace(
			/%monthnum%/g,
			(published.getMonth() + 1).toString().padStart(2, "0"),
		)
		.replace(/%day%/g, published.getDate().toString().padStart(2, "0"))
		.replace(/%hour%/g, published.getHours().toString().padStart(2, "0"))
		.replace(/%minute%/g, published.getMinutes().toString().padStart(2, "0"))
		.replace(/%second%/g, published.getSeconds().toString().padStart(2, "0"))
		.replace(/%post_id%/g, getPostNumericId(post.id).toString())
		.replace(/%postname%/g, postname)
		.replace(/%raw_postname%/g, rawPostname)
		.replace(/%category%/g, category);

	return slug;
}

/**
 * 判斷文章是否使用自定義 permalink（根目錄下，不在 /posts/ 下）
 * @param post 文章數據
 */
export function hasCustomPermalink(
	post: CollectionEntry<"posts"> | { data: { permalink?: string } },
): boolean {
	return !!post.data.permalink;
}

/**
 * 獲取文章的完整 URL 路徑
 * @param post 文章數據
 * @returns URL 路徑（如 /my-post/ 或 /custom-path/）
 */
export function getPermalinkPath(post: CollectionEntry<"posts">): string {
	const slug = generatePermalinkSlug(post);

	// 所有 permalink 生成的鏈接都在根目錄下
	return `/${slug}/`;
}
