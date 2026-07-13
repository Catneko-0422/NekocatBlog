import type { RelatedPostsConfig } from "../types/config";

// 相關文章配置
export const relatedPostsConfig: RelatedPostsConfig = {
	enable: true,
	maxCount: 5,

	// 評分權重配置 — 各維度權重值歸一化後使用，無需手動湊到 1.0
	// 調大某個權重 = 該維度在排序中更重要；設爲 0 = 忽略該維度
	weights: {
		tagSimilarity: 1.0, // 標籤 Jaccard 相似度（權重最高，核心信號）
		titleSimilarity: 0.6, // 標題分詞 Jaccard 相似度
		descriptionSimilarity: 0.4, // 描述文本分詞相似度
		categoryMatch: 0.3, // 同分類加分
		freshness: 0.2, // 時間新鮮度（越新越高分）
		tagIDF: true, // 啓用 IDF 加權：稀有標籤匹配權重更高，常見標籤權重更低
	},

	// 新鮮度半衰期（天）：發表日期距今多少天，新鮮度分數衰減到一半
	// 180 ≈ 6個月，90 ≈ 3個月（偏好近期文章），365 ≈ 1年（對時間不敏感）
	freshnessHalfLife: 180,
};
