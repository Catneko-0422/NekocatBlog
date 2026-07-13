/**
 * 滾動處理器
 * 管理頁面滾動相關的功能，包括自定義滾動條和滾動監聽
 */

/**
 * 滾動處理器類
 * 負責自定義滾動條初始化和滾動事件管理
 */
export class ScrollHandler {
	private katexScrollbarStyleAdded = false;

	/**
	 * 初始化自定義滾動條
	 * 爲 KaTeX 公式添加水平滾動支持
	 */
	initCustomScrollbar(): void {
		const katexElements = document.querySelectorAll(
			".katex-display:not([data-scrollbar-initialized])",
		) as NodeListOf<HTMLElement>;

		katexElements.forEach((element) => {
			if (!element.parentNode) {
				return;
			}

			const container = document.createElement("div");
			container.className = "katex-display-container";
			element.parentNode.insertBefore(container, element);
			container.appendChild(element);

			// 使用 CSS 滾動條
			container.style.cssText = `
				overflow-x: auto;
				scrollbar-width: thin;
				scrollbar-color: rgba(0,0,0,0.3) transparent;
			`;

			// 添加 webkit 自定義滾動條樣式（只添加一次）
			this.addKatexScrollbarStyle();

			element.setAttribute("data-scrollbar-initialized", "true");
		});
	}

	/**
	 * 添加 KaTeX 滾動條樣式（只添加一次）
	 */
	private addKatexScrollbarStyle(): void {
		if (this.katexScrollbarStyleAdded) {
			return;
		}

		const style = document.createElement("style");
		style.textContent = `
			.katex-display-container::-webkit-scrollbar {
				height: 6px;
			}
			.katex-display-container::-webkit-scrollbar-track {
				background: transparent;
			}
			.katex-display-container::-webkit-scrollbar-thumb {
				background: rgba(0,0,0,0.3);
				border-radius: 3px;
			}
			.katex-display-container::-webkit-scrollbar-thumb:hover {
				background: rgba(0,0,0,0.5);
			}
		`;

		if (!document.head.querySelector("style[data-katex-scrollbar]")) {
			style.setAttribute("data-katex-scrollbar", "true");
			document.head.appendChild(style);
			this.katexScrollbarStyleAdded = true;
		}
	}

	/**
	 * 檢查並加載 KaTeX 樣式
	 */
	checkKatex(): void {
		if (document.querySelector(".katex")) {
			import("katex/dist/katex.css");
		}
	}

	/**
	 * 節流函數
	 * 限制函數調用頻率
	 */
	static throttle<T extends (...args: any[]) => any>(
		func: T,
		limit: number,
	): (...args: Parameters<T>) => void {
		let inThrottle = false;
		return function (this: any, ...args: Parameters<T>) {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		};
	}
}

// 創建全局實例
let globalScrollHandler: ScrollHandler | null = null;

/**
 * 獲取全局滾動處理器實例
 */
export function getScrollHandler(): ScrollHandler {
	if (!globalScrollHandler) {
		globalScrollHandler = new ScrollHandler();
	}
	return globalScrollHandler;
}

/**
 * 初始化自定義滾動條（便捷函數）
 */
export function initCustomScrollbar(): void {
	const handler = getScrollHandler();
	handler.initCustomScrollbar();
}

/**
 * 檢查 KaTeX（便捷函數）
 */
export function checkKatex(): void {
	const handler = getScrollHandler();
	handler.checkKatex();
}
