/**
 * 動畫工具類 - 參考 yukina 主題的動畫系統
 * 提供頁面切換和組件動畫的統一管理
 */

export interface AnimationConfig {
	duration?: number;
	delay?: number;
	easing?: string;
	direction?: "up" | "down" | "left" | "right";
}

export class AnimationManager {
	private static instance: AnimationManager;
	private isAnimating = false;
	private animationQueue: (() => void)[] = [];

	static getInstance(): AnimationManager {
		if (!AnimationManager.instance) {
			AnimationManager.instance = new AnimationManager();
		}
		return AnimationManager.instance;
	}

	/**
	 * 初始化動畫系統
	 */
	init(): void {
		this.setupSwupIntegration();
		this.setupScrollAnimations();
		console.log("🎨 Animation Manager initialized");
	}

	/**
	 * 設置 Swup 集成
	 */
	private setupSwupIntegration(): void {
		if (typeof window !== "undefined" && window.swup) {
			const swup = window.swup;

			// 頁面離開動畫
			swup.hooks.on("animation:out:start", () => {
				this.triggerPageLeaveAnimation();
			});

			// 頁面進入動畫
			swup.hooks.on("animation:in:start", () => {
				this.triggerPageEnterAnimation();
			});

			// 內容替換後重新初始化動畫
			swup.hooks.on("content:replace", () => {
				setTimeout(() => {
					this.initializePageAnimations();
				}, 50);
			});
		}
	}

	/**
	 * 觸發頁面離開動畫
	 */
	private triggerPageLeaveAnimation(): void {
		this.isAnimating = true;
		document.documentElement.classList.add("is-leaving");

		// 移動端優化：減少動畫延遲，避免閃爍
		const isMobile = window.innerWidth <= 768;
		const delay = isMobile ? 10 : 30;

		// 添加離開動畫類到主要元素
		const mainElements = document.querySelectorAll(".transition-leaving");
		mainElements.forEach((element, index) => {
			setTimeout(() => {
				element.classList.add("animate-leave");
			}, index * delay);
		});
	}

	/**
	 * 觸發頁面進入動畫
	 */
	private triggerPageEnterAnimation(): void {
		document.documentElement.classList.remove("is-leaving");
		document.documentElement.classList.add("is-entering");

		// 移除離開動畫類
		const elements = document.querySelectorAll(".animate-leave");
		elements.forEach((element) => {
			element.classList.remove("animate-leave");
		});

		setTimeout(() => {
			document.documentElement.classList.remove("is-entering");
			this.isAnimating = false;
			this.processAnimationQueue();
		}, 300);
	}

	/**
	 * 初始化頁面動畫
	 */
	private initializePageAnimations(): void {
		// 重新應用加載動畫
		const animatedElements = document.querySelectorAll(".onload-animation");
		animatedElements.forEach((element, index) => {
			const htmlElement = element as HTMLElement;
			const delay =
				Number.parseInt(htmlElement.style.animationDelay, 10) || index * 50;

			// 重置動畫
			htmlElement.style.opacity = "0";
			htmlElement.style.transform = "translateY(1.5rem)";

			setTimeout(() => {
				htmlElement.style.transition =
					"opacity 320ms cubic-bezier(0.4, 0, 0.2, 1), transform 320ms cubic-bezier(0.4, 0, 0.2, 1)";
				htmlElement.style.opacity = "1";
				htmlElement.style.transform = "translateY(0)";
			}, delay);
		});

		// 重新初始化側邊欄組件
		this.initializeSidebarComponents();
	}

	/**
	 * 初始化側邊欄組件
	 */
	private initializeSidebarComponents(): void {
		// 查找頁面中的側邊欄元素
		const sidebar = document.getElementById("sidebar");
		if (sidebar) {
			// 觸發自定義事件，通知側邊欄重新初始化
			const event = new CustomEvent("sidebar:init");
			sidebar.dispatchEvent(event);
		}

		// 觸發全局事件，通知所有組件重新初始化
		const globalEvent = new CustomEvent("page:reinit");
		document.dispatchEvent(globalEvent);
	}

	/**
	 * 設置滾動動畫
	 */
	private setupScrollAnimations(): void {
		if (typeof window === "undefined") {
			return;
		}

		const observerOptions = {
			root: null,
			rootMargin: "0px 0px -100px 0px",
			threshold: 0.1,
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("in-view");
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);

		// 觀察所有需要滾動動畫的元素
		const scrollElements = document.querySelectorAll(".animate-on-scroll");
		scrollElements.forEach((element) => {
			observer.observe(element);
		});
	}

	/**
	 * 添加動畫到隊列
	 */
	queueAnimation(callback: () => void): void {
		if (this.isAnimating) {
			this.animationQueue.push(callback);
		} else {
			callback();
		}
	}

	/**
	 * 處理動畫隊列
	 */
	private processAnimationQueue(): void {
		while (this.animationQueue.length > 0) {
			const callback = this.animationQueue.shift();
			if (callback) {
				callback();
			}
		}
	}

	/**
	 * 創建自定義動畫
	 */
	createAnimation(element: HTMLElement, config: AnimationConfig): void {
		const {
			duration = 300,
			delay = 0,
			easing = "cubic-bezier(0.4, 0, 0.2, 1)",
			direction = "up",
		} = config;

		const transforms = {
			up: "translateY(1.5rem)",
			down: "translateY(-1.5rem)",
			left: "translateX(1.5rem)",
			right: "translateX(-1.5rem)",
		};

		// 設置初始狀態
		element.style.opacity = "0";
		element.style.transform = transforms[direction];
		element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;

		setTimeout(() => {
			element.style.opacity = "1";
			element.style.transform = "translate(0)";
		}, delay);
	}

	// batchAnimate is deprecated, use staggerAnimations instead
	// batchAnimate(
	// 	elements: NodeListOf<Element> | Element[],
	// 	config: AnimationConfig & { stagger?: number } = {},
	// ): void {
	// 	const { stagger = 50, ...animationConfig } = config;
	//
	// 	elements.forEach((element, index) => {
	// 		this.createAnimation(element as HTMLElement, {
	// 			...animationConfig,
	// 			delay: (animationConfig.delay || 0) + index * stagger,
	// 		});
	// 	});
	// }

	/**
	 * 批量動畫
	 */
	staggerAnimations(
		elements: NodeListOf<Element> | HTMLElement[],
		config: AnimationConfig & { stagger?: number } = {},
	): void {
		const { stagger = 50, ...animationConfig } = config;

		elements.forEach((element: Element | HTMLElement, index: number) => {
			this.createAnimation(element as HTMLElement, {
				...animationConfig,
				delay: (animationConfig.delay || 0) + index * stagger,
			});
		});
	}

	/**
	 * 檢查是否正在動畫
	 */
	isCurrentlyAnimating(): boolean {
		return this.isAnimating;
	}
}

// 導出單例實例
export const animationManager = AnimationManager.getInstance();

// 自動初始化
if (typeof window !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			animationManager.init();
		});
	} else {
		animationManager.init();
	}
}
