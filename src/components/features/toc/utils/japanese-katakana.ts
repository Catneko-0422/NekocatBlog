/**
 * 日語片假名字符集
 * 用於 TOC 徽章顯示
 */

/**
 * 完整的日語片假名字符集（46 個字符）
 * 按五十音圖順序排列
 */
export const JAPANESE_KATAKANA = [
	// あ行
	"ア",
	"イ",
	"ウ",
	"エ",
	"オ",
	// か行
	"カ",
	"キ",
	"ク",
	"ケ",
	"コ",
	// さ行
	"サ",
	"シ",
	"ス",
	"セ",
	"ソ",
	// た行
	"タ",
	"チ",
	"ツ",
	"テ",
	"ト",
	// な行
	"ナ",
	"ニ",
	"ヌ",
	"ネ",
	"ノ",
	// は行
	"ハ",
	"ヒ",
	"フ",
	"ヘ",
	"ホ",
	// ま行
	"マ",
	"ミ",
	"ム",
	"メ",
	"モ",
	// や行
	"ヤ",
	"ユ",
	"ヨ",
	// ら行
	"ラ",
	"リ",
	"ル",
	"レ",
	"ロ",
	// わ行
	"ワ",
	"ヲ",
	"ン",
] as const;

export type JapaneseKatakanaChar = (typeof JAPANESE_KATAKANA)[number];

/**
 * 獲取 TOC 徽章文本
 * @param index - 索引（從 0 開始）
 * @param useJapanese - 是否使用日語字符
 * @returns 徽章文本
 */
export function getKatakanaBadge(index: number, useJapanese: boolean): string {
	if (useJapanese && index < JAPANESE_KATAKANA.length) {
		return JAPANESE_KATAKANA[index];
	}
	return (index + 1).toString();
}

/**
 * 獲取可用的日語字符數量
 */
export const KATAKANA_COUNT = JAPANESE_KATAKANA.length;
