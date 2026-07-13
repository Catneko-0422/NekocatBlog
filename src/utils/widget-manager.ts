import { sidebarLayoutConfig } from "../config";
import type {
	SidebarLayoutConfig,
	WidgetComponentConfig,
	WidgetComponentType,
} from "../types/config";

/**
 * 組件映射表 - 將組件類型映射到實際的組件路徑
 */
export const WIDGET_COMPONENT_MAP = {
	profile: "../components/widgets/profile/Profile.astro",
	announcement: "../components/widgets/announcement/Announcement.astro",
	categories: "../components/widgets/categories/Categories.astro",
	tags: "../components/widgets/tags/Tags.astro",
	toc: "../components/widgets/toc/TOC.astro",
	"card-toc": "../components/widgets/card-toc/CardTOC.astro",
	"music-player": "../components/widgets/music-player/MusicPlayer.svelte",
	"music-sidebar":
		"../components/widgets/music-sidebar/MusicSidebarWidget.astro",
	pio: "../components/widget/Pio.astro",
	"site-stats": "../components/widgets/site-stats/SiteStats.astro",
	calendar: "../components/widgets/calendar/Calendar.astro",
	custom: null,
} as const;

/**
 * 組件管理器類
 * 負責管理側邊欄組件的動態加載、排序和渲染
 */
export class WidgetManager {
	private config: SidebarLayoutConfig;

	constructor(config: SidebarLayoutConfig = sidebarLayoutConfig) {
		this.config = config;
	}

	/**
	 * 獲取配置
	 */
	getConfig(): SidebarLayoutConfig {
		return this.config;
	}

	/**
	 * 根據位置獲取組件列表
	 * @param position 組件位置：'top' | 'sticky'
	 * @param sidebar 側邊欄位置（可選）：'left' | 'right' | 'drawer'
	 * @param deviceType 設備類型（可選）：'mobile' | 'tablet' | 'desktop'
	 */
	getComponentsByPosition(
		position: "top" | "sticky",
		sidebar: "left" | "right" | "drawer" = "left",
		deviceType: "mobile" | "tablet" | "desktop" = "desktop",
	): WidgetComponentConfig[] {
		let activeSidebar = sidebar;

		// 手機端邏輯：完全由 drawer 決定，不合並左右側欄
		if (deviceType === "mobile") {
			activeSidebar = "drawer";
		}
		// 平板端邏輯：在左側有配置組件的情況下僅保留左側組件，左側沒有配置組件時則將右側的組件移到左側
		else if (deviceType === "tablet") {
			if (sidebar === "right") {
				return [];
			}
			if (sidebar === "left") {
				activeSidebar =
					this.config.components.left.length > 0 ? "left" : "right";
			}
		}

		const componentTypes = this.config.components[activeSidebar] || [];

		return componentTypes
			.map((type) => {
				const prop = this.config.properties.find((p) => p.type === type);
				if (prop && prop.position === position) {
					return prop;
				}
				// 如果沒有在 properties 中找到配置，且位置匹配默認的 top，則返回一個基礎配置
				if (!prop && position === "top") {
					return { type, position: "top" } as WidgetComponentConfig;
				}
				return null;
			})
			.filter(Boolean) as WidgetComponentConfig[];
	}

	/**
	 * 獲取組件的動畫延遲時間
	 * @param component 組件配置
	 * @param index 組件在列表中的索引
	 */
	getAnimationDelay(component: WidgetComponentConfig, index: number): number {
		if (component.animationDelay !== undefined) {
			return component.animationDelay;
		}

		if (this.config.defaultAnimation.enable) {
			return (
				this.config.defaultAnimation.baseDelay +
				index * this.config.defaultAnimation.increment
			);
		}

		return 0;
	}

	/**
	 * 獲取組件的CSS類名
	 * @param component 組件配置
	 * @param index 組件在列表中的索引
	 */
	getComponentClass(component: WidgetComponentConfig, _index: number): string {
		const classes: string[] = [];

		// 添加基礎類名
		if (component.class) {
			classes.push(component.class);
		}

		// 添加響應式隱藏類名
		if (component.responsive?.hidden) {
			component.responsive.hidden.forEach((device) => {
				switch (device) {
					case "mobile":
						classes.push("hidden", "md:block");
						break;
					case "tablet":
						classes.push("md:hidden", "lg:block");
						break;
					case "desktop":
						classes.push("lg:hidden");
						break;
				}
			});
		}

		return classes.join(" ");
	}

	/**
	 * 獲取組件的內聯樣式
	 * @param component 組件配置
	 * @param index 組件在列表中的索引
	 */
	getComponentStyle(component: WidgetComponentConfig, index: number): string {
		const styles: string[] = [];

		// 添加自定義樣式
		if (component.style) {
			styles.push(component.style);
		}

		// 添加動畫延遲樣式
		const animationDelay = this.getAnimationDelay(component, index);
		if (animationDelay > 0) {
			styles.push(`animation-delay: ${animationDelay}ms`);
		}

		return styles.join("; ");
	}

	/**
	 * 檢查組件是否應該摺疊
	 * @param component 組件配置
	 * @param itemCount 組件內容項數量
	 */
	isCollapsed(component: WidgetComponentConfig, itemCount: number): boolean {
		if (!component.responsive?.collapseThreshold) {
			return false;
		}
		return itemCount >= component.responsive.collapseThreshold;
	}

	/**
	 * 獲取組件的路徑
	 * @param componentType 組件類型
	 */
	getComponentPath(componentType: WidgetComponentType): string | null {
		return WIDGET_COMPONENT_MAP[componentType];
	}

	/**
	 * 檢查當前設備是否應該顯示側邊欄
	 * @param deviceType 設備類型
	 */
	shouldShowSidebar(deviceType: "mobile" | "tablet" | "desktop"): boolean {
		if (deviceType === "mobile") {
			return this.config.components.drawer.length > 0;
		}
		if (deviceType === "tablet") {
			return (
				this.config.components.left.length > 0 ||
				this.config.components.right.length > 0
			);
		}
		// desktop
		return (
			this.config.components.left.length > 0 ||
			this.config.components.right.length > 0
		);
	}

	/**
	 * 獲取設備斷點配置
	 */
	getBreakpoints() {
		return this.config.responsive.breakpoints;
	}

	/**
	 * 更新組件配置
	 * @param newConfig 新的配置
	 */
	updateConfig(newConfig: Partial<SidebarLayoutConfig>): void {
		this.config = { ...this.config, ...newConfig };
	}

	/**
	 * 添加新組件到佈局中
	 * @param type 組件類型
	 * @param sidebar 側邊欄位置
	 */
	addComponentToLayout(
		type: WidgetComponentType,
		sidebar: "left" | "right" | "drawer" = "left",
	): void {
		if (!this.config.components[sidebar].includes(type)) {
			this.config.components[sidebar].push(type);
		}
	}

	/**
	 * 從佈局中移除組件
	 * @param type 組件類型
	 */
	removeComponentFromLayout(type: WidgetComponentType): void {
		this.config.components.left = this.config.components.left.filter(
			(t) => t !== type,
		);
		this.config.components.right = this.config.components.right.filter(
			(t) => t !== type,
		);
		this.config.components.drawer = this.config.components.drawer.filter(
			(t) => t !== type,
		);
	}

	/**
	 * 檢查組件是否應該在側邊欄中渲染
	 * @param componentType 組件類型
	 */
	isSidebarComponent(componentType: WidgetComponentType): boolean {
		// Pio 組件是全局組件，不在側邊欄中渲染
		return componentType !== "pio";
	}
}

/**
 * 默認組件管理器實例
 */
export const widgetManager = new WidgetManager();

/**
 * 工具函數：根據組件類型獲取組件配置
 * @param componentType 組件類型
 */
export function getComponentConfig(
	componentType: WidgetComponentType,
): WidgetComponentConfig | undefined {
	return widgetManager
		.getConfig()
		.properties.find((p) => p.type === componentType);
}

/**
 * 工具函數：檢查組件是否啓用
 * @param componentType 組件類型
 */
export function isComponentEnabled(
	componentType: WidgetComponentType,
): boolean {
	const config = widgetManager.getConfig().components;
	return (
		config.left.includes(componentType) ||
		config.right.includes(componentType) ||
		config.drawer.includes(componentType)
	);
}

/**
 * 工具函數：獲取所有啓用的組件類型(左側邊欄爲主)
 */
export function getEnabledComponentTypes(): WidgetComponentType[] {
	return widgetManager.getConfig().components.left;
}
