/**
 * 返回頂部處理器
 * 管理返回頂部按鈕和滾動監聽
 */

import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_HOME,
	SCROLL_CONFIG,
	SWUP_SELECTORS,
} from "../core/swup-config";
import { ScrollHandler } from "./scroll-handler";

/**
 * 返回頂部處理器類
 * 負責返回頂部按鈕的顯示/隱藏和滾動位置監聽
 */
export class BackToTopHandler {
	private backToTopBtn: HTMLElement | null = null;
	private toc: HTMLElement | null = null;
	private navbar: HTMLElement | null = null;
	private bannerEnabled: boolean;
	private scrollHandler: () => void;
	private resizeHandler: () => void;
	private rafId: number | null = null;
	private isInitialized = false;
	private backToTopVisible = false;

	constructor(bannerEnabled: boolean) {
		this.bannerEnabled = bannerEnabled;
		this.scrollHandler = ScrollHandler.throttle(
			this.handleScroll.bind(this),
			SCROLL_CONFIG.throttleInterval,
		);
		this.resizeHandler = this.handleResize.bind(this);
	}

	/**
	 * 初始化返回頂部處理器
	 */
	init(): void {
		this.cacheElements();

		if (this.isInitialized) {
			this.handleResize();
			this.handleScroll();
			return;
		}

		this.bindEvents();
		this.isInitialized = true;
		this.handleResize();
		this.handleScroll();
	}

	/**
	 * 緩存 DOM 元素
	 */
	private cacheElements(): void {
		this.backToTopBtn = document.getElementById(
			SWUP_SELECTORS.backToTopBtn.slice(1),
		);
		this.toc = document.getElementById(SWUP_SELECTORS.tocWrapper.slice(1));
		this.navbar = document.getElementById(
			SWUP_SELECTORS.navbarWrapper.slice(1),
		);
		this.backToTopVisible = Boolean(
			this.backToTopBtn && !this.backToTopBtn.classList.contains("hide"),
		);
	}

	/**
	 * 綁定事件監聽
	 */
	private bindEvents(): void {
		// 使用 passive 事件監聽器提升滾動性能
		window.addEventListener("scroll", this.scrollHandler, {
			passive: true,
		});
		window.addEventListener("resize", this.resizeHandler, {
			passive: true,
		});
	}

	/**
	 * 處理滾動事件
	 */
	private handleScroll(): void {
		const scrollTop = document.documentElement.scrollTop;
		const bannerHeight = window.innerHeight * (BANNER_HEIGHT / 100);

		// 計算返回頂部按鈕顯示閾值
		const showBackToTopThreshold = this.calculateShowThreshold(scrollTop);

		// 批量處理 DOM 操作
		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
		}

		this.rafId = requestAnimationFrame(() => {
			this.updateBackToTopButton(scrollTop, showBackToTopThreshold);
			this.updateTOCVisibility(scrollTop, bannerHeight);
			this.updateNavbarVisibility(scrollTop);
			this.updatePageOverlayScroll(scrollTop);
			this.rafId = null;
		});
	}

	/**
	 * 計算返回頂部按鈕顯示閾值
	 */
	private calculateShowThreshold(scrollTop: number): number {
		const contentWrapper = document.getElementById(
			SWUP_SELECTORS.contentWrapper.slice(1),
		);
		let threshold =
			window.innerHeight * (BANNER_HEIGHT / 100) +
			SCROLL_CONFIG.backToTopOffset;

		if (contentWrapper) {
			const rect = contentWrapper.getBoundingClientRect();
			const absoluteTop = rect.top + scrollTop;
			threshold = absoluteTop + window.innerHeight / 4;
		}

		return threshold;
	}

	/**
	 * 更新返回頂部按鈕可見性
	 */
	private updateBackToTopButton(scrollTop: number, threshold: number): void {
		if (!this.backToTopBtn) {
			return;
		}

		const shouldBeVisible = scrollTop > threshold;
		if (shouldBeVisible === this.backToTopVisible) {
			return;
		}

		this.backToTopVisible = shouldBeVisible;
		this.backToTopBtn.classList.toggle("hide", !shouldBeVisible);
	}

	/**
	 * 更新 TOC 可見性
	 */
	private updateTOCVisibility(scrollTop: number, bannerHeight: number): void {
		if (!this.bannerEnabled || !this.toc) {
			return;
		}

		const isBannerMode = document.body.classList.contains("enable-banner");

		if (isBannerMode) {
			if (scrollTop > bannerHeight) {
				this.toc.classList.remove("toc-hide");
			} else {
				this.toc.classList.add("toc-hide");
			}
		} else {
			// Fullscreen 或 None 模式下始終顯示 TOC
			this.toc.classList.remove("toc-hide");
		}
	}

	/**
	 * 更新 Navbar 可見性
	 */
	private updateNavbarVisibility(scrollTop: number): void {
		if (!this.bannerEnabled || !this.navbar) {
			return;
		}

		if (document.body.classList.contains("fullscreen-banner")) {
			this.navbar.classList.remove("navbar-hidden");
			return;
		}

		const currentBannerHeight = BANNER_HEIGHT_HOME;

		const threshold =
			window.innerHeight * (currentBannerHeight / 100) -
			SCROLL_CONFIG.navbarHideOffset;

		if (scrollTop >= threshold) {
			this.navbar.classList.add("navbar-hidden");
		} else {
			this.navbar.classList.remove("navbar-hidden");
		}
	}

	private updatePageOverlayScroll(scrollTop: number): void {
		const overlay = document.getElementById("banner-page-overlay");
		if (!overlay || !overlay.style.opacity) {
			return;
		}

		const isFullscreen = document.body.classList.contains(
			"fullscreen-banner",
		);
		const bannerHeight = isFullscreen
			? window.innerHeight
			: window.innerHeight * (BANNER_HEIGHT_HOME / 100);
		const progress = Math.min(scrollTop / bannerHeight, 1);

		overlay.style.opacity = String(1 - progress);
		overlay.style.transform = `translateY(${-progress * 30}px) scale(${1 - progress * 0.05})`;
	}

	/**
	 * 處理窗口大小變化
	 */
	private handleResize(): void {
		// 計算 --banner-height-extend
		// 需要是 4 的倍數以避免模糊文本
		let offset = Math.floor(
			window.innerHeight * (30 / 100), // BANNER_HEIGHT_EXTEND
		);
		offset = offset - (offset % 4);
		document.documentElement.style.setProperty(
			"--banner-height-extend",
			`${offset}px`,
		);
	}

	/**
	 * 銷燬處理器
	 */
	destroy(): void {
		if (this.isInitialized) {
			window.removeEventListener("scroll", this.scrollHandler);
			window.removeEventListener("resize", this.resizeHandler);
		}

		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}

		this.backToTopBtn = null;
		this.toc = null;
		this.navbar = null;
		this.isInitialized = false;
		this.backToTopVisible = false;
	}

	/**
	 * 更新 Banner 啓用狀態
	 */
	setBannerEnabled(enabled: boolean): void {
		this.bannerEnabled = enabled;
	}
}

// 創建全局實例
let globalBackToTopHandler: BackToTopHandler | null = null;

/**
 * 獲取全局返回頂部處理器實例
 */
export function getBackToTopHandler(bannerEnabled: boolean): BackToTopHandler {
	if (!globalBackToTopHandler) {
		globalBackToTopHandler = new BackToTopHandler(bannerEnabled);
	}
	return globalBackToTopHandler;
}

/**
 * 初始化返回頂部處理器（便捷函數）
 */
export function initBackToTopHandler(bannerEnabled: boolean): void {
	const handler = getBackToTopHandler(bannerEnabled);
	handler.init();
}
