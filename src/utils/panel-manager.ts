/**
 * 統一的浮窗管理器
 * 確保同一時間只有一個浮窗處於打開狀態，並提供統一的動畫效果
 */

type PanelId =
	| "mobile-toc-panel"
	| "display-setting"
	| "nav-menu-panel"
	| "search-panel"
	| "wallpaper-mode-panel";

class PanelManager {
	private activePanels = new Set<PanelId>();
	private panelStack: PanelId[] = [];
	private readonly duration = 100;

	/**
	 * 應用動畫打開浮窗
	 */
	private animateIn(panel: HTMLElement): Promise<void> {
		return new Promise((resolve) => {
			// 檢查是否正在主題切換，如果是則跳過動畫
			const isThemeTransitioning = document.documentElement.classList.contains(
				"is-theme-transitioning",
			);

			if (isThemeTransitioning) {
				// 主題切換期間，直接顯示面板，不設置pointer-events: none
				panel.classList.remove("float-panel-closed");
				panel.style.opacity = "1";
				panel.style.transform = "scale(1) translateY(0)";
				resolve();
				return;
			}

			panel.classList.remove("float-panel-closed");
			panel.style.opacity = "0";
			panel.style.transform = "scale(0.95) translateY(-10px)";
			panel.style.pointerEvents = "none";

			requestAnimationFrame(() => {
				panel.style.transition = `all ${this.duration}ms ease-out`;

				requestAnimationFrame(() => {
					panel.style.opacity = "1";
					panel.style.transform = "scale(1) translateY(0)";
					panel.style.pointerEvents = "auto";

					setTimeout(() => {
						panel.style.transition = "";
						resolve();
					}, this.duration);
				});
			});
		});
	}

	/**
	 * 應用動畫關閉浮窗
	 */
	private animateOut(panel: HTMLElement): Promise<void> {
		return new Promise((resolve) => {
			// 檢查是否正在主題切換
			const isThemeTransitioning = document.documentElement.classList.contains(
				"is-theme-transitioning",
			);

			if (isThemeTransitioning) {
				// 主題切換期間，直接關閉面板，不設置pointer-events: none
				panel.classList.add("float-panel-closed");
				panel.style.opacity = "";
				panel.style.transform = "";
				resolve();
				return;
			}

			panel.style.transition = `all ${this.duration}ms ease-out`;
			panel.style.pointerEvents = "none";
			panel.style.opacity = "0";
			panel.style.transform = "scale(0.95) translateY(-10px)";

			setTimeout(() => {
				panel.classList.add("float-panel-closed");
				panel.style.transition = "";
				panel.style.opacity = "";
				panel.style.transform = "";
				panel.style.pointerEvents = "";
				resolve();
			}, this.duration);
		});
	}

	/**
	 * 切換指定浮窗的開關狀態
	 * @param panelId 浮窗ID
	 * @param forceState 強制設置狀態 (可選)
	 * @returns 浮窗最終狀態 (true: 打開, false: 關閉)
	 */
	async togglePanel(panelId: PanelId, forceState?: boolean): Promise<boolean> {
		const panel = document.getElementById(panelId);
		if (!panel) {
			console.warn(`Panel ${panelId} not found`);
			return false;
		}

		const isClosed = panel.classList.contains("float-panel-closed");
		const shouldOpen = forceState !== undefined ? forceState : isClosed;

		if (shouldOpen) {
			await this.closeAllPanelsExcept(panelId);
			await this.animateIn(panel);
			this.activePanels.add(panelId);
			this.panelStack = this.panelStack.filter((id) => id !== panelId);
			this.panelStack.push(panelId);
			return true;
		}
		await this.closePanel(panelId);
		return false;
	}

	/**
	 * 關閉指定浮窗
	 * @param panelId 浮窗ID
	 */
	async closePanel(panelId: PanelId): Promise<void> {
		const panel = document.getElementById(panelId);
		if (panel && !panel.classList.contains("float-panel-closed")) {
			await this.animateOut(panel);
			this.activePanels.delete(panelId);
			this.panelStack = this.panelStack.filter((id) => id !== panelId);
		}
	}

	/**
	 * 關閉指定浮窗外的所有浮窗
	 * @param exceptPanelId 要保持打開的浮窗ID
	 */
	async closeAllPanelsExcept(exceptPanelId?: PanelId): Promise<void> {
		const closingPromises = Array.from(this.activePanels)
			.filter((panelId) => panelId !== exceptPanelId)
			.map((panelId) => this.closePanel(panelId));

		await Promise.all(closingPromises);
	}
}

// 創建全局浮窗管理器實例
export const panelManager = new PanelManager();

// 將浮窗管理器暴露到全局，方便在其他地方使用
if (typeof window !== "undefined") {
	(window as { panelManager: unknown }).panelManager = panelManager;
}

export default panelManager;
