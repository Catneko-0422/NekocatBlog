/**
 * 網格佈局工具函數
 * 提供 MainGridLayout 使用的服務端佈局計算邏輯
 */
import type { SiteConfig } from "../types/config";
import type { widgetManager } from "./widget-manager";

/**
 * Banner 圖片配置
 */
export interface BannerImages {
	desktop: string | string[];
	mobile: string | string[];
}

/**
 * 佈局配置接口
 */
export interface GridLayoutConfig {
	siteConfig: SiteConfig;
	widgetManager: typeof widgetManager;
}

/**
 * 側邊欄存在性配置
 */
export interface SidebarPresence {
	hasLeftSidebarComponents: boolean;
	hasRightSidebarComponents: boolean;
	hasMobileDrawerComponents: boolean;
	hasTabletLeftSidebarComponents: boolean;
}

/**
 * 網格佈局計算結果
 */
export interface GridLayoutResult {
	gridCols: string;
	sidebarClass: string;
	rightSidebarClass: string;
	mainContentClass: string;
	sidebarPresence: SidebarPresence;
	mobileShowSidebar: boolean;
	tabletShowSidebar: boolean;
	desktopShowSidebar: boolean;
	desktopShowLeftSidebar: boolean;
	desktopShowRightSidebar: boolean;
	tabletShowLeftSidebar: boolean;
	tabletShowRightSidebar: boolean;
	tabletAnySidebar: boolean;
	initialRightSidebarHidden: boolean;
	desktopMainPos: string;
}

/**
 * 獲取側邊欄組件存在性
 */
export function getSidebarPresence(wm: typeof widgetManager): SidebarPresence {
	const hasLeftSidebarComponents =
		wm.getComponentsByPosition("top", "left", "desktop").length > 0 ||
		wm.getComponentsByPosition("sticky", "left", "desktop").length > 0;

	const hasRightSidebarComponents =
		wm.getComponentsByPosition("top", "right", "desktop").length > 0 ||
		wm.getComponentsByPosition("sticky", "right", "desktop").length > 0;

	const hasMobileDrawerComponents =
		wm.getComponentsByPosition("top", "drawer", "mobile").length > 0 ||
		wm.getComponentsByPosition("sticky", "drawer", "mobile").length > 0;

	const hasTabletLeftSidebarComponents =
		wm.getComponentsByPosition("top", "left", "tablet").length > 0 ||
		wm.getComponentsByPosition("sticky", "left", "tablet").length > 0;

	return {
		hasLeftSidebarComponents,
		hasRightSidebarComponents,
		hasMobileDrawerComponents,
		hasTabletLeftSidebarComponents,
	};
}

/**
 * 計算網格佈局
 */
export function calculateGridLayout(
	config: GridLayoutConfig,
): GridLayoutResult {
	const { siteConfig, widgetManager: wm } = config;
	const presence = getSidebarPresence(wm);

	const {
		hasLeftSidebarComponents,
		hasRightSidebarComponents,
		hasMobileDrawerComponents,
		hasTabletLeftSidebarComponents,
	} = presence;

	// 檢查側邊欄是否啓用，動態調整網格佈局
	const mobileShowSidebar = hasMobileDrawerComponents;
	const tabletShowSidebar = hasTabletLeftSidebarComponents;
	const desktopShowSidebar =
		hasLeftSidebarComponents || hasRightSidebarComponents;

	// 桌面端側邊欄最終顯示狀態（考慮是否有組件）
	const desktopShowLeftSidebar = hasLeftSidebarComponents;
	const desktopShowRightSidebar = hasRightSidebarComponents;

	// 平板端側邊欄最終顯示狀態
	const tabletShowLeftSidebar = hasTabletLeftSidebarComponents;
	// 平板端不再有獨立的右側欄，如果右移左了，它就在 tabletShowLeftSidebar 中顯示
	const tabletShowRightSidebar = false;
	const tabletAnySidebar = tabletShowLeftSidebar;

	// 檢查默認佈局模式，如果是 grid 模式，右側邊欄初始就應該隱藏
	const defaultPostListLayout =
		siteConfig.postListLayout?.defaultMode || "list";
	const initialRightSidebarHidden = defaultPostListLayout === "grid";

	// 動態網格佈局類名 - 根據側邊欄模式和是否有組件調整列寬
	let desktopGridCols = "lg:grid-cols-1";
	if (desktopShowLeftSidebar && desktopShowRightSidebar) {
		desktopGridCols = "lg:grid-cols-[17.5rem_1fr_17.5rem]";
	} else if (desktopShowLeftSidebar) {
		desktopGridCols = "lg:grid-cols-[17.5rem_1fr]";
	} else if (desktopShowRightSidebar) {
		desktopGridCols = "lg:grid-cols-[1fr_17.5rem]";
	}

	const gridCols = `
		${mobileShowSidebar ? "grid-cols-1" : "grid-cols-1"}
		${tabletAnySidebar ? "md:grid-cols-[17.5rem_1fr]" : "md:grid-cols-1"}
		${desktopGridCols}
	`
		.trim()
		.replace(/\s+/g, " ");

	// 側邊欄容器類名 - 始終在左側
	const sidebarClass = `
		onload-animation
		${mobileShowSidebar && hasMobileDrawerComponents ? "block" : "hidden"}
		${tabletShowLeftSidebar ? "md:block md:mb-4 md:max-w-[17.5rem]" : "md:hidden"}
		${desktopShowLeftSidebar ? "lg:block lg:mb-4 lg:row-start-1 lg:row-end-2 lg:max-w-[17.5rem] lg:col-start-1 lg:col-end-2" : "lg:hidden"}
	`
		.trim()
		.replace(/\s+/g, " ");

	// 右側邊欄容器類名
	const rightSidebarClass = `
		onload-animation
		hidden
		${tabletShowRightSidebar ? "md:block md:mb-4 md:max-w-[17.5rem]" : "md:hidden"}
		${desktopShowRightSidebar ? `lg:block lg:self-start lg:h-fit lg:mb-4 lg:max-w-[17.5rem] ${desktopShowLeftSidebar ? "lg:col-start-3 lg:col-end-4" : "lg:col-start-2 lg:col-end-3"} lg:col-span-1` : "lg:hidden"}
		${initialRightSidebarHidden ? "hidden-in-grid-mode" : ""}
	`
		.trim()
		.replace(/\s+/g, " ");

	// 主內容區域類名 - 根據側邊欄模式調整grid-column
	let desktopMainPos = "lg:col-span-1";
	if (desktopShowLeftSidebar && desktopShowRightSidebar) {
		desktopMainPos = "lg:col-start-2 lg:col-end-3";
	} else if (desktopShowLeftSidebar) {
		desktopMainPos = "lg:col-start-2 lg:col-end-3";
	} else if (desktopShowRightSidebar) {
		desktopMainPos = "lg:col-start-1 lg:col-end-2";
	}

	const mainContentClass = `
		transition-swup-fade overflow-hidden w-full
		col-span-1 row-start-1 row-end-2
		${tabletAnySidebar ? "md:col-start-2 md:col-end-3" : "md:col-start-1 md:col-end-2"}
		${desktopShowSidebar ? desktopMainPos : "lg:col-span-1"}
	`
		.trim()
		.replace(/\s+/g, " ");

	return {
		gridCols,
		sidebarClass,
		rightSidebarClass,
		mainContentClass,
		sidebarPresence: presence,
		mobileShowSidebar,
		tabletShowSidebar,
		desktopShowSidebar,
		desktopShowLeftSidebar,
		desktopShowRightSidebar,
		tabletShowLeftSidebar,
		tabletShowRightSidebar,
		tabletAnySidebar,
		initialRightSidebarHidden,
		desktopMainPos,
	};
}

/**
 * 獲取 Banner 圖片
 */
export async function getBannerImages(
	siteConfig: SiteConfig,
): Promise<BannerImages> {
	let bannerSrc = siteConfig.banner.src;

	// 如果啓用了圖片API，獲取API圖片
	if (siteConfig.banner.imageApi?.enable && siteConfig.banner.imageApi?.url) {
		try {
			const response = await fetch(siteConfig.banner.imageApi.url);
			const text = await response.text();
			const apiImages = text.split("\n").filter((line) => line.trim());

			if (apiImages.length > 0) {
				bannerSrc = apiImages;
			}
		} catch (error) {
			console.warn("Failed to fetch images from API:", error);
		}
	}

	if (
		typeof bannerSrc === "object" &&
		bannerSrc !== null &&
		!Array.isArray(bannerSrc) &&
		("desktop" in bannerSrc || "mobile" in bannerSrc)
	) {
		const srcObj = bannerSrc as {
			desktop?: string | string[];
			mobile?: string | string[];
		};
		return {
			desktop: srcObj.desktop || srcObj.mobile || "",
			mobile: srcObj.mobile || srcObj.desktop || "",
		};
	}
	// 如果是字符串或字符串數組，同時用於桌面端和移動端
	return {
		desktop: bannerSrc as string | string[],
		mobile: bannerSrc as string | string[],
	};
}

/**
 * 檢查是否應該啓用半透明效果
 */
export function shouldEnableTransparency(
	defaultWallpaperMode: string,
): boolean {
	return defaultWallpaperMode === "overlay";
}

/**
 * 獲取半透明效果 CSS 類名
 */
export function getTransparencyClass(shouldEnable: boolean): string {
	return shouldEnable ? "wallpaper-transparent" : "";
}

/**
 * 計算主內容區域頂部位置
 */
export function getMainPanelTop(
	defaultWallpaperMode: string,
	bannerHeightVh: number,
	_fullscreenBannerHeightVh = 100,
): string {
	if (defaultWallpaperMode === "banner") {
		return `${bannerHeightVh}vh`;
	}
	if (defaultWallpaperMode === "fullscreen") {
		return "0";
	}
	return "5.5rem";
}
