/**
 * Widget 渲染工具
 * 提供側邊欄組件渲染的通用邏輯
 */
import type { MarkdownHeading } from "astro";

import type { WidgetConfig } from "./types/widget";
import { widgetManager } from "./widget-manager";

/**
 * 組件渲染結果
 */
export interface RenderResult {
	Component: unknown;
	props: Record<string, unknown>;
}

/**
 * 獲取組件的 class 和 style 屬性
 * @param component 組件配置
 * @param index 組件索引
 * @returns 包含 class 和 style 的對象
 */
export function getComponentStyles(
	component: WidgetConfig,
	index: number,
): { class: string; style: string } {
	const componentClass = widgetManager.getComponentClass(component, index);
	const componentStyle = widgetManager.getComponentStyle(component, index);
	return {
		class: componentClass,
		style: componentStyle,
	};
}

/**
 * 組裝組件的 props
 * @param component 組件配置
 * @param index 組件索引
 * @param headings 可選的 Markdown 標題（用於 TOC 組件）
 * @returns 組裝好的 props 對象
 */
export function buildComponentProps(
	component: WidgetConfig,
	index: number,
	headings?: MarkdownHeading[],
): Record<string, unknown> {
	const { class: componentClass, style: componentStyle } = getComponentStyles(
		component,
		index,
	);

	const props: Record<string, unknown> = {
		class: componentClass,
		style: componentStyle,
		...component.customProps,
	};

	// TOC 組件需要傳入 headings
	if ((component.type === "toc" || component.type === "card-toc") && headings) {
		props.headings = headings;
	}

	return props;
}

/**
 * 獲取設備類型
 * @param width 窗口寬度
 * @param breakpoints 斷點配置
 * @returns 設備類型
 */
export function getDeviceType(
	width: number,
	breakpoints: { mobile: number; tablet: number },
): "mobile" | "tablet" | "desktop" {
	if (width < breakpoints.mobile) {
		return "mobile";
	}
	if (width < breakpoints.tablet) {
		return "tablet";
	}
	return "desktop";
}
