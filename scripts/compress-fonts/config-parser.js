import fs from "node:fs";
import path from "node:path";
import { ROOT_DIR } from "./utils.js";

/**
 * 一次性讀取 siteConfig.ts，緩存原始內容
 * 所有配置解析共享同一次文件讀取
 */
let _cachedContent = null;

function readSiteConfig() {
	if (_cachedContent) return _cachedContent;
	const configPath = path.join(ROOT_DIR, "src/config/siteConfig.ts");
	_cachedContent = fs.readFileSync(configPath, "utf-8");
	return _cachedContent;
}

/**
 * 提取語言設置
 */
export function getLang() {
	const content = readSiteConfig();
	const match = content.match(/const SITE_LANG = ["'](.+?)["']/);
	return match ? match[1] : "zh_CN";
}

/**
 * 提取字體配置（只返回 enableCompress=true 且有 localFonts 的字體）
 */
export function getFontConfigs() {
	const content = readSiteConfig();

	const fontConfigMatch = content.match(/font:\s*\{([\s\S]*?)\n\t\},/);
	if (!fontConfigMatch) {
		console.log("⚠ Font config not found, using default settings");
		return [];
	}

	const fontConfigStr = fontConfigMatch[1];
	const fonts = [];
	const fontTypes = ["asciiFont", "cjkFont"];

	for (const fontType of fontTypes) {
		const regex = new RegExp(`${fontType}:\\s*\\{([\\s\\S]*?)\\}`, "m");
		const match = fontConfigStr.match(regex);
		if (!match) continue;

		const config = match[1];

		const compressMatch = config.match(/enableCompress:\s*(true|false)/);
		const enableCompress = compressMatch ? compressMatch[1] === "true" : false;

		const localFontsMatch = config.match(/localFonts:\s*\[(.*?)\]/s);
		let localFonts = [];
		if (localFontsMatch?.[1].trim()) {
			localFonts =
				localFontsMatch[1]
					.match(/["']([^"']+)["']/g)
					?.map((s) => s.replace(/["']/g, "")) || [];
		}

		if (enableCompress && localFonts.length > 0) {
			fonts.push({ type: fontType, files: localFonts, enableCompress });
		}
	}

	return fonts;
}

/**
 * 檢查番劇頁面是否啓用
 */
export function isAnimePageEnabled() {
	const content = readSiteConfig();
	const match = content.match(/featurePages:\s*\{([\s\S]*?)\}/);
	if (!match) return false;
	const animeMatch = match[1].match(/anime:\s*(true|false)/);
	return animeMatch ? animeMatch[1] === "true" : false;
}

/**
 * 獲取番劇模式
 */
export function getAnimeMode() {
	const content = readSiteConfig();
	const match = content.match(/anime:\s*\{[\s\S]*?mode:\s*["']([^"']+)["']/);
	return match ? match[1] : "bangumi";
}

/**
 * 獲取 Bangumi 用戶 ID
 */
export function getBangumiUserId() {
	const content = readSiteConfig();
	const match = content.match(
		/bangumi:\s*\{[\s\S]*?userId:\s*["']([^"']+)["']/,
	);
	return match ? match[1] : null;
}

/**
 * 獲取音樂播放器配置（從 musicConfig.ts 讀取）
 */
export function getMusicConfig() {
	const configPath = path.join(ROOT_DIR, "src/config/musicConfig.ts");
	if (!fs.existsSync(configPath)) return null;
	const content = fs.readFileSync(configPath, "utf-8");

	const enableMatch = content.match(
		/musicPlayerConfig:\s*MusicPlayerConfig\s*=\s*\{[\s\S]*?enable:\s*(true|false)/,
	);
	if (!enableMatch || enableMatch[1] === "false") {
		return null;
	}

	const configMatch = content.match(
		/musicPlayerConfig:\s*MusicPlayerConfig\s*=\s*\{([\s\S]*?)\};/,
	);
	if (!configMatch) return null;

	const configStr = configMatch[1];
	const extract = (field) => {
		const m = configStr.match(new RegExp(`${field}:\\s*["']([^"']+)["']`));
		return m ? m[1] : null;
	};

	return {
		mode: extract("mode") || "meting",
		meting_api:
			extract("meting_api") ||
			"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r",
		id: extract("id") || "14164869977",
		server: extract("server") || "netease",
		type: extract("type") || "playlist",
	};
}

/**
 * 獲取合併配置（一次讀取，返回所有需要的信息）
 */
export function getConfig() {
	return {
		lang: getLang(),
		fonts: getFontConfigs(),
		animeEnabled: isAnimePageEnabled(),
		animeMode: getAnimeMode(),
		bangumiUserId: getBangumiUserId(),
		musicConfig: getMusicConfig(),
	};
}
