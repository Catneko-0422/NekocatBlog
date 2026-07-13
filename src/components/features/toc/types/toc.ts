/**
 * TOC 組件共享類型定義
 */

export interface TOCItem {
	/** 標題 ID（用於錨點） */
	id: string;
	/** 標題文本 */
	text: string;
	/** 標題級別（1-6） */
	level: number;
	/** 相對深度（0 = 頂級） */
	depth: number;
	/** 徽章文本（數字或日語字符） */
	badge?: string;
}

export interface TOCConfig {
	/** 是否啓用 TOC */
	enable: boolean;
	/** 顯示模式 */
	mode: "float" | "sidebar";
	/** 標題深度（1-6） */
	depth: number;
	/** 是否使用日語徽章 */
	useJapaneseBadge: boolean;
}

export interface HeadingData {
	/** 標題 ID */
	id: string;
	/** 標題文本 */
	text: string;
	/** 標題級別（1-6） */
	level: number;
}

export interface TOCBaseProps {
	/** 自定義類名 */
	class?: string;
}

export interface TOCObserverOptions {
	/** 根部邊距 */
	rootMargin?: string;
	/** 閾值 */
	threshold?: number;
	/** 活動標題變化回調 */
	onActiveChange?: (id: string) => void;
}

export interface TOCScrollOptions {
	/** 頂部偏移量（用於導航欄） */
	offset?: number;
	/** 是否平滑滾動 */
	behavior?: ScrollBehavior;
}
