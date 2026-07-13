/**
 * 字體壓縮入口
 *
 * 模塊結構：
 *   utils.js          — 共享工具函數（文件遍歷、字符串提取、Markdown 解析）
 *   config-parser.js  — 配置解析（單次讀取 siteConfig.ts，緩存後分發）
 *   text-collector.js — 文本採集（8 個來源：本地文件 + 3 個遠程 API + 常用字符）
 *   font-compressor.js— 字體壓縮（Fontmin 子集化 + ttf→woff2 轉換）
 *   css-rewriter.js   — CSS 重寫（dist/ 中 ttf 引用替換爲 woff2）
 *   index.js          — 入口（串聯 compress → rewrite）
 */

import { compressFonts } from "./font-compressor.js";
import { updateCssFontReferences } from "./css-rewriter.js";

compressFonts().then(() => updateCssFontReferences());
