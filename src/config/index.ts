/**
 * 配置統一導出入口
 *
 * ══════════════════════════════════════════════════════════════
 * 配置文件索引
 * ══════════════════════════════════════════════════════════════
 *
 * 導出名稱                      │ 文件                       │ 說明
 * ─────────────────────────────┼────────────────────────────┼──────────────────────────────
 * siteConfig                    │ siteConfig.ts              │ 站點核心配置（標題、語言、主題色、橫幅、字體、特色頁面開關等）
 * SITE_LANG                     │ siteConfig.ts              │ 站點語言常量（從 siteConfig 中導出）
 * fullscreenWallpaperConfig     │ backgroundWallpaper.ts     │ 全屏壁紙模式配置（圖片源、輪播、透明度、模糊）
 * navBarConfig                  │ navBarConfig.ts            │ 導航欄菜單配置（鏈接、多級下拉菜單）
 * profileConfig                 │ profileConfig.ts           │ 個人資料（頭像、暱稱、簡介、社交鏈接）
 * licenseConfig                 │ licenseConfig.ts           │ 文章許可協議（CC 協議名稱和鏈接）
 * permalinkConfig               │ permalinkConfig.ts         │ 固定鏈接配置（URL 格式模板）
 * expressiveCodeConfig          │ expressiveCodeConfig.ts    │ 代碼塊樣式（主題、主題切換行爲）
 * commentConfig                 │ commentConfig.ts           │ 評論系統（Twikoo / Giscus 配置）
 * shareConfig                   │ shareConfig.ts             │ 分享功能開關
 * announcementConfig            │ announcementConfig.ts      │ 公告欄（標題、內容、鏈接）
 * musicPlayerConfig             │ musicConfig.ts             │ 音樂播放器（本地 / Meting 模式）
 * footerConfig                  │ footerConfig.ts            │ 頁腳自定義 HTML
 * sidebarLayoutConfig           │ sidebarConfig.ts           │ 側邊欄組件佈局（排序、動畫、響應式斷點）
 * sakuraConfig                  │ effectsConfig.ts           │ 櫻花飄落特效（數量、速度、透明度）
 * pioConfig                     │ pioConfig.ts               │ Live2D 看板娘（模型、對話、位置）
 * relatedPostsConfig            │ relatedPostsConfig.ts      │ 相關文章推薦（開關、數量）
 * randomPostsConfig             │ randomPostsConfig.ts       │ 隨機文章推薦（開關、數量）
 * widgetConfigs                 │ (聚合)                     │ 側邊欄 Widget 配置聚合對象
 *
 * ══════════════════════════════════════════════════════════════
 * 類型定義
 * ══════════════════════════════════════════════════════════════
 *
 * 所有配置的 TypeScript 接口定義在 src/types/config.ts 中。
 * 修改配置結構時，請同步更新對應的接口定義。
 *
 * ══════════════════════════════════════════════════════════════
 * 使用方式
 * ══════════════════════════════════════════════════════════════
 *
 * 在 Astro 組件中：
 *   import { siteConfig, navBarConfig } from "@/config";
 *
 * 在相對路徑引用中：
 *   import { siteConfig } from "../config";
 *
 * 在腳本中：
 *   import { siteConfig } from "src/config";
 *
 * 以上三種方式都會自動解析到此 index.ts 文件。
 */

export { announcementConfig } from "./announcementConfig";

// ─── 外觀與壁紙 ─────────────────────────────────────────────
export { fullscreenWallpaperConfig } from "./backgroundWallpaper";
// ─── 互動功能 ───────────────────────────────────────────────
export { commentConfig } from "./commentConfig";
export { sakuraConfig } from "./effectsConfig";
// ─── 代碼塊 ─────────────────────────────────────────────────
export { expressiveCodeConfig } from "./expressiveCodeConfig";
export { footerConfig } from "./footerConfig";
// ─── 內容與版權 ─────────────────────────────────────────────
export { licenseConfig } from "./licenseConfig";
// ─── 多媒體 ─────────────────────────────────────────────────
export { musicPlayerConfig } from "./musicConfig";
// ─── 導航欄 ─────────────────────────────────────────────────
export { navBarConfig } from "./navBarConfig";
export { permalinkConfig } from "./permalinkConfig";
export { pioConfig } from "./pioConfig";
// ─── 個人資料 ───────────────────────────────────────────────
export { profileConfig } from "./profileConfig";
export { randomPostsConfig } from "./randomPostsConfig";
// ─── 文章推薦 ───────────────────────────────────────────────
export { relatedPostsConfig } from "./relatedPostsConfig";
export { shareConfig } from "./shareConfig";
// ─── 佈局 ───────────────────────────────────────────────────
export { sidebarLayoutConfig } from "./sidebarConfig";
// ─── 站點核心 ───────────────────────────────────────────────
export { SITE_LANG, siteConfig } from "./siteConfig";

import { announcementConfig } from "./announcementConfig";
import { fullscreenWallpaperConfig } from "./backgroundWallpaper";
import { sakuraConfig } from "./effectsConfig";
import { musicPlayerConfig } from "./musicConfig";
import { pioConfig } from "./pioConfig";
// ─── Widget 配置聚合（供 Swup 等運行時使用）────────────────
import { profileConfig } from "./profileConfig";
import { randomPostsConfig } from "./randomPostsConfig";
import { relatedPostsConfig } from "./relatedPostsConfig";
import { shareConfig } from "./shareConfig";
import { sidebarLayoutConfig } from "./sidebarConfig";

export const widgetConfigs = {
	profile: profileConfig,
	announcement: announcementConfig,
	music: musicPlayerConfig,
	layout: sidebarLayoutConfig,
	sakura: sakuraConfig,
	fullscreenWallpaper: fullscreenWallpaperConfig,
	pio: pioConfig,
	share: shareConfig,
	relatedPosts: relatedPostsConfig,
	randomPosts: randomPostsConfig,
} as const;
