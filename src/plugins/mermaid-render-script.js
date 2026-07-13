(() => {
	// 單例模式：檢查是否已經初始化過
	if (window.mermaidInitialized) {
		// 如果已經初始化過，只確保 renderMermaidDiagrams 函數可用
		if (typeof window.renderMermaidDiagrams !== "function") {
			window.renderMermaidDiagrams = renderMermaidDiagrams;
		}
		return;
	}

	window.mermaidInitialized = true;

	// 記錄當前主題狀態，避免不必要的重新渲染
	let currentTheme = null;
	let isRendering = false; // 防止併發渲染
	let retryCount = 0;
	const MAX_RETRIES = 3;
	const RETRY_DELAY = 1000; // 1秒
	let fullscreenOverlay = null;

	function injectFullscreenStyles() {
		if (document.getElementById("mermaid-fullscreen-style")) {
			return;
		}

		const style = document.createElement("style");
		style.id = "mermaid-fullscreen-style";
		style.textContent = `
		:where(.mermaid[data-mermaid-code]) { position: relative; }
		.mermaid-fullscreen-btn {
			position: absolute;
			top: 10px;
			right: 10px;
			height: 36px;
			width: 36px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			opacity: 0;
			transition: opacity 0.2s ease;
			z-index: 3;
		}
		.mermaid:hover .mermaid-fullscreen-btn,
		.mermaid:focus-within .mermaid-fullscreen-btn {
			opacity: 1;
		}
		.mermaid-fullscreen-overlay {
			position: fixed;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: clamp(12px, 3vw, 28px);
			backdrop-filter: blur(6px);
			z-index: 9999;
			background: var(--mermaid-fs-backdrop, rgba(15, 23, 42, 0.9));
		}
		.mermaid-fullscreen-stage {
			position: relative;
			width: min(1200px, 96vw);
			max-height: 90vh;
			padding: clamp(12px, 2vw, 18px);
			background: var(--mermaid-fs-surface, #0f172a);
			border: 1px solid var(--mermaid-fs-border, rgba(255,255,255,0.08));
			border-radius: 16px;
			box-shadow: 0 20px 80px rgba(0, 0, 0, 0.35);
			overflow: hidden;
		}
		.mermaid-fullscreen-stage svg {
			width: 100%;
			height: auto;
			min-height: 320px;
		}
		.mermaid-fullscreen-close {
			position: absolute;
			top: 10px;
			right: 10px;
			z-index: 4;
		}
		.mermaid-fullscreen-overlay .mermaid-zoom-controls {
			position: absolute;
			left: 12px;
			bottom: 12px;
			display: flex;
			gap: 8px;
		}
		body.mermaid-fullscreen-open { overflow: hidden; }
		`;
		document.head.appendChild(style);
	}

	function getThemePalette() {
		const htmlElement = document.documentElement;
		const isDark = htmlElement.classList.contains("dark");
		const styles = getComputedStyle(htmlElement);
		const primary =
			styles.getPropertyValue("--primary")?.trim() ||
			(isDark ? "#7dd3fc" : "#2563eb");
		const surface =
			styles.getPropertyValue("--card-bg")?.trim() ||
			styles.getPropertyValue("--surface")?.trim() ||
			(isDark ? "#0b1220" : "#ffffff");
		const text =
			styles.getPropertyValue("--text-color")?.trim() ||
			styles.getPropertyValue("--foreground")?.trim() ||
			(isDark ? "#e5e7eb" : "#0f172a");
		const muted =
			styles.getPropertyValue("--muted")?.trim() ||
			styles.getPropertyValue("--muted-foreground")?.trim() ||
			(isDark ? "#1f2937" : "#e5e7eb");
		const backdrop = isDark
			? "rgba(8, 15, 30, 0.9)"
			: "rgba(255, 255, 255, 0.94)";

		return { isDark, primary, surface, text, muted, backdrop };
	}

	function closeFullscreen() {
		if (fullscreenOverlay) {
			fullscreenOverlay.remove();
			fullscreenOverlay = null;
			document.body.classList.remove("mermaid-fullscreen-open");
		}
	}

	function openFullscreen(svgElement) {
		const palette = getThemePalette();
		injectFullscreenStyles();

		closeFullscreen();

		const overlay = document.createElement("div");
		overlay.className = "mermaid-fullscreen-overlay";
		overlay.style.setProperty("--mermaid-fs-backdrop", palette.backdrop);
		overlay.style.setProperty("--mermaid-fs-surface", palette.surface);
		overlay.style.setProperty(
			"--mermaid-fs-border",
			palette.isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
		);

		const closeButton = document.createElement("button");
		closeButton.className =
			"mermaid-fullscreen-close btn-regular rounded-lg h-10 w-10";
		closeButton.title = "關閉全屏";
		closeButton.textContent = "✕";
		closeButton.addEventListener("click", closeFullscreen);

		const stage = document.createElement("div");
		stage.className = "mermaid-fullscreen-stage";

		const clonedSvg = svgElement.cloneNode(true);
		stage.appendChild(clonedSvg);
		overlay.appendChild(stage);
		overlay.appendChild(closeButton);

		overlay.addEventListener("click", (ev) => {
			if (ev.target === overlay) {
				closeFullscreen();
			}
		});

		const escHandler = (ev) => {
			if (ev.key === "Escape") {
				closeFullscreen();
			}
		};
		window.addEventListener("keydown", escHandler, { once: true });

		document.body.appendChild(overlay);
		document.body.classList.add("mermaid-fullscreen-open");
		fullscreenOverlay = overlay;

		// 爲全屏內的圖表添加縮放控制
		attachZoomControls(stage, clonedSvg);
	}

	function ensureFullscreenButton(element) {
		if (element.querySelector(".mermaid-fullscreen-btn")) {
			return;
		}
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "mermaid-fullscreen-btn btn-regular rounded-lg h-9 w-9";
		btn.title = "全屏查看";
		btn.setAttribute("aria-label", "全屏查看 Mermaid 圖表");
		btn.innerHTML = "⛶";
		btn.addEventListener("click", (ev) => {
			ev.stopPropagation();
			const svg = element.querySelector("svg");
			if (!svg) {
				return;
			}
			openFullscreen(svg);
		});
		element.appendChild(btn);
	}

	// 檢查主題是否真的發生了變化
	function hasThemeChanged() {
		const isDark = document.documentElement.classList.contains("dark");
		const newTheme = isDark ? "dark" : "default";

		if (currentTheme !== newTheme) {
			currentTheme = newTheme;
			return true;
		}
		return false;
	}

	// 等待 Mermaid 庫加載完成
	function waitForMermaid(timeout = 10000) {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();

			function check() {
				if (window.mermaid && typeof window.mermaid.initialize === "function") {
					resolve(window.mermaid);
				} else if (Date.now() - startTime > timeout) {
					reject(new Error("Mermaid library failed to load within timeout"));
				} else {
					setTimeout(check, 100);
				}
			}

			check();
		});
	}

	// 存儲 MutationObserver 實例
	let themeObserver = null;

	// 清理 MutationObserver
	function cleanupMutationObserver() {
		if (themeObserver) {
			themeObserver.disconnect();
			themeObserver = null;
		}
	}

	// 設置 MutationObserver 監聽 html 元素的 class 屬性變化
	function setupMutationObserver() {
		cleanupMutationObserver();

		themeObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "class"
				) {
					// 檢查是否是 dark 類的變化
					const target = mutation.target;
					const wasDark = mutation.oldValue
						? mutation.oldValue.includes("dark")
						: false;
					const isDark = target.classList.contains("dark");

					if (wasDark !== isDark) {
						if (hasThemeChanged()) {
							// 延遲渲染，避免主題切換時的閃爍
							setTimeout(() => renderMermaidDiagrams(), 150);
						}
					}
				}
			});
		});

		// 開始觀察 html 元素的 class 屬性變化
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
			attributeOldValue: true,
		});
	}

	// 縮放平移
	function attachZoomControls(element, svgElement) {
		if (element.__zoomAttached) {
			return;
		}
		element.__zoomAttached = true;

		const wrapper = document.createElement("div");
		wrapper.className = "mermaid-zoom-wrapper";

		const svgParent = svgElement.parentNode;
		wrapper.appendChild(svgElement);
		svgParent.appendChild(wrapper);

		let scale = 1;
		let tx = 0;
		let ty = 0;
		const MIN_SCALE = 0.2;
		const MAX_SCALE = 6;

		function applyTransform() {
			wrapper.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
		}
		const controls = document.createElement("div");
		controls.className = "mermaid-zoom-controls";
		controls.innerHTML = `
			<button class="btn-regular rounded-lg h-10 w-10 active:scale-90" data-action="zoom-in" title="Zoom in">+</button>
			<button class="btn-regular rounded-lg h-10 w-10 active:scale-90" data-action="zoom-out" title="Zoom out">−</button>
			<button class="btn-regular rounded-lg h-10 w-10 active:scale-90" data-action="reset" title="Reset">⤾</button>
		`;
		element.appendChild(controls);

		controls.addEventListener("click", (ev) => {
			const action = ev.target.getAttribute?.("data-action");
			if (!action) {
				return;
			}

			switch (action) {
				case "zoom-in":
					scale = Math.min(MAX_SCALE, +(scale * 1.2).toFixed(3));
					applyTransform();
					break;
				case "zoom-out":
					scale = Math.max(MIN_SCALE, +(scale / 1.2).toFixed(3));
					applyTransform();
					break;
				case "reset":
					scale = 1;
					tx = 0;
					ty = 0;
					applyTransform();
					break;
			}
		});

		let isPanning = false;
		let startX = 0;
		let startY = 0;
		let startTx = 0;
		let startTy = 0;

		wrapper.style.touchAction = "none";

		wrapper.addEventListener("pointerdown", (ev) => {
			if (ev.button !== 0) {
				return;
			} // 僅左鍵
			isPanning = true;
			wrapper.setPointerCapture(ev.pointerId);
			startX = ev.clientX;
			startY = ev.clientY;
			startTx = tx;
			startTy = ty;
		});

		wrapper.addEventListener("pointermove", (ev) => {
			if (!isPanning) {
				return;
			}
			const dx = ev.clientX - startX;
			const dy = ev.clientY - startY;
			tx = startTx + dx / scale; // 根據當前縮放調整靈敏度
			ty = startTy + dy / scale;
			applyTransform();
		});

		wrapper.addEventListener("pointerup", (ev) => {
			isPanning = false;
			try {
				wrapper.releasePointerCapture(ev.pointerId);
			} catch (_e) {}
		});

		wrapper.addEventListener("pointercancel", () => {
			isPanning = false;
		});

		// 鼠標滾輪縮放
		element.addEventListener(
			"wheel",
			(ev) => {
				ev.preventDefault();
				const delta = -ev.deltaY;
				const zoomFactor = delta > 0 ? 1.12 : 1 / 1.12;
				const prevScale = scale;
				scale = Math.min(
					MAX_SCALE,
					Math.max(MIN_SCALE, +(scale * zoomFactor).toFixed(3)),
				);

				const rect = wrapper.getBoundingClientRect();
				const cx = ev.clientX - rect.left;
				const cy = ev.clientY - rect.top;

				const worldX = cx / prevScale - tx;
				const worldY = cy / prevScale - ty;

				tx = cx / scale - worldX;
				ty = cy / scale - worldY;

				applyTransform();
			},
			{ passive: false },
		);

		// 雙擊重置
		wrapper.addEventListener("dblclick", () => {
			scale = 1;
			tx = 0;
			ty = 0;
			applyTransform();
		});
		applyTransform();
		let resizeTimer = null;
		window.addEventListener("resize", () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				applyTransform();
			}, 200);
		});
	}

	// 設置其他事件監聽器
	function setupEventListeners() {
		// 監聽頁面切換
		document.addEventListener("astro:page-load", () => {
			// 重新初始化主題狀態
			currentTheme = null;
			retryCount = 0; // 重置重試計數
			if (hasThemeChanged()) {
				setTimeout(() => renderMermaidDiagrams(), 100);
			}
		});

		// 監聽頁面可見性變化，頁面重新可見時重新渲染
		document.addEventListener("visibilitychange", () => {
			if (!document.hidden) {
				setTimeout(() => renderMermaidDiagrams(), 200);
			}
		});

		// 頁面切換前清理
		document.addEventListener("astro:before-swap", cleanupMutationObserver);

		// 頁面切換前清理全屏狀態
		document.addEventListener("astro:before-swap", closeFullscreen);

		// Swup 頁面切換時重新設置 Observer
		document.addEventListener("astro:after-swap", () => {
			if (themeObserver === null) {
				setupMutationObserver();
			}
		});
	}

	async function initializeMermaid() {
		try {
			await waitForMermaid();

			// 初始化 Mermaid 配置
			window.mermaid.initialize({
				startOnLoad: false,
				theme: "default",
				themeVariables: {
					fontFamily: "inherit",
					fontSize: "16px",
				},
				securityLevel: "loose",
				// 添加錯誤處理配置
				errorLevel: "warn",
				logLevel: "error",
			});

			// 渲染所有 Mermaid 圖表
			await renderMermaidDiagrams();
		} catch (error) {
			console.error("Failed to initialize Mermaid:", error);
			// 如果初始化失敗，嘗試重新加載
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				setTimeout(() => initializeMermaid(), RETRY_DELAY * retryCount);
			}
		}
	}

	async function renderMermaidDiagrams() {
		// 防止併發渲染
		if (isRendering) {
			return;
		}

		// 檢查 Mermaid 是否可用
		if (!window.mermaid || typeof window.mermaid.render !== "function") {
			console.warn("Mermaid not available, skipping render");
			return;
		}

		isRendering = true;
		window.dispatchEvent(new CustomEvent("mermaid:render:start"));

		try {
			const mermaidElements = Array.from(
				document.querySelectorAll(".mermaid[data-mermaid-code]"),
			);

			if (mermaidElements.length === 0) {
				isRendering = false;
				window.dispatchEvent(
					new CustomEvent("mermaid:render:done", {
						detail: { count: 0 },
					}),
				);
				return;
			}

			// 延遲檢測主題，確保 DOM 已經更新
			await new Promise((resolve) => setTimeout(resolve, 100));

			const htmlElement = document.documentElement;
			const isDark = htmlElement.classList.contains("dark");
			const theme = isDark ? "dark" : "default";

			// 更新 Mermaid 主題（只需要更新一次）
			window.mermaid.initialize({
				startOnLoad: false,
				theme: theme,
				themeVariables: {
					fontFamily: "inherit",
					fontSize: "16px",
					// 強制應用主題變量
					primaryColor: isDark ? "#ffffff" : "#000000",
					primaryTextColor: isDark ? "#ffffff" : "#000000",
					primaryBorderColor: isDark ? "#ffffff" : "#000000",
					lineColor: isDark ? "#ffffff" : "#000000",
					secondaryColor: isDark ? "#333333" : "#f0f0f0",
					tertiaryColor: isDark ? "#555555" : "#e0e0e0",
				},
				securityLevel: "loose",
				errorLevel: "warn",
				logLevel: "error",
			});

			// 分批渲染，避免一次性阻塞主線程
			const BATCH_SIZE = 3;
			let index = 0;

			async function renderBatch() {
				const batch = mermaidElements.slice(index, index + BATCH_SIZE);
				if (batch.length === 0) {
					return;
				}

				await Promise.all(
					batch.map(async (element, localIndex) => {
						const globalIndex = index + localIndex;
						let attempts = 0;
						const maxAttempts = 3;

						while (attempts < maxAttempts) {
							try {
								const code = element.getAttribute("data-mermaid-code");

								if (!code) {
									break;
								}

								// 顯示加載狀態
								element.innerHTML =
									'<div class="mermaid-loading">Rendering diagram...</div>';

								// 渲染圖表
								const { svg } = await window.mermaid.render(
									`mermaid-${Date.now()}-${globalIndex}-${attempts}`,
									code,
								);

								const parser = new DOMParser();
								const doc = parser.parseFromString(svg, "image/svg+xml");
								const svgElement = doc.documentElement;

								element.innerHTML = "";
								element.__zoomAttached = false;
								element.appendChild(svgElement);

								// 添加響應式支持
								const insertedSvg = element.querySelector("svg");
								if (insertedSvg) {
									insertedSvg.setAttribute("width", "100%");
									insertedSvg.removeAttribute("height");
									insertedSvg.style.maxWidth = "100%";
									insertedSvg.style.height = "auto";
									//Todo 需要根據實際情況
									insertedSvg.style.minHeight = "300px";

									// 強制應用樣式
									if (isDark) {
										svgElement.style.filter = "brightness(0.9) contrast(1.1)";
									} else {
										svgElement.style.filter = "none";
									}
									attachZoomControls(element, insertedSvg);
									ensureFullscreenButton(element);
								}

								// 渲染成功，跳出重試循環
								break;
							} catch (error) {
								attempts++;
								console.warn(
									`Mermaid rendering attempt ${attempts} failed for element ${globalIndex}:`,
									error,
								);

								if (attempts >= maxAttempts) {
									console.error(
										`Failed to render Mermaid diagram after ${maxAttempts} attempts:`,
										error,
									);
									element.innerHTML = `
										<div class="mermaid-error">
											<p>Failed to render diagram after ${maxAttempts} attempts.</p>
											<button onclick="location.reload()" style="margin-top: 8px; padding: 4px 8px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
												Retry Page
											</button>
										</div>
									`;
								} else {
									// 等待一段時間後重試
									await new Promise((resolve) =>
										setTimeout(resolve, 500 * attempts),
									);
								}
							}
						}
					}),
				);

				index += BATCH_SIZE;

				if (index < mermaidElements.length) {
					// 在空閒時間繼續渲染下一批，避免長時間阻塞主線程
					await new Promise((resolve) => {
						if ("requestIdleCallback" in window) {
							window.requestIdleCallback(() => resolve());
						} else {
							setTimeout(resolve, 50);
						}
					});
					return renderBatch();
				}
			}

			await renderBatch();
			retryCount = 0; // 重置重試計數
			window.dispatchEvent(
				new CustomEvent("mermaid:render:done", {
					detail: { count: mermaidElements.length },
				}),
			);
		} catch (error) {
			console.error("Error in renderMermaidDiagrams:", error);
			window.dispatchEvent(new CustomEvent("mermaid:render:done"));

			// 如果渲染失敗，嘗試重新渲染
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				setTimeout(() => renderMermaidDiagrams(), RETRY_DELAY * retryCount);
			}
		} finally {
			isRendering = false;
		}
	}

	// 初始化主題狀態
	function initializeThemeState() {
		const isDark = document.documentElement.classList.contains("dark");
		currentTheme = isDark ? "dark" : "default";
	}

	// 加載 Mermaid 庫
	async function loadMermaid() {
		if (typeof window.mermaid !== "undefined") {
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src =
				"https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";

			script.onload = () => {
				console.log("Mermaid library loaded successfully");
				resolve();
			};

			script.onerror = (error) => {
				console.error("Failed to load Mermaid library:", error);
				// 嘗試備用 CDN
				const fallbackScript = document.createElement("script");
				fallbackScript.src = "https://unpkg.com/mermaid@11/dist/mermaid.min.js";

				fallbackScript.onload = () => {
					console.log("Mermaid library loaded from fallback CDN");
					resolve();
				};

				fallbackScript.onerror = () => {
					reject(
						new Error(
							"Failed to load Mermaid from both primary and fallback CDNs",
						),
					);
				};

				document.head.appendChild(fallbackScript);
			};

			document.head.appendChild(script);
		});
	}

	// 主初始化函數
	async function initialize() {
		try {
			// 設置監聽器
			setupMutationObserver();
			setupEventListeners();

			// 初始化主題狀態
			initializeThemeState();

			// 加載並初始化 Mermaid
			await loadMermaid();
			await initializeMermaid();

			// 將 renderMermaidDiagrams 暴露到全局作用域，以便在解密後調用
			window.renderMermaidDiagrams = renderMermaidDiagrams;
		} catch (error) {
			console.error("Failed to initialize Mermaid system:", error);
		}
	}

	// 啓動初始化
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initialize);
	} else {
		initialize();
	}
})();
