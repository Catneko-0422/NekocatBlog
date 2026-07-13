/**
 * Sakura 特效模塊
 * 管理櫻花飄落特效的初始化
 */

import type { SakuraConfig } from "../../types/config";
import { initSakura, stopSakura } from "../../utils/sakura-manager";

/**
 * Sakura 特效處理器類
 * 負責櫻花飄落特效的初始化和狀態管理
 */
export class SakuraEffectHandler {
	private initialized = false;
	private config: SakuraConfig | null = null;

	/**
	 * 初始化 Sakura 特效
	 */
	init(widgetConfigs: any): void {
		const sakuraConfig = widgetConfigs?.sakura;
		if (!sakuraConfig || !sakuraConfig.enable) {
			return;
		}

		// 避免重複初始化
		if ((window as any).sakuraInitialized) {
			return;
		}

		this.config = sakuraConfig;
		initSakura(sakuraConfig);
		this.initialized = true;
		(window as any).sakuraInitialized = true;
	}

	/**
	 * 檢查是否已初始化
	 */
	isInitialized(): boolean {
		return this.initialized;
	}

	/**
	 * 獲取配置
	 */
	getConfig(): SakuraConfig | null {
		return this.config;
	}
}

// 創建全局實例
let globalSakuraEffectHandler: SakuraEffectHandler | null = null;

/**
 * 獲取全局 Sakura 特效處理器實例
 */
export function getSakuraEffectHandler(): SakuraEffectHandler {
	if (!globalSakuraEffectHandler) {
		globalSakuraEffectHandler = new SakuraEffectHandler();
	}
	return globalSakuraEffectHandler;
}

/**
 * 初始化 Sakura 特效（便捷函數）
 */
export function setupSakura(widgetConfigs: any): void {
	const handler = getSakuraEffectHandler();
	handler.init(widgetConfigs);
}

/**
 * 設置 Sakura 特效初始化的 DOM 監聽
 */
export function setupSakuraOnDOMReady(widgetConfigs: any): void {
	const handler = getSakuraEffectHandler();

	const init = () => {
		handler.init(widgetConfigs);
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}

	if (!(window as any).__sakuraToggleListenerAdded) {
		(window as any).__sakuraToggleListenerAdded = true;
		window.addEventListener("sakura-toggle", (e: Event) => {
			const detail = (e as CustomEvent).detail;
			if (detail.enabled) {
				const config = handler.getConfig() || widgetConfigs?.sakura;
				if (config && config.enable) {
					initSakura({ ...config, enable: true });
					(window as any).sakuraInitialized = true;
				}
			} else {
				stopSakura();
				(window as any).sakuraInitialized = false;
			}
		});
	}
}
