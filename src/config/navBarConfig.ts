import type { NavBarConfig } from "../types/config";
import { LinkPreset } from "../types/config";

/**
 * 導航欄菜單配置
 *
 * ══════════════════════════════════════════════════════════════
 * 配置教程
 * ══════════════════════════════════════════════════════════════
 *
 * links 數組中的每一項可以是以下兩種類型之一：
 *
 * 【類型一】預設鏈接（LinkPreset）
 *   直接使用 LinkPreset 枚舉，自動生成對應的名稱、URL 和圖標。
 *   可用的預設值：
 *     LinkPreset.Home       → 首頁
 *     LinkPreset.Archive    → 歸檔
 *     LinkPreset.About      → 關於
 *     LinkPreset.Friends    → 友鏈
 *     LinkPreset.Anime      → 番劇
 *     LinkPreset.Diary      → 日記
 *     LinkPreset.Albums     → 相冊
 *     LinkPreset.Projects   → 項目
 *     LinkPreset.Skills     → 技能
 *     LinkPreset.Timeline   → 時間線
 *
 *   示例：
 *     links: [LinkPreset.Home, LinkPreset.Archive]
 *
 * 【類型二】自定義鏈接對象
 *   {
 *     name: "顯示名稱",           // 必填，菜單項顯示的文字
 *     url: "/your-page/",        // 必填，鏈接地址
 *     icon: "icon-set:icon",     // 可選，Iconify 圖標，格式爲 "集合名:圖標名"
 *     external: true,            // 可選，是否爲外部鏈接（默認 false）
 *     children: [...]            // 可選，子菜單數組（支持多級嵌套）
 *   }
 *
 * ══════════════════════════════════════════════════════════════
 * 多級菜單配置
 * ══════════════════════════════════════════════════════════════
 *
 * 通過 children 字段實現下拉子菜單。children 中的每一項同樣支持
 * LinkPreset 枚舉或自定義鏈接對象，可以自由混合使用。
 *
 * 【單級菜單】（無 children，直接作爲導航項顯示）
 *   {
 *     name: "About",
 *     url: "/about/",
 *     icon: "material-symbols:info",
 *   }
 *
 * 【一級下拉菜單】（一個父級 + 多個子項）
 *   {
 *     name: "Links",
 *     url: "/links/",
 *     icon: "material-symbols:link",
 *     children: [
 *       { name: "GitHub",   url: "https://github.com", external: true, icon: "fa7-brands:github" },
 *       { name: "Bilibili", url: "https://bilibili.com", external: true, icon: "fa7-brands:bilibili" },
 *     ]
 *   }
 *
 * 【混合使用預設和自定義鏈接】
 *   children 中可以同時包含 LinkPreset 枚舉和自定義對象：
 *   {
 *     name: "More",
 *     url: "#",
 *     icon: "material-symbols:more-horiz",
 *     children: [
 *       LinkPreset.Projects,                                    // 使用預設
 *       { name: "Skills", url: "/skills/", icon: "material-symbols:psychology" }, // 自定義
 *     ]
 *   }
 *
 * 【嵌套子菜單】（children 的 children，理論上支持無限層級）
 *   注意：當前 UI 僅渲染一級下拉。若需要更深層級，需配合前端組件改造。
 *   {
 *     name: "Resources",
 *     url: "#",
 *     icon: "material-symbols:folder",
 *     children: [
 *       {
 *         name: "文檔",
 *         url: "#",
 *         icon: "material-symbols:description",
 *         children: [
 *           { name: "快速入門", url: "/docs/quick-start/", icon: "material-symbols:rocket" },
 *           { name: "API 參考", url: "/docs/api/", icon: "material-symbols:code" },
 *         ]
 *       },
 *       { name: "示例", url: "/examples/", icon: "material-symbols:sample" },
 *     ]
 *   }
 *
 * ══════════════════════════════════════════════════════════════
 * 圖標說明
 * ══════════════════════════════════════════════════════════════
 *
 * icon 字段使用 Iconify 圖標格式："集合名:圖標名"
 * 常用圖標集合：
 *   - material-symbols   → Google Material Symbols（推薦，圖標豐富）
 *   - mdi                → Material Design Icons
 *   - fa7-brands         → Font Awesome 7 品牌圖標（GitHub, Discord 等）
 *   - fa7-solid          → Font Awesome 7 實心圖標
 *   - fa7-regular        → Font Awesome 7 線性圖標
 *   - simple-icons       → Simple Icons（各種品牌 Logo）
 *
 * 瀏覽更多圖標：https://icon-sets.iconify.design/
 *
 * ══════════════════════════════════════════════════════════════
 * external 字段說明
 * ══════════════════════════════════════════════════════════════
 *
 * - external: true  → 外部鏈接，點擊後在新標籤頁打開，並顯示外鏈圖標標識
 * - external: false → 內部鏈接，在當前頁面內導航（使用 Swup 無刷新跳轉）
 * - 不設置        → 默認視爲內部鏈接
 *
 * ══════════════════════════════════════════════════════════════
 * 注意事項
 * ══════════════════════════════════════════════════════════════
 *
 * 1. 關閉特色頁面後（siteConfig.featurePages），導航欄會自動隱藏對應鏈接，無需手動移除。
 * 2. 內部鏈接 URL 格式爲 "/page-name/"（以斜槓開頭和結尾）。
 * 3. 外部鏈接 URL 必須包含完整協議前綴（如 "https://"）。
 * 4. 導航欄在移動端會自動收攏爲漢堡菜單，子菜單以摺疊面板形式展示。
 * 5. links 數組的順序即爲導航欄從左到右的顯示順序。
 */
export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/Catneko-0422",
			external: true,
			icon: "fa7-brands:github",
		},
	],
};
