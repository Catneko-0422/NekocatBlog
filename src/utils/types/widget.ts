import type { MarkdownHeading } from "astro";

import type {
	WidgetComponentConfig,
	WidgetComponentType,
} from "@/types/config";

/**
 * Widget 組件類型
 */
export type WidgetType = WidgetComponentType;

/**
 * Widget 組件配置
 */
export interface WidgetConfig extends WidgetComponentConfig {
	customProps?: Record<string, unknown>;
}

/**
 * Widget 組件映射表類型
 */
export type WidgetComponentMap = Partial<Record<WidgetType, unknown>>;

/**
 * 渲染組件選項
 */
export interface RenderComponentOptions {
	component: WidgetConfig;
	index: number;
	components: WidgetConfig[];
	headings?: MarkdownHeading[];
}

/**
 * 渲染組件結果
 */
export interface RenderComponentResult {
	Component: unknown;
	props: Record<string, unknown>;
}

/**
 * 設備類型
 */
export type DeviceType = "mobile" | "tablet" | "desktop";

/**
 * 響應式邊欄配置
 */
export interface ResponsiveSidebarConfig {
	breakpoints: {
		mobile: number;
		tablet: number;
	};
	showConfig: {
		mobile: boolean;
		tablet: boolean;
		desktop: boolean;
	};
	hasComponents: {
		mobile: boolean;
		tablet: boolean;
	};
}

/**
 * 側邊欄管理器接口
 */
export interface SidebarManagerInterface {
	init(): void;
	updateResponsiveDisplay(): void;
}

/**
 * 側邊欄元素 ID 類型
 */
export type SidebarElementId = "sidebar" | "right-sidebar";

/**
 * 側邊欄位置
 */
export type SidebarPosition = "left" | "right" | "drawer";
