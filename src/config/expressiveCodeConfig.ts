import type { ExpressiveCodeConfig } from "../types/config";

// 代碼塊樣式配置
export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 注意：某些樣式（如背景顏色）已被覆蓋，請參閱 astro.config.mjs 文件。
	// 請選擇深色主題，因爲此博客主題目前僅支持深色背景
	theme: "github-dark",
	// 是否在主題切換時隱藏代碼塊以避免卡頓問題
	hideDuringThemeTransition: true,
};
