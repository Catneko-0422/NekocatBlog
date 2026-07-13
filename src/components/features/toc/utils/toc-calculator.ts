/**
 * toc-calculator - TOC 計算工具
 * 包含 TOC 生成、徽章計算等核心算法
 */

import type { HeadingData, TOCItem } from "../types/toc";
import { JAPANESE_KATAKANA } from "./japanese-katakana";

/**
 * 計算最小標題級別
 */
export function getMinLevel(headings: HeadingData[]): number {
	if (headings.length === 0) {
		return 1;
	}
	return Math.min(...headings.map((h) => h.level));
}

/**
 * 獲取 TOC 徽章文本
 */
export function getBadgeText(
	index: number,
	level: number,
	minLevel: number,
	useJapaneseBadge: boolean,
): string {
	if (level !== minLevel) {
		return "";
	}

	if (useJapaneseBadge && index < JAPANESE_KATAKANA.length) {
		return JAPANESE_KATAKANA[index];
	}
	return (index + 1).toString();
}

/**
 * 生成 TOC 條目數組
 */
export function generateTOCItems(
	headings: HeadingData[],
	depth: number,
	useJapaneseBadge: boolean,
): TOCItem[] {
	if (headings.length === 0) {
		return [];
	}

	const minLevel = getMinLevel(headings);
	let h1Count = 0;

	return headings
		.filter((h) => h.level < minLevel + depth)
		.map((h) => {
			const itemDepth = h.level - minLevel;
			const badge = getBadgeText(h1Count, h.level, minLevel, useJapaneseBadge);

			if (h.level === minLevel) {
				h1Count++;
			}

			return {
				id: h.id,
				text: h.text,
				level: h.level,
				depth: itemDepth,
				badge,
			};
		});
}

/**
 * 獲取徽章樣式類
 */
export function getBadgeClass(level: number, minLevel: number): string {
	if (level === minLevel) {
		return "bg-[var(--toc-badge-bg)] text-[var(--btn-content)]";
	}
	if (level === minLevel + 1) {
		return "w-2 h-2 rounded-[0.1875rem] bg-[var(--toc-badge-bg)]";
	}
	return "w-1.5 h-1.5 rounded-sm bg-black/5 dark:bg-white/10";
}

/**
 * 獲取縮進類
 */
export function getIndentClass(depth: number): string {
	if (depth === 0) {
		return "";
	}
	if (depth === 1) {
		return "ml-4";
	}
	return "ml-8";
}

/**
 * 獲取文本樣式類
 */
export function getTextClass(level: number, minLevel: number): string {
	if (level <= minLevel + 1) {
		return "text-50";
	}
	return "text-30";
}

/**
 * 檢查值是否在範圍內
 */
export function isInRange(value: number, min: number, max: number): boolean {
	return min < value && value < max;
}
