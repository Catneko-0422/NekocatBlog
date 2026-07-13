/**
 * 面板處理器
 * 管理面板的點擊外部關閉功能
 */

/**
 * 面板配置接口
 */
interface PanelConfig {
	id: string;
	ignoreElements: string[];
}

/**
 * 面板處理器類
 * 負責初始化面板的點擊外部關閉功能
 */
export class PanelHandler {
	private panels: PanelConfig[] = [
		{
			id: "display-setting",
			ignoreElements: ["display-setting", "display-settings-switch"],
		},
		{
			id: "nav-menu-panel",
			ignoreElements: ["nav-menu-panel", "nav-menu-switch"],
		},
		{
			id: "search-panel",
			ignoreElements: ["search-panel", "search-bar", "search-switch"],
		},
		{
			id: "mobile-toc-panel",
			ignoreElements: ["mobile-toc-panel", "mobile-toc-switch"],
		},
		{
			id: "wallpaper-mode-panel",
			ignoreElements: ["wallpaper-mode-panel", "wallpaper-mode-switch"],
		},
	];

	private panelManager: any = null;
	private boundClickHandlers = new Map<string, (event: MouseEvent) => void>();

	/**
	 * 初始化面板處理器
	 */
	async init(): Promise<void> {
		try {
			// 動態導入面板管理器
			const module = await import("../../utils/panel-manager.js");
			this.panelManager = module.panelManager;

			// 設置所有面板的點擊外部關閉功能
			this.panels.forEach((panel) => {
				this.setupClickOutsideToClose(panel);
			});

			console.log("PanelHandler: 初始化完成");
			return Promise.resolve();
		} catch (error) {
			console.error("PanelHandler: 初始化失敗", error);
			return Promise.reject(error);
		}
	}

	/**
	 * 設置點擊外部關閉面板
	 */
	private setupClickOutsideToClose(panel: PanelConfig): void {
		const clickHandler = async (event: MouseEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) {
				return;
			}

			// 檢查是否點擊了忽略的元素
			for (const ignoreId of panel.ignoreElements) {
				const ignoreElement = document.getElementById(ignoreId);
				if (
					ignoreElement === target ||
					ignoreElement?.contains(target)
				) {
					return;
				}
			}

			// 關閉面板
			if (this.panelManager) {
				await this.panelManager.closePanel(panel.id);
			}
		};

		// 存儲綁定的處理器以便後續清理
		this.boundClickHandlers.set(panel.id, clickHandler);
		document.addEventListener("click", clickHandler);
	}

	/**
	 * 添加自定義面板配置
	 */
	addPanel(panel: PanelConfig): void {
		this.panels.push(panel);
		if (this.panelManager) {
			this.setupClickOutsideToClose(panel);
		}
	}

	/**
	 * 移除面板配置
	 */
	removePanel(panelId: string): void {
		// 移除事件監聽
		const handler = this.boundClickHandlers.get(panelId);
		if (handler) {
			document.removeEventListener("click", handler);
			this.boundClickHandlers.delete(panelId);
		}

		// 從配置中移除
		this.panels = this.panels.filter((p) => p.id !== panelId);
	}

	/**
	 * 銷燬處理器
	 */
	destroy(): void {
		// 移除所有事件監聽
		this.boundClickHandlers.forEach((handler) => {
			document.removeEventListener("click", handler);
		});
		this.boundClickHandlers.clear();
		this.panelManager = null;
	}

	/**
	 * 獲取面板管理器實例
	 */
	getPanelManager(): any {
		return this.panelManager;
	}
}

// 創建全局實例
let globalPanelHandler: PanelHandler | null = null;

/**
 * 獲取全局面板處理器實例
 */
export function getPanelHandler(): PanelHandler {
	if (!globalPanelHandler) {
		globalPanelHandler = new PanelHandler();
	}
	return globalPanelHandler;
}

/**
 * 初始化面板處理器（便捷函數）
 */
export async function initPanelHandler(): Promise<void> {
	const handler = getPanelHandler();
	await handler.init();
}
