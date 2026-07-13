/**
 * Fancybox 處理器
 * 管理圖片燈箱的初始化和清理
 */

import {
	FANCYBOX_SELECTORS,
	type FancyboxConfig,
	getDefaultFancyboxConfig,
} from "../core/swup-config";

// Fancybox 模塊類型
type FancyboxType = any;

/**
 * Fancybox 處理器類
 * 負責圖片燈箱的按需加載和管理
 */
export class FancyboxHandler {
	private Fancybox: FancyboxType | null = null;
	private boundSelectors: string[] = [];
	private initialized = false;

	/**
	 * 初始化 Fancybox
	 * 按需加載 Fancybox 模塊和樣式
	 */
	async init(): Promise<void> {
		const hasImages = this.checkForImages();

		if (!hasImages) {
			return;
		}

		// 按需加載 Fancybox 模塊
		if (!this.Fancybox) {
			await this.loadFancybox();
		}

		// 避免重複初始化
		if (this.boundSelectors.length > 0) {
			return;
		}

		this.bindImageSelectors();
		this.initialized = true;
	}

	/**
	 * 檢查頁面是否有需要 Fancybox 的圖片
	 */
	private checkForImages(): boolean {
		return (
			document.querySelector(FANCYBOX_SELECTORS.albumImages) !== null ||
			document.querySelector(FANCYBOX_SELECTORS.albumLinks) !== null ||
			document.querySelector(FANCYBOX_SELECTORS.singleFancybox) !== null
		);
	}

	/**
	 * 加載 Fancybox 模塊和樣式
	 */
	private async loadFancybox(): Promise<void> {
		const mod = await import("@fancyapps/ui");
		this.Fancybox = mod.Fancybox;
		await import("@fancyapps/ui/dist/fancybox/fancybox.css");
	}

	/**
	 * 綁定圖片選擇器
	 */
	private bindImageSelectors(): void {
		if (!this.Fancybox) {
			return;
		}

		const commonConfig = getDefaultFancyboxConfig();

		// 綁定相冊/文章圖片
		this.Fancybox.bind(
			FANCYBOX_SELECTORS.albumImages,
			this.createAlbumImagesConfig(commonConfig),
		);
		this.boundSelectors.push(FANCYBOX_SELECTORS.albumImages);

		// 綁定相冊鏈接
		this.Fancybox.bind(FANCYBOX_SELECTORS.albumLinks, {
			...commonConfig,
			source: (el: any) => {
				return el.getAttribute("data-src") || el.getAttribute("href");
			},
		});
		this.boundSelectors.push(FANCYBOX_SELECTORS.albumLinks);

		// 綁定單獨的 fancybox 圖片
		this.Fancybox.bind(FANCYBOX_SELECTORS.singleFancybox, commonConfig);
		this.boundSelectors.push(FANCYBOX_SELECTORS.singleFancybox);
	}

	/**
	 * 創建相冊/文章圖片配置
	 * 保留默認 Carousel 插件配置，避免覆蓋旋轉工具欄
	 */
	private createAlbumImagesConfig(commonConfig: FancyboxConfig): FancyboxConfig {
		const carouselConfig = commonConfig.Carousel ?? {};
		const lazyloadConfig = carouselConfig.Lazyload;

		return {
			...commonConfig,
			groupAll: true,
			Carousel: {
				...carouselConfig,
				transition: "slide",
				Lazyload: {
					...(typeof lazyloadConfig === "object" ? lazyloadConfig : {}),
					preload: 2,
				},
			},
		};
	}

	/**
	 * 清理 Fancybox 綁定
	 * 在頁面切換前調用
	 */
	cleanup(): void {
		if (!this.Fancybox) {
			return;
		}

		this.boundSelectors.forEach((selector) => {
			this.Fancybox.unbind(selector);
		});
		this.boundSelectors = [];
	}

	/**
	 * 完全銷燬 Fancybox
	 */
	destroy(): void {
		this.cleanup();
		this.Fancybox = null;
		this.initialized = false;
	}

	/**
	 * 獲取初始化狀態
	 */
	isInitialized(): boolean {
		return this.initialized;
	}

	/**
	 * 獲取已綁定的選擇器列表
	 */
	getBoundSelectors(): string[] {
		return [...this.boundSelectors];
	}
}

// 創建全局實例
let globalFancyboxHandler: FancyboxHandler | null = null;

/**
 * 獲取全局 Fancybox 處理器實例
 */
export function getFancyboxHandler(): FancyboxHandler {
	if (!globalFancyboxHandler) {
		globalFancyboxHandler = new FancyboxHandler();
	}
	return globalFancyboxHandler;
}

/**
 * 初始化 Fancybox（便捷函數）
 */
export async function initFancybox(): Promise<void> {
	const handler = getFancyboxHandler();
	await handler.init();
}

/**
 * 清理 Fancybox（便捷函數）
 */
export function cleanupFancybox(): void {
	if (globalFancyboxHandler) {
		globalFancyboxHandler.cleanup();
	}
}
