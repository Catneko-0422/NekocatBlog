/**
 * Swup 鉤子模塊
 * 處理頁面過渡過程中的各種鉤子事件
 */

import { pathsEqual, url } from "../../utils/url-utils";
import type { FancyboxHandler } from "../handlers/fancybox-handler";
import type { ScrollHandler } from "../handlers/scroll-handler";
import {
	ANIMATION_CONFIG,
	BANNER_HEIGHT,
	SWUP_SELECTORS,
	THEME_CONFIG,
} from "./swup-config";

// 鉤子處理器接口
export interface SwupHookHandlers {
	fancyboxHandler?: FancyboxHandler;
	scrollHandler?: ScrollHandler;
	showBanner?: () => void;
	initFancybox?: () => void;
	cleanupFancybox?: () => void;
	initCustomScrollbar?: () => void;
	checkKatex?: () => void;
}

// 訪問對象類型
interface VisitObject {
	to: {
		url: string;
	};
}

/**
 * Swup 鉤子管理器
 * 負責註冊和管理所有 Swup 頁面過渡鉤子
 */
export class SwupHooksManager {
	private bannerEnabled: boolean;
	private handlers: SwupHookHandlers;

	private cachedElements: Map<string, Element | null> = new Map();

	constructor(bannerEnabled: boolean, handlers: SwupHookHandlers = {}) {
		this.bannerEnabled = bannerEnabled;
		this.handlers = handlers;
	}

	private getCachedElement(selector: string): Element | null {
		if (!this.cachedElements.has(selector)) {
			const id = selector.startsWith("#") ? selector.slice(1) : selector;
			if (selector.startsWith("#")) {
				this.cachedElements.set(selector, document.getElementById(id));
			} else {
				this.cachedElements.set(
					selector,
					document.querySelector(selector),
				);
			}
		}
		return this.cachedElements.get(selector) ?? null;
	}

	private clearCache(): void {
		this.cachedElements.clear();
	}

	/**
	 * 註冊所有 Swup 鉤子
	 */
	registerHooks(): void {
		if (!window.swup) {
			return;
		}
		this.registerScrollTopHook();
		this.registerLinkClickHook();
		this.registerContentReplaceHook();
		this.registerVisitStartHook();
		this.registerPageViewHook();
		this.registerVisitEndHook();
		this.updatePageOverlay();
	}

	private registerScrollTopHook(): void {
		const hooks = window.swup!.hooks as {
			on: (event: string, handler: (...args: unknown[]) => void) => void;
			off: (event: string, handler: (...args: unknown[]) => void) => void;
			replace?: (
				event: string,
				handler: (
					visit: VisitObject,
					args: { options?: ScrollIntoViewOptions },
				) => boolean,
			) => void;
		};

		if (typeof hooks.replace !== "function") {
			return;
		}

		hooks.replace(
			"scroll:top",
			(visit: VisitObject, args: { options?: ScrollIntoViewOptions }) => {
				const isFullscreen = this.getCurrentWallpaperMode() === "fullscreen";
				const isHomePage = pathsEqual(visit.to.url, url("/"));
				if (isFullscreen && !isHomePage) {
					const mainGrid = this.getCachedElement("#main-grid") as HTMLElement | null;
					if (mainGrid) {
						mainGrid.scrollIntoView({
							behavior: args.options?.behavior ?? "auto",
						});
						return true;
					}
				}

				window.scrollTo({
					top: 0,
					left: 0,
					...args.options,
				});
				return true;
			},
		);
	}

	/**
	 * link:click 鉤子
	 * 處理鏈接點擊時的初始狀態
	 */
	private registerLinkClickHook(): void {
		window.swup!.hooks.on("link:click", ((...args: unknown[]) => {
			const hookArgs = args[1] as { el?: HTMLAnchorElement } | undefined;
			const href = hookArgs?.el?.getAttribute("href") || "";
			const targetPathname = (() => {
				try {
					return new URL(href, window.location.href).pathname;
				} catch {
					return href;
				}
			})();
			const isSamePage = pathsEqual(targetPathname, window.location.pathname);

			// 移除首次頁面加載的延遲
			document.documentElement.style.setProperty(
				"--content-delay",
				"0ms",
			);

			if (isSamePage) {
				document.documentElement.classList.remove("is-page-transitioning");
			} else {
				document.documentElement.classList.add("is-page-transitioning");
			}

			// 處理 navbar 隱藏
			if (this.bannerEnabled) {
				this.handleNavbarHideOnLinkClick();
			}
		}) as (...args: unknown[]) => void);
	}

	/**
	 * content:replace 鉤子
	 * 處理內容替換後的初始化
	 */
	private registerContentReplaceHook(): void {
		window.swup!.hooks.on("content:replace", () => {
			this.clearCache();
			this.syncMainContentPosition(
				pathsEqual(window.location.pathname, url("/")),
			);
			this.ensureNavbarVisibleForFullscreen();
			this.updatePageOverlay();

			// 初始化新頁面的圖片、公式、滾動條和 TOC
			this.handlers.initFancybox?.();
			this.handlers.checkKatex?.();
			this.handlers.initCustomScrollbar?.();

			// 處理 TOC 重新初始化
			this.handleTOCReinit();

			// 重新初始化 semifull 模式滾動檢測
			this.reinitSemifullScrollDetection();
		});
	}

	/**
	 * visit:start 鉤子
	 * 處理頁面訪問開始時的狀態
	 */
	private registerVisitStartHook(): void {
		window.swup!.hooks.on("visit:start", ((...args: unknown[]) => {
			const visit = args[0] as VisitObject;
			// 清理上一頁的 Fancybox
			this.handlers.cleanupFancybox?.();

			// 處理頁面狀態
			const isHomePage = pathsEqual(visit.to.url, url("/"));
			this.handleBodyClass(isHomePage);
			this.handleBannerTextVisibility(isHomePage);
			this.handleNavbarState(isHomePage);
			this.handleMobileBannerVisibility(isHomePage);
			this.syncMainContentPosition(isHomePage);
			this.ensureNavbarVisibleForFullscreen();

			// 擴展頁面高度防止滾動動畫跳躍
			this.extendPageHeight(false);

			// 隱藏 TOC
			this.hideTOC();
		}) as (...args: unknown[]) => void);
	}

	/**
	 * page:view 鉤子
	 * 處理頁面視圖顯示
	 */
	private registerPageViewHook(): void {
		window.swup!.hooks.on("page:view", () => {
			this.syncMainContentPosition(
				pathsEqual(window.location.pathname, url("/")),
			);
			this.ensureNavbarVisibleForFullscreen();
			this.updatePageOverlay();

			// 擴展頁面高度
			this.extendPageHeight(false);

			// 同步主題狀態
			this.syncThemeState();

			// 觸發頁面加載完成事件
			this.dispatchPageLoadedEvent();
		});
	}

	/**
	 * visit:end 鉤子
	 * 處理頁面訪問結束時的清理
	 */
	private registerVisitEndHook(): void {
		window.swup!.hooks.on("visit:end", (() => {
			setTimeout(() => {
				// 隱藏高度擴展元素
				this.extendPageHeight(true);

				// 顯示 TOC
				this.showTOC();
				document.documentElement.classList.remove("is-page-transitioning");
			}, ANIMATION_CONFIG.heightExtendDelay);
		}) as (...args: unknown[]) => void);
	}

	// ==================== 私有輔助方法 ====================

	/**
	 * 處理鏈接點擊時的 navbar 隱藏
	 */
	private handleNavbarHideOnLinkClick(): void {
		const navbar = this.getCachedElement(SWUP_SELECTORS.navbarWrapper);
		if (navbar) {
			const threshold = window.innerHeight * (BANNER_HEIGHT / 100) - 88;
			if (document.documentElement.scrollTop >= threshold) {
				navbar.classList.add("navbar-hidden");
			}
		}
	}

	/**
	 * 處理 TOC 重新初始化
	 */
	private handleTOCReinit(): void {
		const tocWrapper = this.getCachedElement(SWUP_SELECTORS.tocWrapper);
		const isArticlePage = tocWrapper !== null;

		if (isArticlePage) {
			const tocElement = this.getCachedElement(
				SWUP_SELECTORS.tableOfContents,
			);
			const hasDesktopTOC =
				tocElement && typeof (tocElement as any).init === "function";
			const hasMobileTOC =
				typeof (window as any).mobileTOCInit === "function";

			if (hasDesktopTOC || hasMobileTOC) {
				setTimeout(() => {
					if (hasDesktopTOC) {
						(tocElement as any).init();
					}
					if (hasMobileTOC) {
						(window as any).mobileTOCInit();
					}
				}, ANIMATION_CONFIG.tocReadyDelay);
			}
		}
	}

	/**
	 * 重新初始化 semifull 模式滾動檢測
	 */
	private reinitSemifullScrollDetection(): void {
		const navbar = this.getCachedElement(SWUP_SELECTORS.navbar);
		if (navbar) {
			const transparentMode = navbar.getAttribute(
				"data-transparent-mode",
			);
			if (transparentMode === "semifull") {
				if (
					typeof (window as any).initSemifullScrollDetection ===
					"function"
				) {
					(window as any).initSemifullScrollDetection();
				}
			}
		}
	}

	/**
	 * 處理 body class
	 */
	private handleBodyClass(_isHomePage: boolean): void {
		// body class 統一由 CSS 處理，無需區分首頁/非首頁
	}

	/**
	 * 處理 Banner 文字可見性
	 */
	private handleBannerTextVisibility(isHomePage: boolean): void {
		const bannerTextOverlay = this.getCachedElement(
			SWUP_SELECTORS.bannerTextOverlay,
		);
		if (bannerTextOverlay) {
			if (isHomePage) {
				bannerTextOverlay.classList.remove("hidden");
			} else {
				bannerTextOverlay.classList.add("hidden");
			}
		}
	}

	/**
	 * 處理 Navbar 狀態
	 */
	private handleNavbarState(isHomePage: boolean): void {
		const navbar = this.getCachedElement(SWUP_SELECTORS.navbar);
		if (navbar) {
			navbar.setAttribute("data-is-home", isHomePage.toString());

			// 重新初始化 semifull 模式滾動檢測
			const transparentMode = navbar.getAttribute(
				"data-transparent-mode",
			);
			if (transparentMode === "semifull") {
				if (
					typeof (window as any).initSemifullScrollDetection ===
					"function"
				) {
					(window as any).initSemifullScrollDetection();
				}
			}
		}
	}

	/**
	 * 處理移動端 Banner 可見性
	 */
	private handleMobileBannerVisibility(isHomePage: boolean): void {
		const mode = this.getCurrentWallpaperMode();
		if (mode !== "banner" && mode !== "fullscreen") {
			return;
		}

		const bannerWrapper = this.getCachedElement(
			SWUP_SELECTORS.bannerWrapper,
		);
		const mainContentWrapper = this.getCachedElement(
			".absolute.w-full.z-30",
		);

		if (bannerWrapper && mainContentWrapper) {
			if (isHomePage) {
				// 首頁：延遲移除隱藏類
				setTimeout(() => {
					bannerWrapper.classList.remove("mobile-hide-banner");
				}, ANIMATION_CONFIG.mobileBannerDelay);
				setTimeout(() => {
					mainContentWrapper.classList.remove(
						"mobile-main-no-banner",
					);
				}, ANIMATION_CONFIG.mobileContentDelay);
			} else {
				// 非首頁：分階段隱藏
				bannerWrapper.classList.add("mobile-hide-banner");
				setTimeout(() => {
					mainContentWrapper.classList.add("mobile-main-no-banner");
				}, ANIMATION_CONFIG.mobileBannerDelay);
			}
		}
	}

	private getCurrentWallpaperMode():
		| "banner"
		| "fullscreen"
		| "overlay"
		| "none" {
		const body = document.body;
		if (
			body.classList.contains("enable-banner") &&
			body.classList.contains("fullscreen-banner")
		) {
			return "fullscreen";
		}
		if (body.classList.contains("enable-banner")) {
			return "banner";
		}
		if (body.classList.contains("wallpaper-transparent")) {
			return "overlay";
		}
		return "none";
	}

	private syncMainContentPosition(isHomePage: boolean): void {
		const mode = this.getCurrentWallpaperMode();
		const mainContentWrapper = this.getCachedElement(
			".absolute.w-full.z-30.pointer-events-none",
		) as HTMLElement | null;
		const bannerWrapper = this.getCachedElement(
			SWUP_SELECTORS.bannerWrapper,
		) as HTMLElement | null;
		if (!mainContentWrapper) {
			return;
		}

		const isMobile = window.innerWidth < 1280;
		mainContentWrapper.classList.remove("mobile-main-no-banner", "no-banner-layout");
		mainContentWrapper.style.removeProperty("min-height");

		if (mode === "fullscreen") {
			if (isMobile && !isHomePage) {
				bannerWrapper?.classList.add("mobile-hide-banner");
				mainContentWrapper.classList.add("mobile-main-no-banner", "no-banner-layout");
				mainContentWrapper.style.position = "";
				mainContentWrapper.style.zIndex = "";
				mainContentWrapper.style.setProperty("top", "5.5rem", "important");
				mainContentWrapper.style.setProperty("margin-top", "0", "important");
				return;
			}

			bannerWrapper?.classList.remove("mobile-hide-banner");
			mainContentWrapper.classList.add("no-banner-layout");
			mainContentWrapper.style.position = "relative";
			mainContentWrapper.style.zIndex = "30";
			mainContentWrapper.style.setProperty("top", "0", "important");
			mainContentWrapper.style.setProperty(
				"margin-top",
				isMobile ? "0" : "1rem",
				"important",
			);
			return;
		}

		mainContentWrapper.style.position = "";
		mainContentWrapper.style.zIndex = "";
		mainContentWrapper.style.setProperty("margin-top", "0", "important");

		if (mode === "banner") {
			if (isMobile && !isHomePage) {
				bannerWrapper?.classList.add("mobile-hide-banner");
				mainContentWrapper.classList.add("mobile-main-no-banner");
				mainContentWrapper.style.setProperty("top", "5.5rem", "important");
				return;
			}

			if (isMobile) {
				bannerWrapper?.classList.remove("mobile-hide-banner");
				mainContentWrapper.style.removeProperty("top");
				mainContentWrapper.style.removeProperty("min-height");
				return;
			}

			bannerWrapper?.classList.remove("mobile-hide-banner");
			mainContentWrapper.style.setProperty(
				"top",
				`${BANNER_HEIGHT}vh`,
				"important",
			);
			return;
		}

		bannerWrapper?.classList.remove("mobile-hide-banner");
		mainContentWrapper.classList.add("no-banner-layout");
		mainContentWrapper.style.setProperty("top", "5.5rem", "important");
	}

	private ensureNavbarVisibleForFullscreen(): void {
		if (this.getCurrentWallpaperMode() !== "fullscreen") {
			return;
		}
		const navbarWrapper = this.getCachedElement(
			SWUP_SELECTORS.navbarWrapper,
		) as HTMLElement | null;
		if (navbarWrapper) {
			navbarWrapper.classList.remove("navbar-hidden");
		}
	}

	private updatePageOverlay(): void {
		const overlay = document.getElementById("banner-page-overlay");
		if (!overlay) {
			return;
		}

		const dataEl = document.getElementById("page-overlay-data");
		if (!dataEl) {
			this.clearOverlay(overlay);
			return;
		}

		const isHome = dataEl.dataset.isHome === "true";
		const mode = dataEl.dataset.wallpaperMode || "";
		const isBannerMode = mode === "banner" || mode === "fullscreen";

		if (isHome || !isBannerMode) {
			this.clearOverlay(overlay);
			return;
		}

		const title = dataEl.dataset.title || "";
		if (!title) {
			this.clearOverlay(overlay);
			return;
		}

		const titleEl = document.getElementById("page-overlay-title");
		const metaEl = document.getElementById("page-overlay-meta");
		const dateEl = document.getElementById("page-overlay-date");
		const categoryEl = document.getElementById("page-overlay-category");
		const wordsEl = document.getElementById("page-overlay-words");
		if (!titleEl || !metaEl || !dateEl || !categoryEl || !wordsEl) {
			return;
		}

		titleEl.textContent = title;
		titleEl.classList.remove("anim-in");

		const isPost = dataEl.dataset.isPost === "true";
		const date = dataEl.dataset.date || "";
		const category = dataEl.dataset.category || "";
		const words = dataEl.dataset.words || "";

		if (isPost && (date || category || words)) {
			dateEl.textContent = date;
			categoryEl.textContent = category;
			wordsEl.textContent = words ? `${words} 字` : "";
			metaEl.classList.remove("hidden");
			metaEl.classList.remove("anim-in");

			overlay.style.opacity = "1";
			overlay.style.transform = "";
			overlay.style.filter = "";

			void titleEl.offsetWidth;
			titleEl.classList.add("anim-in");
			void metaEl.offsetWidth;
			metaEl.classList.add("anim-in");
		} else {
			metaEl.classList.add("hidden");
			overlay.style.opacity = "1";
			overlay.style.transform = "";
			overlay.style.filter = "";
			void titleEl.offsetWidth;
			titleEl.classList.add("anim-in");
		}
	}

	private clearOverlay(overlay: HTMLElement): void {
		const titleEl = document.getElementById("page-overlay-title");
		const metaEl = document.getElementById("page-overlay-meta");
		if (titleEl) {
			titleEl.textContent = "";
			titleEl.classList.remove("anim-in");
		}
		if (metaEl) {
			metaEl.classList.add("hidden");
			metaEl.classList.remove("anim-in");
		}
		overlay.style.opacity = "";
		overlay.style.transform = "";
		overlay.style.filter = "";
	}

	/**
	 * 擴展/隱藏頁面高度
	 */
	private extendPageHeight(hide: boolean): void {
		const heightExtend = this.getCachedElement(
			SWUP_SELECTORS.pageHeightExtend,
		);
		if (!heightExtend) {
			return;
		}

		// 只在 Banner 模式下啓用高度擴展
		// fullscreen/none 模式內容往往不足一屏，如果強行擴展高度，
		// 會導致滾動條在頁面過渡期間閃現，引發佈局左右抖動
		const isBannerMode = document.body.classList.contains("enable-banner");
		if (!isBannerMode) {
			return;
		}

		if (hide) {
			heightExtend.classList.add("hidden");
		} else {
			heightExtend.classList.remove("hidden");
		}
	}

	/**
	 * 隱藏 TOC
	 */
	private hideTOC(): void {
		const toc = this.getCachedElement(SWUP_SELECTORS.tocWrapper);
		if (toc) {
			toc.classList.add("toc-not-ready");
		}
	}

	/**
	 * 顯示 TOC
	 */
	private showTOC(): void {
		const toc = this.getCachedElement(SWUP_SELECTORS.tocWrapper);
		if (toc) {
			toc.classList.remove("toc-not-ready");
		}
	}

	/**
	 * 同步主題狀態
	 * 解決從首頁進入文章頁面時代碼塊渲染問題
	 */
	private syncThemeState(): void {
		const storedTheme =
			localStorage.getItem(THEME_CONFIG.themeStorageKey) ||
			THEME_CONFIG.lightMode;
		const isDark = storedTheme === THEME_CONFIG.darkMode;
		const expectedTheme = isDark
			? THEME_CONFIG.darkExpressiveTheme
			: THEME_CONFIG.lightExpressiveTheme;

		const currentTheme =
			document.documentElement.getAttribute("data-theme");
		const hasDarkClass =
			document.documentElement.classList.contains("dark");

		// 如果主題不匹配，使用批量更新減少重繪
		if (currentTheme !== expectedTheme || hasDarkClass !== isDark) {
			requestAnimationFrame(() => {
				// 同步 data-theme 屬性
				if (currentTheme !== expectedTheme) {
					document.documentElement.setAttribute(
						"data-theme",
						expectedTheme,
					);
				}
				// 同步 dark class
				if (hasDarkClass !== isDark) {
					if (isDark) {
						document.documentElement.classList.add("dark");
					} else {
						document.documentElement.classList.remove("dark");
					}
				}
			});
		}
	}

	/**
	 * 觸發頁面加載完成事件
	 * 用於初始化評論系統
	 */
	private dispatchPageLoadedEvent(): void {
		setTimeout(() => {
			if (
				document.getElementById("tcomment") ||
				document.getElementById("giscus-container")
			) {
				const pageLoadedEvent = new CustomEvent("mizuki:page:loaded", {
					detail: {
						path: window.location.pathname,
						timestamp: Date.now(),
					},
				});
				document.dispatchEvent(pageLoadedEvent);
				console.log(
					"Layout: 觸發 mizuki:page:loaded 事件，路徑:",
					window.location.pathname,
				);
			}
		}, ANIMATION_CONFIG.commentInitDelay);
	}

	/**
	 * 更新處理器
	 */
	updateHandlers(handlers: Partial<SwupHookHandlers>): void {
		this.handlers = { ...this.handlers, ...handlers };
	}
}
