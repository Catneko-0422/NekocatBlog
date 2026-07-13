/**
 * useTocNavigation - TOC 導航邏輯 hook
 * 處理標題提取、滾動導航等核心功能
 */

import type { HeadingData, TOCScrollOptions } from "../types/toc";

/**
 * 從 DOM 中提取標題數據
 */
export function extractHeadingsFromDOM(
	containerSelector = "#post-container",
): HeadingData[] {
	const container = document.querySelector(containerSelector);
	if (!container) {
		return [];
	}

	const headings = container.querySelectorAll(
		"h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]",
	);
	return Array.from(headings).map((h) => ({
		id: h.id,
		text: (h.textContent || "").replace(/#+\s*$/, ""),
		level: Number.parseInt(h.tagName[1], 10),
	}));
}

/**
 * 滾動到指定標題
 */
export function scrollToHeading(
	id: string,
	options: TOCScrollOptions = {},
): void {
	const { offset = 80, behavior = "smooth" } = options;
	const element = document.getElementById(id);
	if (!element) {
		return;
	}

	const targetTop =
		element.getBoundingClientRect().top + window.scrollY - offset;
	window.scrollTo({ top: targetTop, behavior });
}

/**
 * 創建標題點擊處理器
 */
export function createHeadingClickHandler(
	getConfig?: () => { offset?: number; behavior?: ScrollBehavior },
): (event: Event) => void {
	return (event: Event) => {
		const anchor = (event.composedPath() as EventTarget[]).find(
			(el) => el instanceof HTMLAnchorElement,
		) as HTMLAnchorElement | undefined;

		if (!anchor?.hash) {
			return;
		}

		event.preventDefault();
		const id = decodeURIComponent(anchor.hash.substring(1));
		const config = getConfig?.() || {};
		scrollToHeading(id, {
			offset: config.offset,
			behavior: config.behavior,
		});
	};
}

/**
 * 獲取 TOC 配置
 */
export function getTOCConfig(): {
	depth: number;
	useJapaneseBadge: boolean;
} {
	const siteConfig = (
		window as unknown as {
			siteConfig?: {
				toc?: { depth?: number; useJapaneseBadge?: boolean };
			};
		}
	).siteConfig;
	return {
		depth: siteConfig?.toc?.depth ?? 3,
		useJapaneseBadge: siteConfig?.toc?.useJapaneseBadge ?? false,
	};
}

/**
 * 檢查當前頁面是否爲文章頁
 */
export function isPostPage(): boolean {
	const container = document.querySelector(
		".custom-md, .markdown-content, .prose, #post-container",
	);
	return container !== null;
}

/**
 * 獲取容器選擇器
 */
export function getContainerSelector(): string {
	if (typeof document === "undefined") {
		return "#post-container";
	}
	if (document.querySelector(".custom-md")) {
		return ".custom-md";
	}
	if (document.querySelector(".prose")) {
		return ".prose";
	}
	if (document.querySelector(".markdown-content")) {
		return ".markdown-content";
	}
	if (document.querySelector("#post-container")) {
		return "#post-container";
	}
	return ".custom-md";
}
