/**
 * TOC 組件統一導出
 *
 * Astro 組件使用包裝器模式重導出
 * Svelte 組件（MobileTOC）請從原始位置導入：@components/MobileTOC.svelte
 */

// 子組件導出
export { default as TOCBadge } from "./components/TOCBadge.astro";
export { default as TOCItemComponent } from "./components/TOCItem.astro";
export { default as TOCProgressBar } from "./components/TOCProgressBar.astro";
// 組件導出（兼容包裝器）
export { default as FloatingTOC } from "./FloatingTOC.astro";
// Hooks 導出
export * from "./hooks/useFloatingTOC";
// Highlight hooks
export {
	calculateActiveHeadingRange,
	calculateFallbackActiveHeading,
	createHeadingVisibilityObserver,
	findActiveHeadingByObserver,
	findActiveHeadingIndex,
	isElementInViewport,
} from "./hooks/useTocHighlight";
// Navigation hooks
export {
	createHeadingClickHandler,
	extractHeadingsFromDOM,
	getContainerSelector,
	getTOCConfig as getTocConfig,
	isPostPage,
	scrollToHeading as scrollToTocHeading,
} from "./hooks/useTocNavigation";
// Scroll hooks
export {
	calculateActiveIndicatorPosition,
	calculateReadingProgress as getReadingProgress,
	createScrollHandler,
	debounce as debounceScroll,
	scrollActiveIntoView,
	throttle as throttleScroll,
	updateProgressRing,
} from "./hooks/useTocScroll";
export { default as SidebarTOC } from "./SidebarTOC.astro";
// 類型導出
export type {
	HeadingData,
	TOCBaseProps,
	TOCConfig,
	TOCItem,
	TOCObserverOptions,
	TOCScrollOptions,
} from "./types/toc";
// Calculator utilities
export {
	getKatakanaBadge,
	JAPANESE_KATAKANA,
	KATAKANA_COUNT,
} from "./utils/japanese-katakana";
export {
	generateTOCItems as calcTOCItems,
	getBadgeClass,
	getBadgeText,
	getIndentClass,
	getMinLevel as calcMinLevel,
	getTextClass,
	isInRange,
} from "./utils/toc-calculator";
// 工具函數導出
export {
	calculateReadingProgress,
	createHeadingObserver,
	debounce,
	extractHeadings,
	generateTOCItems,
	getMinLevel,
	getTOCConfig,
	scrollToHeading,
} from "./utils/toc-utils";
