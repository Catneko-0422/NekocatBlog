class CodeBlockCollapser {
	constructor() {
		this.processedBlocks = new WeakSet();
		this.observer = null;
		this.isThemeChanging = false;
		this.debug = false; // 設置爲 true 啓用調試日誌
		this.init();
	}

	log(...args) {
		if (this.debug) {
			console.log("[CodeBlockCollapser]", ...args);
		}
	}

	init() {
		this.log("Initializing...");
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => {
				this.log("DOMContentLoaded - setting up code blocks");
				this.setupCodeBlocks();
			});
		} else {
			this.log("Document already loaded - setting up code blocks");
			this.setupCodeBlocks();
		}
		this.observePageChanges();
		this.setupThemeChangeListener();
		this.setupThemeOptimizerSync();
	}

	setupThemeOptimizerSync() {
		// 與主題優化器同步，確保代碼塊的隱藏/顯示行爲一致
		this.syncWithThemeOptimizer();

		// 監聽主題優化器初始化完成事件
		document.addEventListener("themeOptimizerReady", () => {
			this.log("Theme optimizer ready, syncing code block behavior");
			this.syncWithThemeOptimizer();
		});

		// 監聽頁面切換事件，確保同步
		document.addEventListener("swup:pageView", () => {
			// 延遲同步，確保主題優化器已經處理完代碼塊
			setTimeout(() => {
				this.syncWithThemeOptimizer();
			}, 150);
		});
	}

	syncWithThemeOptimizer() {
		// 檢查主題優化器是否存在
		if (window.themeOptimizer) {
			// 獲取當前主題優化器的設置
			const shouldHideDuringTransition =
				window.themeOptimizer.hideCodeBlocksDuringTransition;

			// 應用相同的設置到代碼塊
			const codeBlocks = document.querySelectorAll(".expressive-code");
			codeBlocks.forEach((block) => {
				if (shouldHideDuringTransition) {
					block.classList.add("hide-during-transition");
				} else {
					block.classList.remove("hide-during-transition");
				}
			});

			this.log(
				`Synced with theme optimizer: hide code blocks during transition = ${shouldHideDuringTransition}`,
			);
		} else {
			// 如果主題優化器不存在，應用默認行爲
			const codeBlocks = document.querySelectorAll(".expressive-code");
			codeBlocks.forEach((block) => {
				block.classList.add("hide-during-transition");
			});

			this.log("Theme optimizer not available, applied default behavior");
		}
	}

	setupThemeChangeListener() {
		// 監聽主題切換，在切換期間暫停 observer 和優化性能
		const themeObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (
					mutation.type === "attributes" &&
					(mutation.attributeName === "class" ||
						mutation.attributeName === "data-theme")
				) {
					const isTransitioning =
						document.documentElement.classList.contains(
							"is-theme-transitioning",
						);

					if (isTransitioning && !this.isThemeChanging) {
						this.isThemeChanging = true;

						// 斷開 observer 以避免在主題切換時進行不必要的檢查
						if (this.observer) {
							this.observer.disconnect();
						}

						// 性能優化：臨時禁用代碼塊的動畫和過渡
						document
							.querySelectorAll(".expressive-code")
							.forEach((block) => {
								block.style.transition = "none";
							});
					} else if (!isTransitioning && this.isThemeChanging) {
						this.isThemeChanging = false;

						// 等待主題切換完全結束後再恢復
						requestAnimationFrame(() => {
							// 恢復代碼塊的過渡效果
							document
								.querySelectorAll(".expressive-code")
								.forEach((block) => {
									block.style.transition = "";
								});

							// 重新連接 observer
							setTimeout(() => {
								this.observePageChanges();
							}, 50);
						});
					}
					break;
				}
			}
		});

		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "data-theme"],
		});
	}

	setupCodeBlocks() {
		requestAnimationFrame(() => {
			const codeBlocks = document.querySelectorAll(".expressive-code");
			this.log(`Found ${codeBlocks.length} code blocks to process`);

			codeBlocks.forEach((codeBlock, index) => {
				if (!this.processedBlocks.has(codeBlock)) {
					this.log(`Enhancing code block ${index + 1}`);
					this.enhanceCodeBlock(codeBlock);
					this.processedBlocks.add(codeBlock);
				} else {
					this.log(`Code block ${index + 1} already processed`);
				}
			});
		});
	}

	enhanceCodeBlock(codeBlock) {
		const frame = codeBlock.querySelector(".frame");
		if (!frame) {
			this.log("No frame found in code block, skipping");
			return;
		}

		if (frame.classList.contains("has-title")) {
			this.log("Code block has title, skipping collapse feature");
			return;
		}

		this.log("Adding collapse feature to code block");
		codeBlock.classList.add("collapsible", "expanded");

		const toggleBtn = this.createToggleButton();
		frame.appendChild(toggleBtn);

		this.bindToggleEvents(codeBlock, toggleBtn);
	}

	createToggleButton() {
		const button = document.createElement("button");
		button.className = "collapse-toggle-btn";
		button.type = "button";
		button.setAttribute("aria-label", "摺疊/展開代碼塊");

		button.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g fill="none">
          <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
          <path fill="currentColor" d="m12 16.172l-4.95-4.95a1 1 0 1 0-1.414 1.414l5.657 5.657a1 1 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0-1.414-1.414z"></path>
        </g>
      </svg>
    `;

		return button;
	}

	bindToggleEvents(codeBlock, button) {
		button.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.toggleCollapse(codeBlock);
		});

		button.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				this.toggleCollapse(codeBlock);
			}
		});
	}

	toggleCollapse(codeBlock) {
		const isCollapsed = codeBlock.classList.contains("collapsed");

		requestAnimationFrame(() => {
			if (isCollapsed) {
				codeBlock.classList.remove("collapsed");
				codeBlock.classList.add("expanded");
			} else {
				codeBlock.classList.remove("expanded");
				codeBlock.classList.add("collapsed");
			}
		});

		const event = new CustomEvent("codeBlockToggle", {
			detail: { collapsed: !isCollapsed, element: codeBlock },
		});
		document.dispatchEvent(event);
	}

	observePageChanges() {
		// 如果正在主題切換，不要重新連接
		if (this.isThemeChanging) {
			return;
		}

		// 斷開現有的 observer
		if (this.observer) {
			this.observer.disconnect();
		}

		let debounceTimer = null;

		this.observer = new MutationObserver((mutations) => {
			// 如果正在主題切換，忽略所有變化
			if (this.isThemeChanging) {
				return;
			}

			let shouldReinit = false;

			// 外層循環：遍歷所有變動
			for (const mutation of mutations) {
				if (
					mutation.type === "childList" &&
					mutation.addedNodes.length > 0
				) {
					// 內層循環：遍歷新增節點
					for (const node of mutation.addedNodes) {
						// 只檢查元素節點 (nodeType 1)
						if (node.nodeType === Node.ELEMENT_NODE) {
							if (
								node.classList.contains("expressive-code") ||
								(node.getElementsByClassName &&
									node.getElementsByClassName(
										"expressive-code",
									).length > 0)
							) {
								shouldReinit = true;
								break;
							}
						}
					}
				}
				if (shouldReinit) {
					break;
				}
			}

			if (shouldReinit) {
				clearTimeout(debounceTimer);
				debounceTimer = setTimeout(() => this.setupCodeBlocks(), 30);
			}
		});

		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	destroy() {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		this.processedBlocks = new WeakSet();
	}

	// 公共API方法
	collapseAll() {
		const allBlocks = document.querySelectorAll(
			".expressive-code.expanded",
		);
		allBlocks.forEach((block) => {
			this.toggleCollapse(block);
		});
	}

	expandAll() {
		const allBlocks = document.querySelectorAll(
			".expressive-code.collapsed",
		);
		allBlocks.forEach((block) => {
			this.toggleCollapse(block);
		});
	}
}

const codeBlockCollapser = new CodeBlockCollapser();

window.CodeBlockCollapser = CodeBlockCollapser;
window.codeBlockCollapser = codeBlockCollapser;

// 設置 Swup 鉤子的函數
function setupSwupHooks() {
	if (window.swup) {
		codeBlockCollapser.log("Setting up Swup hooks");

		// 監聽 page:view 事件
		window.swup.hooks.on("page:view", () => {
			codeBlockCollapser.log(
				"Swup page:view event - reinitializing code blocks",
			);
			// 頁面切換後重置 processedBlocks，確保新頁面的代碼塊被處理
			codeBlockCollapser.processedBlocks = new WeakSet();
			setTimeout(() => {
				codeBlockCollapser.setupCodeBlocks();
			}, 100);
		});

		// 監聽 content:replace 事件（更早觸發）
		window.swup.hooks.on("content:replace", () => {
			codeBlockCollapser.log(
				"Swup content:replace event - preparing for reinitialization",
			);
			// 內容替換時也重置，確保不會因爲緩存而跳過處理
			codeBlockCollapser.processedBlocks = new WeakSet();
			setTimeout(() => {
				codeBlockCollapser.setupCodeBlocks();
			}, 50);
		});

		return true;
	}
	return false;
}

// 嘗試立即設置 Swup 鉤子
if (!setupSwupHooks()) {
	// 如果 Swup 尚未初始化，等待它加載
	codeBlockCollapser.log("Swup not ready, waiting for initialization");

	// 監聽 swup:enable 事件
	document.addEventListener("swup:enable", () => {
		codeBlockCollapser.log("Swup enabled, setting up hooks");
		setupSwupHooks();
	});

	// 額外的延遲重試機制，確保捕獲到 Swup
	const retryInterval = setInterval(() => {
		if (setupSwupHooks()) {
			codeBlockCollapser.log("Swup hooks set up successfully via retry");
			clearInterval(retryInterval);
		}
	}, 100);

	// 最多重試 20 次（2 秒）
	setTimeout(() => {
		clearInterval(retryInterval);
	}, 2000);
}
