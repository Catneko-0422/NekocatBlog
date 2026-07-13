/**
 * 主題切換綜合性能優化器
 *
 * 整合功能：
 * 1. 代碼塊主題切換優化（Intersection Observer + 分批更新）
 * 2. 重型元素優化（臨時禁用動畫、隱藏屏幕外元素、GPU 加速）
 *
 * 核心優化策略：
 * - 只更新可見代碼塊，延遲屏幕外代碼塊
 * - 主題切換期間臨時禁用重型元素動畫和過渡
 * - 強制 GPU 合成層，減少重繪重排
 * - 使用 content-visibility 隱藏屏幕外元素
 */

class ThemeOptimizer {
	constructor() {
		// 代碼塊優化相關
		this.visibleBlocks = new Set();
		this.pendingThemeUpdate = null;
		this.codeBlockObserver = null;

		// 從配置中獲取是否在主題切換時隱藏代碼塊的設置
		this.hideCodeBlocksDuringTransition = true; // 默認值爲true
		this.initFromConfig();

		// 性能優化相關
		this.isOptimizing = false;
		this.heavySelectors = [
			".float-panel",
			"#navbar",
			".music-player",
			"#mobile-toc-panel",
			"#nav-menu-panel",
			"#search-panel",
			".dropdown-content",
			".widget",
			".post-card",
			".custom-md",
		];

		this.init();
	}

	init() {
		// 從配置中初始化
		this.initFromConfig();

		// 初始化代碼塊優化
		this.initCodeBlockOptimization();

		// 初始化主題切換攔截
		this.interceptThemeSwitch();

		// 應用代碼塊過渡行爲設置
		this.applyCodeBlockTransitionBehavior();

		// 設置 Swup 鉤子以確保在頁面切換時重新初始化
		this.setupSwupHooks();

		// 通知其他組件主題優化器已準備就緒
		document.dispatchEvent(new CustomEvent("themeOptimizerReady"));
	}

	// ==================== Swup 鉤子設置 ====================

	setupSwupHooks() {
		// 設置 Swup 鉤子的函數
		const setupHooks = () => {
			if (window.swup) {
				// 監聽 page:view 事件
				window.swup.hooks.on("page:view", () => {
					// 頁面切換後重新初始化代碼塊優化
					setTimeout(() => {
						this.observeCodeBlocks();
						this.applyCodeBlockTransitionBehavior();
						// 確保主題切換樣式正確應用
						this.forceApplyThemeTransitionStyles();
					}, 100);
				});

				// 監聽 content:replace 事件（更早觸發）
				window.swup.hooks.on("content:replace", () => {
					// 內容替換時也重新應用代碼塊過渡行爲
					setTimeout(() => {
						this.applyCodeBlockTransitionBehavior();
						// 確保主題切換樣式正確應用
						this.forceApplyThemeTransitionStyles();
					}, 50);
				});

				return true;
			}
			return false;
		};

		// 嘗試立即設置 Swup 鉤子
		if (!setupHooks()) {
			// 如果 Swup 尚未初始化，等待它加載
			document.addEventListener("swup:enable", () => {
				setupHooks();
			});

			// 額外的延遲重試機制，確保捕獲到 Swup
			const retryInterval = setInterval(() => {
				if (setupHooks()) {
					clearInterval(retryInterval);
				}
			}, 100);

			// 最多重試 20 次（2 秒）
			setTimeout(() => {
				clearInterval(retryInterval);
			}, 2000);
		}
	}

	forceApplyThemeTransitionStyles() {
		// 強制應用主題切換樣式，確保在頁面切換後也能正確工作
		const codeBlocks = document.querySelectorAll(".expressive-code");

		codeBlocks.forEach((block) => {
			// 確保代碼塊有正確的類
			if (this.hideCodeBlocksDuringTransition) {
				block.classList.add("hide-during-transition");
			} else {
				block.classList.remove("hide-during-transition");
			}

			// 強制重新計算樣式
			void block.offsetWidth;
		});

		// 檢查當前是否處於主題切換狀態
		const isTransitioning = document.documentElement.classList.contains(
			"is-theme-transitioning",
		);

		if (isTransitioning) {
			// 如果正在切換主題，確保樣式立即應用
			codeBlocks.forEach((block) => {
				if (block.classList.contains("hide-during-transition")) {
					block.style.setProperty(
						"content-visibility",
						"hidden",
						"important",
					);
					block.style.setProperty("opacity", "0.99", "important");
				}
			});
		} else {
			// 如果不在切換狀態，確保樣式恢復正常
			codeBlocks.forEach((block) => {
				block.style.removeProperty("content-visibility");
				block.style.removeProperty("opacity");
			});
		}
	}

	// ==================== 配置初始化 ====================

	initFromConfig() {
		try {
			// 嘗試從配置中獲取設置
			// 檢查是否已經有從配置中傳遞的設置
			const configCarrier = document.getElementById("config-carrier");
			if (
				configCarrier &&
				configCarrier.dataset.hideCodeBlocksDuringTransition !==
					undefined
			) {
				this.hideCodeBlocksDuringTransition =
					configCarrier.dataset.hideCodeBlocksDuringTransition ===
					"true";
			}
		} catch (error) {
			this.hideCodeBlocksDuringTransition = true; // 默認啓用隱藏
		}
	}

	applyCodeBlockTransitionBehavior() {
		// 應用代碼塊在主題切換期間的行爲設置
		const codeBlocks = document.querySelectorAll(".expressive-code");

		codeBlocks.forEach((block) => {
			if (this.hideCodeBlocksDuringTransition) {
				// 默認行爲：添加類以便在主題切換時隱藏
				block.classList.add("hide-during-transition");
			} else {
				// 如果配置爲不隱藏，移除類
				block.classList.remove("hide-during-transition");
			}
		});

		// 確保臨時樣式表中的規則與當前設置一致
		this.updateTempStyleSheet();
	}

	updateTempStyleSheet() {
		// 如果臨時樣式表存在，更新其內容以反映當前設置
		if (this.tempStyleSheet) {
			// 獲取當前內容
			let content = this.tempStyleSheet.textContent;

			// 更新代碼塊隱藏規則
			const hideRule = `.is-theme-transitioning .expressive-code {
        content-visibility: hidden !important;
        /* 避免閃爍 */
        opacity: 0.99;
      }`;

			const showRule = `.is-theme-transitioning .expressive-code:not(.hide-during-transition) {
        /* 保持代碼塊可見，但禁用過渡效果 */
        content-visibility: visible !important;
        opacity: 1 !important;
      }`;

			// 檢查是否已存在這些規則，如果不存在則添加
			if (!content.includes(".is-theme-transitioning .expressive-code")) {
				content += "\n" + hideRule + "\n" + showRule;
				this.tempStyleSheet.textContent = content;
			}
		}
	}

	// ==================== 代碼塊優化 ====================

	initCodeBlockOptimization() {
		// 創建 Intersection Observer 追蹤可見代碼塊
		this.codeBlockObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						this.visibleBlocks.add(entry.target);
						// 如果有待處理的主題更新，立即應用
						if (this.pendingThemeUpdate) {
							this.applyThemeToBlock(
								entry.target,
								this.pendingThemeUpdate,
							);
						}
					} else {
						this.visibleBlocks.delete(entry.target);
					}
				});
			},
			{
				rootMargin: "50px 0px",
				threshold: 0.01,
			},
		);

		// 觀察所有代碼塊
		this.observeCodeBlocks();

		// 監聽主題變化
		this.setupThemeListener();

		// 頁面變化時重新觀察
		if (window.swup) {
			window.swup.hooks.on("page:view", () => {
				setTimeout(() => this.observeCodeBlocks(), 100);
			});
		}
	}

	observeCodeBlocks() {
		this.visibleBlocks.clear();

		requestAnimationFrame(() => {
			const codeBlocks = document.querySelectorAll(".expressive-code");
			codeBlocks.forEach((block) => {
				this.codeBlockObserver.observe(block);

				// 根據配置設置代碼塊在主題切換時的行爲
				if (this.hideCodeBlocksDuringTransition) {
					block.classList.add("hide-during-transition");
				} else {
					block.classList.remove("hide-during-transition");
				}
			});
		});
	}

	setupThemeListener() {
		// 監聽 data-theme 屬性變化
		const themeObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "data-theme"
				) {
					const newTheme =
						document.documentElement.getAttribute("data-theme");
					this.handleThemeChange(newTheme);
					break;
				}
			}
		});

		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});
	}

	handleThemeChange(newTheme) {
		this.pendingThemeUpdate = newTheme;

		const visibleBlocksArray = Array.from(this.visibleBlocks);

		if (visibleBlocksArray.length === 0) {
			return;
		}

		// 分批更新可見代碼塊
		this.batchUpdateBlocks(visibleBlocksArray, newTheme);
	}

	batchUpdateBlocks(blocks, theme) {
		const batchSize = 3;
		let currentIndex = 0;

		const processBatch = () => {
			const batch = blocks.slice(currentIndex, currentIndex + batchSize);

			requestAnimationFrame(() => {
				batch.forEach((block) => {
					this.applyThemeToBlock(block, theme);
				});

				currentIndex += batchSize;

				if (currentIndex < blocks.length) {
					setTimeout(processBatch, 0);
				}
			});
		};

		processBatch();
	}

	applyThemeToBlock(block, theme) {
		// 標記該代碼塊已更新
		block.dataset.themeUpdated = theme;
	}

	// ==================== 重型元素優化 ====================

	interceptThemeSwitch() {
		// 監聽 class 變化來攔截主題切換
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "class" &&
					mutation.target === document.documentElement
				) {
					const classList = document.documentElement.classList;
					const isTransitioning = classList.contains(
						"is-theme-transitioning",
					);
					const useViewTransition = classList.contains(
						"use-view-transition",
					);

					if (isTransitioning && !this.isOptimizing) {
						this.optimizeThemeSwitch(useViewTransition);
					} else if (!isTransitioning && this.isOptimizing) {
						this.restoreAfterThemeSwitch(useViewTransition);
					}
				}
			}
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});
	}

	optimizeThemeSwitch(useViewTransition = false) {
		this.isOptimizing = true;
		this.useViewTransition = useViewTransition;

		// 如果使用 View Transitions，不需要額外的優化，讓瀏覽器處理
		if (useViewTransition) {
			return;
		}

		// 1. 臨時禁用重型元素動畫
		this.disableHeavyAnimations();

		// 2. 隱藏視口外的重型元素
		this.hideOffscreenHeavyElements();

		// 3. 強制 GPU 合成層
		this.forceCompositing();
	}

	disableHeavyAnimations() {
		if (!this.tempStyleSheet) {
			this.tempStyleSheet = document.createElement("style");
			this.tempStyleSheet.id = "theme-optimizer-temp";
			document.head.appendChild(this.tempStyleSheet);
		}

		this.tempStyleSheet.textContent = `
      /* 臨時禁用重型元素的過渡和動畫 */
      .is-theme-transitioning .float-panel:not(.float-panel-closed),
      .is-theme-transitioning .music-player,
      .is-theme-transitioning .widget,
      .is-theme-transitioning .post-card,
      .is-theme-transitioning #navbar *,
      .is-theme-transitioning .dropdown-content,
      .is-theme-transitioning .custom-md * {
        transition: none !important;
        animation: none !important;
      }
      
      /* 強制隔離渲染上下文 */
      .is-theme-transitioning .float-panel,
      .is-theme-transitioning .post-card,
      .is-theme-transitioning .widget {
        contain: layout style paint !important;
      }
      
      /* 隱藏裝飾性元素 */
      .is-theme-transitioning .gradient-overlay,
      .is-theme-transitioning .decoration,
      .is-theme-transitioning .animation-element {
        visibility: hidden !important;
      }
      
      /* 在主題切換期間臨時隱藏代碼塊以提升性能 */
      /* 這個行爲可以通過配置文件中的 expressiveCodeConfig.hideDuringThemeTransition 控制 */
      .is-theme-transitioning .expressive-code {
        content-visibility: hidden !important;
        /* 避免閃爍 */
        opacity: 0.99;
      }
      
      /* 當禁用隱藏代碼塊功能時（通過JavaScript動態控制） */
      .is-theme-transitioning .expressive-code:not(.hide-during-transition) {
        /* 保持代碼塊可見，但禁用過渡效果 */
        content-visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* 確保打開的TOC面板在主題切換期間保持可點擊 */
      .is-theme-transitioning .float-panel:not(.float-panel-closed) {
        pointer-events: auto !important;
      }
    `;
	}

	hideOffscreenHeavyElements() {
		const viewportHeight = window.innerHeight;
		const scrollTop = window.scrollY;

		this.hiddenElements = [];

		this.heavySelectors.forEach((selector) => {
			const elements = document.querySelectorAll(selector);
			elements.forEach((element) => {
				const rect = element.getBoundingClientRect();
				const elementTop = rect.top + scrollTop;
				const elementBottom = elementTop + rect.height;

				// 完全在視口外（增加200px邊距）
				if (
					elementBottom < scrollTop - 200 ||
					elementTop > scrollTop + viewportHeight + 200
				) {
					const originalVisibility = element.style.contentVisibility;
					element.style.contentVisibility = "hidden";
					this.hiddenElements.push({ element, originalVisibility });
				}
			});
		});
	}

	forceCompositing() {
		const criticalElements = document.querySelectorAll(`
      .expressive-code,
      .post-card,
      .widget,
      #navbar
    `);

		this.compositedElements = [];

		criticalElements.forEach((element) => {
			const original = element.style.transform;
			element.style.transform = "translateZ(0)";
			element.style.willChange = "transform";

			this.compositedElements.push({ element, original });
		});
	}

	restoreAfterThemeSwitch(useViewTransition = false) {
		this.isOptimizing = false;

		// 如果使用 View Transitions，直接清理即可
		if (useViewTransition) {
			this.useViewTransition = false;
			return;
		}

		// 延遲恢復，確保主題切換完全完成
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				// 移除臨時樣式表
				if (this.tempStyleSheet && this.tempStyleSheet.parentNode) {
					this.tempStyleSheet.remove();
					this.tempStyleSheet = null;
				}

				// 恢復隱藏的元素
				if (this.hiddenElements) {
					this.hiddenElements.forEach(
						({ element, originalVisibility }) => {
							element.style.contentVisibility =
								originalVisibility || "";
						},
					);
					this.hiddenElements = null;
				}

				// 恢復合成層設置
				if (this.compositedElements) {
					this.compositedElements.forEach(({ element, original }) => {
						element.style.transform = original || "";
						element.style.willChange = "";
					});
					this.compositedElements = null;
				}
			});
		});
	}

	// 清理資源
	destroy() {
		if (this.codeBlockObserver) {
			this.codeBlockObserver.disconnect();
		}
		this.visibleBlocks.clear();
	}
}

// 初始化優化器
const themeOptimizer = new ThemeOptimizer();

// 導出到全局（統一API）
window.themeOptimizer = themeOptimizer;
