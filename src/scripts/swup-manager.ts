/**
 * Swup 管理器主入口
 * 協調所有子模塊，提供統一的頁面過渡管理
 */

import { widgetConfigs } from "../config";
import { initLinkPreloading } from "../utils/navigation-utils";
import { SWUP_SELECTORS } from "./core/swup-config";
import { SwupHooksManager } from "./core/swup-hooks";
import { setupSakuraOnDOMReady } from "./effects/sakura-effect";
import {
	destroyTransitionEffect,
	getTransitionEffect,
} from "./effects/transition-effect";
import type { BackToTopHandler } from "./handlers/back-to-top-handler";
import {
	getBackToTopHandler,
	initBackToTopHandler,
} from "./handlers/back-to-top-handler";
import type { FancyboxHandler } from "./handlers/fancybox-handler";
import {
	cleanupFancybox,
	getFancyboxHandler,
	initFancybox,
} from "./handlers/fancybox-handler";
import type { PanelHandler } from "./handlers/panel-handler";
import { getPanelHandler, initPanelHandler } from "./handlers/panel-handler";
import { checkKatex, initCustomScrollbar } from "./handlers/scroll-handler";

/**
 * Swup 管理器類
 * 統一管理頁面過渡相關的所有功能
 */
export class SwupManager {
	private hooksManager: SwupHooksManager | null = null;
	private fancyboxHandler: FancyboxHandler;
	private backToTopHandler: BackToTopHandler;
	private panelHandler: PanelHandler;

	private bannerEnabled: boolean;
	private initialized = false;

	constructor() {
		this.bannerEnabled = !!document.getElementById(
			SWUP_SELECTORS.bannerWrapper.slice(1),
		);

		// 初始化各個處理器
		this.fancyboxHandler = getFancyboxHandler();
		this.backToTopHandler = getBackToTopHandler(this.bannerEnabled);
		this.panelHandler = getPanelHandler();
	}

	/**
	 * 初始化 Swup 管理器
	 */
	async init(): Promise<void> {
		if (this.initialized) {
			return;
		}

		const transitionEffect = getTransitionEffect();
		transitionEffect.applyConfig();

		await this.initPanelHandler();

		// 設置 Sakura 特效
		this.setupSakura();

		// 初始化 Swup 鉤子
		this.initSwupHooks();

		// 初始化返回頂部處理器
		initBackToTopHandler(this.bannerEnabled);

		// 初始化 Banner
		this.initBanner();

		// 初始化鏈接預加載
		this.initPreloading();

		this.initialized = true;
		console.log("SwupManager: 初始化完成");
	}

	/**
	 * 初始化面板處理器
	 */
	private async initPanelHandler(): Promise<void> {
		try {
			await initPanelHandler();
		} catch (error) {
			console.error("SwupManager: 面板處理器初始化失敗", error);
		}
	}

	/**
	 * 設置 Sakura 特效
	 */
	private setupSakura(): void {
		setupSakuraOnDOMReady(widgetConfigs);
	}

	/**
	 * 初始化 Swup 鉤子
	 */
	private initSwupHooks(): void {
		// 創建鉤子管理器
		this.hooksManager = new SwupHooksManager(this.bannerEnabled, {
			showBanner: this.showBanner.bind(this),
			initFancybox: async () => {
				await initFancybox();
			},
			cleanupFancybox: () => {
				cleanupFancybox();
			},
			initCustomScrollbar: () => {
				initCustomScrollbar();
			},
			checkKatex: () => {
				checkKatex();
			},
		});

		// 如果 Swup 已經就緒，直接設置鉤子
		if (window?.swup?.hooks) {
			initFancybox();
			checkKatex();
			this.hooksManager.registerHooks();
		} else {
			// 監聽 Swup 就緒事件
			document.addEventListener("swup:enable", () => {
				if (this.hooksManager) {
					this.hooksManager.registerHooks();
				}
			});

			// 監聽 DOM 加載（確保首屏也能加載優化組件）
			if (document.readyState === "loading") {
				document.addEventListener("DOMContentLoaded", async () => {
					await initFancybox();
					checkKatex();
				});
			} else {
				initFancybox();
				checkKatex();
			}
		}
	}

	/**
	 * 初始化 Banner
	 */
	private initBanner(): void {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", async () => {
				this.showBanner();
			});
		} else {
			this.showBanner();
		}
	}

	/**
	 * 初始化鏈接預加載
	 */
	private initPreloading(): void {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => {
				initLinkPreloading();
			});
		} else {
			initLinkPreloading();
		}
	}

	/**
	 * 顯示 Banner
	 * 輪播圖由 Banner.astro 中的內聯腳本自行初始化（data-swup-ignore-script），
	 * 此處僅處理單圖模式的淡入效果。
	 */
	showBanner(): void {
		requestAnimationFrame(() => {
			// 處理單圖 Banner (桌面端)
			const banner = document.getElementById(
				SWUP_SELECTORS.banner.slice(1),
			);
			if (banner) {
				banner.classList.remove("opacity-0", "scale-105");
			}

			// 處理移動端單圖 Banner
			const mobileBanner = document.querySelector(
				'.block.md\\:hidden[alt="Mobile banner image of the blog"]',
			);
			if (mobileBanner && !document.getElementById("banner-carousel")) {
				mobileBanner.classList.remove("opacity-0", "scale-105");
				mobileBanner.classList.add("opacity-100");
			}
		});
	}

	/**
	 * 銷燬管理器
	 */
	destroy(): void {
		this.hooksManager = null;
		this.fancyboxHandler.destroy();
		this.backToTopHandler.destroy();
		this.panelHandler.destroy();
		destroyTransitionEffect();
		this.initialized = false;
	}

	/**
	 * 獲取 Banner 啓用狀態
	 */
	isBannerEnabled(): boolean {
		return this.bannerEnabled;
	}
}

// 創建全局實例
let globalSwupManager: SwupManager | null = null;

/**
 * 獲取全局 Swup 管理器實例
 */
export function getSwupManager(): SwupManager {
	if (!globalSwupManager) {
		globalSwupManager = new SwupManager();
	}
	return globalSwupManager;
}

/**
 * 初始化 Swup 管理器（便捷函數）
 */
export async function initSwupManager(): Promise<void> {
	const manager = getSwupManager();
	await manager.init();
}
