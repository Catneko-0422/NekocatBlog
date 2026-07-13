import { siteConfig } from "../config/siteConfig";
import type { ImageFormat } from "../types/config";

/**
 * 獲取圖片優化格式配置
 * 從 siteConfig.imageOptimization.formats 讀取，默認 "both"（avif+webp）
 */
export function getImageFormats(): ImageFormat[] {
	const formatConfig = siteConfig.imageOptimization?.formats ?? "both";
	switch (formatConfig) {
		case "avif":
			return ["avif"];
		case "webp":
			return ["webp"];
		default:
			return ["avif", "webp"];
	}
}

/**
 * 獲取圖片優化質量配置
 * 從 siteConfig.imageOptimization.quality 讀取，默認 80
 */
export function getImageQuality(): number {
	return siteConfig.imageOptimization?.quality ?? 80;
}

/**
 * 獲取圖片回退格式
 * formats 爲 "avif" 時回退到 avif，其他情況回退到 webp
 */
export function getFallbackFormat(): "avif" | "webp" {
	const formatConfig = siteConfig.imageOptimization?.formats ?? "both";
	return formatConfig === "avif" ? "avif" : "webp";
}

/**
 * 檢查是否需要爲圖片添加 referrerpolicy="no-referrer" 以解決防盜鏈 403 問題
 * 基於 siteConfig.imageOptimization.noReferrerDomains 通配符匹配
 * @param urlStr - 圖片完整 URL
 */
export function shouldAddNoReferrer(urlStr: string): boolean {
	if (!urlStr.startsWith("http")) return false;
	const domains = siteConfig.imageOptimization?.noReferrerDomains || [];
	if (domains.length === 0) return false;
	try {
		const hostname = new URL(urlStr).hostname;
		return domains.some((pattern) => {
			const regexPattern = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
			return new RegExp(`^${regexPattern}$`).test(hostname);
		});
	} catch {
		return false;
	}
}
