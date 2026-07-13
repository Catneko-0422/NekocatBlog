/**
 * TOC 組件共享工具函數
 */

import type { HeadingData, TOCConfig, TOCItem } from "../types/toc";
import { getKatakanaBadge } from "./japanese-katakana";

/**
 * 從 DOM 中提取標題數據
 * @param containerSelector - 容器選擇器
 * @returns 標題數據數組
 */
export function extractHeadings(
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
 * 計算最小標題級別
 * @param headings - 標題數據數組
 * @returns 最小級別
 */
export function getMinLevel(headings: HeadingData[]): number {
	if (headings.length === 0) {
		return 1;
	}
	return Math.min(...headings.map((h) => h.level));
}

/**
 * 過濾並轉換標題爲 TOC 條目
 * @param headings - 標題數據數組
 * @param config - TOC 配置
 * @returns TOC 條目數組
 */
export function generateTOCItems(
	headings: HeadingData[],
	config: TOCConfig,
): TOCItem[] {
	if (headings.length === 0) {
		return [];
	}

	const minLevel = getMinLevel(headings);
	const maxDepth = config.depth;

	let h1Count = 0;

	return headings
		.filter((h) => h.level < minLevel + maxDepth)
		.map((h) => {
			const depth = h.level - minLevel;
			let badge: string | undefined;

			if (h.level === minLevel) {
				badge = getKatakanaBadge(h1Count, config.useJapaneseBadge);
				h1Count++;
			}

			return {
				id: h.id,
				text: h.text,
				level: h.level,
				depth,
				badge,
			};
		});
}

/**
 * 滾動到指定標題
 * @param id - 標題 ID
 * @param offset - 頂部偏移量（用於導航欄）
 */
export function scrollToHeading(id: string, offset = 80): void {
	const element = document.getElementById(id);
	if (!element) {
		return;
	}

	const targetTop =
		element.getBoundingClientRect().top + window.scrollY - offset;
	window.scrollTo({
		top: targetTop,
		behavior: "smooth",
	});
}

/**
 * 創建標題可見性觀察器
 * @param onActiveChange - 活動標題變更回調
 * @param options - 觀察器選項
 * @returns IntersectionObserver 實例
 */
export function createHeadingObserver(
	onActiveChange: (id: string) => void,
	options: { rootMargin?: string; threshold?: number } = {},
): IntersectionObserver {
	const { rootMargin = "-80px 0px -80% 0px", threshold = 0 } = options;

	return new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && entry.target.id) {
					onActiveChange(entry.target.id);
				}
			});
		},
		{ rootMargin, threshold },
	);
}

/**
 * 從全局配置獲取 TOC 配置
 * @returns TOC 配置
 */
export function getTOCConfig(): TOCConfig {
	const siteConfig = window.siteConfig || {};
	return {
		enable: siteConfig.toc?.enable ?? true,
		mode: siteConfig.toc?.mode ?? "sidebar",
		depth: siteConfig.toc?.depth ?? 3,
		useJapaneseBadge: siteConfig.toc?.useJapaneseBadge ?? false,
	};
}

/**
 * 計算閱讀進度
 * @returns 進度值（0-1）
 */
export function calculateReadingProgress(): number {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const docHeight =
		document.documentElement.scrollHeight -
		document.documentElement.clientHeight;
	return docHeight > 0 ? scrollTop / docHeight : 0;
}

/**
 * 防抖函數
 * @param fn - 要防抖的函數
 * @param delay - 延遲時間（毫秒）
 * @returns 防抖後的函數
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}
