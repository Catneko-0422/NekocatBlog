/**
 * Swup 配置模塊
 * 提供頁面過渡動畫的配置常量和類型定義
 */

import type { FancyboxOptions } from "@fancyapps/ui";

// Banner 高度常量
export const BANNER_HEIGHT = 35;
export const BANNER_HEIGHT_EXTEND = 30;
export const BANNER_HEIGHT_HOME = BANNER_HEIGHT + BANNER_HEIGHT_EXTEND;

// 選擇器配置
export const SWUP_SELECTORS = {
	// 內容容器
	contentContainer: "#content-wrapper",

	// 動畫元素
	animationScope: "#main-grid",

	// 需要持久化的元素
	persistElements: [
		"#navbar-wrapper",
		"#sidebar",
		".music-player",
	],

	// Banner 相關
	bannerWrapper: "#banner-wrapper",
	banner: "#banner",
	bannerTextOverlay: ".banner-text-overlay",

	// 導航相關
	navbar: "#navbar",
	navbarWrapper: "#navbar-wrapper",

	// TOC 相關
	tocWrapper: "#toc-wrapper",
	tableOfContents: "table-of-contents",

	// 其他
	contentWrapper: "#content-wrapper",
	pageHeightExtend: "#page-height-extend",
	backToTopBtn: "#back-to-top-btn",
} as const;

// 過渡動畫配置類型
export interface TransitionConfig {
	duration: number;
	easing: string;
	easingOut: string;
	translateDistance: string;
	staggerDelay: number;
}

// 過渡動畫默認配置 - 靈感來自 Firefly 主題的快速流暢體驗
export const TRANSITION_CONFIG: TransitionConfig = {
	duration: 120,
	easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
	easingOut: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
	translateDistance: "1.5rem",
	staggerDelay: 35,
} as const;

// 動畫配置
export const ANIMATION_CONFIG = {
	// 頁面進入動畫時長 (ms)
	pageEnterDuration: TRANSITION_CONFIG.duration,

	// 頁面離開動畫時長 (ms)
	pageLeaveDuration: 150,

	// 頁面高度擴展延遲 (ms)
	heightExtendDelay: 150,

	// TOC 就緒延遲 (ms)
	tocReadyDelay: 80,

	// 評論系統初始化延遲 (ms)
	commentInitDelay: 250,

	// 移動端 banner 動畫延遲 (ms)
	mobileBannerDelay: 80,
	mobileContentDelay: 120,
} as const;

// 主題配置
export const THEME_CONFIG = {
	// 主題存儲鍵
	themeStorageKey: "theme",
	hueStorageKey: "hue",

	// 主題值
	lightMode: "light",
	darkMode: "dark",

	// Expressive Code 主題映射
	lightExpressiveTheme: "github-light",
	darkExpressiveTheme: "github-dark",
} as const;

// 滾動配置
export const SCROLL_CONFIG = {
	// 節流間隔 (ms)
	throttleInterval: 16, // 約60fps

	// 返回頂部顯示閾值偏移量 (像素)
	backToTopOffset: 100,

	// Navbar 隱藏閾值偏移量 (像素)
	navbarHideOffset: 88,
} as const;

// 性能模式配置
export type PerformanceMode = "high" | "medium" | "low" | "auto";

export interface PerformanceConfig {
	// 是否啓用 wave 動畫
	waveAnimation: {
		enabled: boolean;
		layers: number; // 桌面端波浪層數
		layersMobile: number; // 移動端波浪層數
	};
	// 櫻花效果配置
	sakuraEffect: {
		enabled: boolean;
		maxParticles: number; // 桌面端最大粒子數
		maxParticlesMobile: number; // 移動端最大粒子數
	};
	// Live2D/Pio 配置
	live2D: {
		enabled: boolean;
		hideOnMobile: boolean;
	};
	// 打字機效果
	typewriter: {
		enabled: boolean;
		hideOnMobile: boolean;
	};
}

export const PERFORMANCE_CONFIG: PerformanceConfig = {
	waveAnimation: {
		enabled: true,
		layers: 4,
		layersMobile: 2,
	},
	sakuraEffect: {
		enabled: true,
		maxParticles: 60,
		maxParticlesMobile: 25,
	},
	live2D: {
		enabled: true,
		hideOnMobile: true,
	},
	typewriter: {
		enabled: true,
		hideOnMobile: true,
	},
};

// 輪播配置類型
export interface CarouselConfig {
	enable: boolean;
	interval: number;
}

// Fancybox 配置類型
export type FancyboxConfig = Partial<FancyboxOptions>;

// 默認 Fancybox 配置
export const getDefaultFancyboxConfig = (): FancyboxConfig => ({
	Carousel: {
		infinite: true,
		Lazyload: { preload: 3 },
		Thumbs: { showOnStart: true },
		Toolbar: {
			display: {
				left: ["counter"],
				middle: [
					"zoomIn",
					"zoomOut",
					"toggle1to1",
					"rotateCCW",
					"rotateCW",
					"flipX",
					"flipY",
					"reset",
				],
				right: ["autoplay", "fullscreen", "thumbs", "close"],
			},
		},
		Zoomable: {
			Panzoom: { maxScale: 3, minScale: 1 },
		},
	},
	dragToClose: true,
	keyboard: {
		Escape: "close",
		Delete: "close",
		Backspace: "close",
		PageUp: "next",
		PageDown: "prev",
		ArrowUp: "next",
		ArrowDown: "prev",
		ArrowRight: "next",
		ArrowLeft: "prev",
	},
});

// Fancybox 選擇器
export const FANCYBOX_SELECTORS = {
	// 相冊/文章圖片
	albumImages: ".custom-md img, #post-cover img, .moment-images img",

	// 相冊鏈接
	albumLinks: ".moment-images a[data-fancybox]",

	// 單獨的 fancybox 圖片
	singleFancybox: "[data-fancybox]:not(.moment-images a)",
} as const;
