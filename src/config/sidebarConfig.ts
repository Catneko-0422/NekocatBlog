import type { SidebarLayoutConfig } from "../types/config";

/**
 * 側邊欄佈局配置
 * 用於控制側邊欄組件的顯示、排序、動畫和響應式行爲
 * sidebar: 控制組件所在的側邊欄（left 或 right）。注意：移動端通常不顯示右側欄內容。若組件設置在 right，請確保 layout.position 爲 "both"。
 */
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	// 側邊欄組件屬性配置列表
	properties: [
		{
			// 組件類型：用戶資料組件
			type: "profile",
			// 組件位置："top" 表示固定在頂部
			position: "top",
			// CSS 類名，用於應用樣式和動畫
			class: "onload-animation",
			// 動畫延遲時間（毫秒），用於錯開動畫效果
			animationDelay: 0,
		},
		{
			// 組件類型：公告組件
			type: "announcement",
			// 組件位置："top" 表示固定在頂部
			position: "top",
			// CSS 類名
			class: "onload-animation",
			// 動畫延遲時間
			animationDelay: 50,
		},
		{
			// 組件類型：側欄音樂組件
			type: "music-sidebar",
			position: "sticky",
			class: "onload-animation",
			animationDelay: 100,
		},
		{
			// 組件類型：分類組件
			type: "categories",
			// 組件位置："sticky" 表示粘性定位，可滾動
			position: "sticky",
			// CSS 類名
			class: "onload-animation",
			// 動畫延遲時間
			animationDelay: 150,
			// 響應式配置
			responsive: {
				// 摺疊閾值：當分類數量超過5個時自動摺疊
				collapseThreshold: 5,
			},
		},
		{
			// 組件類型：標籤組件
			type: "tags",
			// 組件位置："sticky" 表示粘性定位
			position: "top",
			// CSS 類名
			class: "onload-animation",
			// 動畫延遲時間
			animationDelay: 250,
			// 響應式配置
			responsive: {
				// 摺疊閾值：當標籤數量超過20個時自動摺疊
				collapseThreshold: 20,
			},
		},
		{
			// 組件類型：卡片式目錄組件
			type: "card-toc",
			// 組件位置
			position: "sticky",
			// CSS 類名
			class: "onload-animation",
			// 動畫延遲時間
			animationDelay: 200,
		},
		{
			// 組件類型：站點統計組件
			type: "site-stats",
			// 組件位置
			position: "top",
			// CSS 類名
			class: "onload-animation",
			// 動畫延遲時間
			animationDelay: 200,
		},
		{
			// 組件類型：日曆組件(移動端不顯示)
			type: "calendar",
			// 組件位置
			position: "top",
			// CSS 類名
			class: "onload-animation",
			// 動畫延遲時間
			animationDelay: 250,
		},
	],

	// 側欄組件佈局配置
	components: {
		left: ["profile", "announcement", "tags", "card-toc"],
		right: ["site-stats", "calendar", "categories", "music-sidebar"],
		drawer: ["profile", "announcement", "music-sidebar", "categories", "tags"],
	},

	// 默認動畫配置
	defaultAnimation: {
		// 是否啓用默認動畫
		enable: true,
		// 基礎延遲時間（毫秒）
		baseDelay: 0,
		// 遞增延遲時間（毫秒），每個組件依次增加的延遲
		increment: 50,
	},

	// 響應式佈局配置
	responsive: {
		// 斷點配置（像素值）
		breakpoints: {
			// 移動端斷點：屏幕寬度小於768px
			mobile: 768,
			// 平板端斷點：屏幕寬度小於1280px
			tablet: 1280,
			// 桌面端斷點：屏幕寬度大於等於1280px
			desktop: 1280,
		},
	},
};
