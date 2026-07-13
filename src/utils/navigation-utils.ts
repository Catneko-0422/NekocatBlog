/**
 * 導航工具函數
 * 提供統一的頁面導航功能，支持 Swup 無刷新跳轉
 */

/**
 * 導航到指定頁面
 * @param url 目標頁面URL
 * @param options 導航選項
 */
export function navigateToPage(
	url: string,
	options?: {
		replace?: boolean;
		force?: boolean;
	},
): void {
	// 檢查 URL 是否有效
	if (!url || typeof url !== "string") {
		console.warn("navigateToPage: Invalid URL provided");
		return;
	}

	// 如果是外部鏈接，直接跳轉
	if (
		url.startsWith("http://") ||
		url.startsWith("https://") ||
		url.startsWith("//")
	) {
		window.open(url, "_blank");
		return;
	}

	// 如果是錨點鏈接，滾動到對應位置
	if (url.startsWith("#")) {
		const element = document.getElementById(url.slice(1));
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		return;
	}

	// 檢查 Swup 是否可用
	if (typeof window !== "undefined" && window.swup) {
		try {
			// 使用 Swup 進行無刷新跳轉
			if (options?.replace) {
				window.swup.navigate(url, { history: false });
			} else {
				window.swup.navigate(url);
			}
		} catch (error) {
			console.error("Swup navigation failed:", error);
			// 降級到普通跳轉
			fallbackNavigation(url, options);
		}
	} else {
		// Swup 不可用時的降級處理
		fallbackNavigation(url, options);
	}
}

/**
 * 降級導航函數
 * 當 Swup 不可用時使用普通的頁面跳轉
 */
function fallbackNavigation(
	url: string,
	options?: {
		replace?: boolean;
		force?: boolean;
	},
): void {
	if (options?.replace) {
		window.location.replace(url);
	} else {
		window.location.href = url;
	}
}

/**
 * 檢查 Swup 是否已準備就緒
 */
export function isSwupReady(): boolean {
	return typeof window !== "undefined" && !!window.swup;
}

/**
 * 等待 Swup 準備就緒
 * @param timeout 超時時間（毫秒）
 */
export function waitForSwup(timeout = 5000): Promise<boolean> {
	return new Promise((resolve) => {
		if (isSwupReady()) {
			resolve(true);
			return;
		}

		let timeoutId: ReturnType<typeof setTimeout>;

		const checkSwup = () => {
			if (isSwupReady()) {
				clearTimeout(timeoutId);
				document.removeEventListener("swup:enable", checkSwup);
				resolve(true);
			}
		};

		// 監聽 Swup 啓用事件
		document.addEventListener("swup:enable", checkSwup);

		// 設置超時
		timeoutId = setTimeout(() => {
			document.removeEventListener("swup:enable", checkSwup);
			resolve(false);
		}, timeout);
	});
}

/**
 * 預加載頁面
 * @param url 要預加載的頁面URL
 */
export function preloadPage(url: string): void {
	if (!url || typeof url !== "string") {
		return;
	}

	// 如果 Swup 可用，使用其預加載功能
	if (isSwupReady() && window.swup?.preload) {
		try {
			window.swup.preload(url);
		} catch (error) {
			console.warn("Failed to preload page:", error);
		}
	}
}

/**
 * 檢查是否爲同源鏈接
 */
function isSameOrigin(url: string): boolean {
	try {
		const parsed = new URL(url, window.location.origin);
		return parsed.origin === window.location.origin;
	} catch {
		return false;
	}
}

/**
 * 檢查網絡狀態是否爲慢速連接
 */
function isSlowConnection(): boolean {
	const conn = (
		navigator as unknown as { connection?: { effectiveType: string } }
	).connection;
	if (!conn) {
		return false;
	}
	return conn.effectiveType === "2g" || conn.effectiveType === "slow-2g";
}

/**
 * 初始化鏈接預加載功能
 * 使用 IntersectionObserver 觀察視口內的鏈接，在進入視野時預加載
 */
export function initLinkPreloading(): void {
	// 如果 Swup 不可用或用戶偏好減少動畫，不進行預加載
	if (!isSwupReady() || isSlowConnection()) {
		return;
	}

	// 檢查用戶是否偏好減少動畫
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		return;
	}

	// 已預加載的 URL 集合，避免重複預加載
	const preloadedUrls = new Set<string>();

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const link = entry.target as HTMLAnchorElement;
					const href = link.href;

					// 檢查是否有效、是否同源、是否已預加載、是否當前頁面
					if (
						href &&
						isSameOrigin(href) &&
						!preloadedUrls.has(href) &&
						href !== window.location.href &&
						!href.includes("#")
					) {
						preloadedUrls.add(href);

						// 使用 requestIdleCallback 在空閒時預加載
						if ("requestIdleCallback" in window) {
							requestIdleCallback(() => preloadPage(href), {
								timeout: 2000,
							});
						} else {
							setTimeout(() => preloadPage(href), 100);
						}
					}
				}
			});
		},
		{
			rootMargin: "200px",
		},
	);

	// 觀察所有內部鏈接
	const observeLinks = () => {
		document
			.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]')
			.forEach((link) => {
				observer.observe(link);
			});
	};

	// 初始觀察
	observeLinks();

	// 頁面切換後重新觀察（Swup 會替換 main 容器內容）
	const mainContainer = document.querySelector("main");
	if (mainContainer) {
		const mutationObserver = new MutationObserver(() => {
			observeLinks();
		});
		mutationObserver.observe(mainContainer, {
			childList: true,
			subtree: true,
		});
	}
}

/**
 * 獲取當前頁面路徑
 */
export function getCurrentPath(): string {
	return typeof window !== "undefined" ? window.location.pathname : "";
}

/**
 * 檢查是否爲首頁
 */
export function isHomePage(): boolean {
	const path = getCurrentPath();
	return path === "/" || path === "";
}

/**
 * 檢查是否爲文章頁面
 */
export function isPostPage(): boolean {
	const path = getCurrentPath();
	return path.startsWith("/posts/");
}

/**
 * 檢查兩個路徑是否相等
 */
export function pathsEqual(path1: string, path2: string): boolean {
	// 標準化路徑（移除末尾斜槓）
	const normalize = (path: string) => {
		return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
	};

	return normalize(path1) === normalize(path2);
}
