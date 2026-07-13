/**
 * 響應式側邊欄管理器
 * 提供側邊欄響應式顯示的通用邏輯
 */
import type { SidebarElementId } from "./types/widget";
import { widgetManager } from "./widget-manager";
import { getDeviceType } from "./widget-renderer";

// Window 擴展接口
interface WindowWithCustomProps extends Window {
	[key: string]: unknown;
}

/**
 * 側邊欄顯示配置
 */
export interface SidebarDisplayConfig {
	elementId: SidebarElementId;
	managerKey: string;
	breakpoints: { mobile: number; tablet: number };
	showConfig: {
		mobile: boolean;
		tablet: boolean;
		desktop: boolean;
	};
	hasComponents: {
		mobile: boolean;
		tablet: boolean;
	};
}

/**
 * 創建側邊欄顯示屬性
 * @param config 顯示配置
 * @returns 計算後的 CSS 顯示屬性
 */
function getSidebarDisplayProperty(
	config: SidebarDisplayConfig,
): Record<string, string> {
	const width = window.innerWidth;
	const deviceType = getDeviceType(width, config.breakpoints);

	let show = false;
	if (deviceType === "mobile") {
		show = config.showConfig.mobile && config.hasComponents.mobile;
	} else if (deviceType === "tablet") {
		show = config.showConfig.tablet && config.hasComponents.tablet;
	} else {
		show = config.showConfig.desktop && config.hasComponents.tablet;
	}

	return {
		[`--sidebar-${deviceType}-display`]: show ? "block" : "none",
	};
}

/**
 * 初始化響應式側邊欄管理器
 * @param config 側邊欄顯示配置
 */
export function initSidebarManager(config: SidebarDisplayConfig): void {
	const managerKey = config.managerKey;
	const win = window as unknown as WindowWithCustomProps;

	// 避免重複初始化
	if (win[managerKey]) {
		return;
	}
	win[managerKey] = true;

	/**
	 * 更新側邊欄顯示狀態
	 */
	function updateDisplay(): void {
		const sidebar = document.getElementById(config.elementId);
		if (!sidebar) {
			return;
		}

		const displayProps = getSidebarDisplayProperty(config);
		for (const [property, value] of Object.entries(displayProps)) {
			sidebar.style.setProperty(property, value);
		}
	}

	// 初始化顯示狀態
	updateDisplay();

	// 監聽窗口大小變化
	const resizeHandler = (): void => updateDisplay();
	const resizeKey = `${config.managerKey}ResizeHandler`;
	win[resizeKey] = resizeHandler;
	window.addEventListener("resize", resizeHandler);

	// 監聽 SWUP 內容替換事件
	if (typeof window !== "undefined" && win.swup) {
		const swupHookKey = `${config.managerKey}SwupHooked`;
		if (!win[swupHookKey]) {
			win[swupHookKey] = true;
			win.swup.hooks.on("content:replace", () => {
				// 延遲執行以確保 DOM 已更新
				setTimeout(() => {
					updateDisplay();
				}, 100);
			});
		}
	}
}

/**
 * 獲取 RightSideBar 的顯示配置
 */
export function getRightSidebarDisplayConfig(): SidebarDisplayConfig {
	return {
		elementId: "right-sidebar",
		managerKey: "__mizukiRightSidebarManagerInitialized",
		breakpoints: widgetManager.getBreakpoints(),
		showConfig: {
			mobile: false,
			tablet: false,
			desktop: true,
		},
		hasComponents: {
			mobile: false,
			tablet: false,
		},
	};
}
