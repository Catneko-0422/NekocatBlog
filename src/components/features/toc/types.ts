/**
 * TOC 組件共享類型定義
 */

/**
 * TOC 條目數據結構
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

/**
 * TOC 配置
 */
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

/**
 * 從 DOM 提取的標題數據
 */
export interface HeadingData {
	/** 標題 ID */
	id: string;
	/** 標題文本 */
	text: string;
	/** 標題級別（1-6） */
	level: number;
}

/**
 * TOC 組件 Props 基礎接口
 */
export interface TOCBaseProps {
	/** 自定義類名 */
	class?: string;
}
