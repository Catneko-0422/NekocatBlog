import getReadingTime from "reading-time";
import { visit } from "unist-util-visit";

export function remarkContent() {
	return (tree, { data }) => {
		// --- 安全性檢查：確保 data.astro 存在 ---
		if (!data.astro) {
			data.astro = {};
		}
		if (!data.astro.frontmatter) {
			data.astro.frontmatter = {};
		}

		let fullText = ""; // 用於計算字數（包含全文）
		let excerpt = ""; // 用於存放摘要

		// 定義“手動摘要”的分隔符正則 (支持 或 ，忽略大小寫)
		const moreTagRegex = /<!--\s*more\s*-->/i;
		let moreTagIndex = -1;

		// --- 遍歷 AST 查找手動摘要分隔符 ---
		if (tree.children && Array.isArray(tree.children)) {
			moreTagIndex = tree.children.findIndex(
				(node) =>
					node.type === "html" && node.value && moreTagRegex.test(node.value),
			);
		}

		// --- 計算摘要 (Excerpt) ---
		if (moreTagIndex !== -1) {
			// 提取它之前的所有內容
			const excerptNodes = tree.children.slice(0, moreTagIndex);
			excerpt = excerptNodes.map(getNodeText).join("");
		} else {
			// 提取第一個非空的段落
			if (tree.children && Array.isArray(tree.children)) {
				for (const node of tree.children) {
					if (node.type === "paragraph") {
						const text = getNodeText(node);
						// 確保提取出的文本不是僅包含空白字符
						if (text && text.trim().length > 0) {
							excerpt = text;
							break;
						}
					}
				}
			}
		}

		// --- 計算閱讀時間 (Reading Time) ---
		visit(tree, (node) => {
			// 跳過代碼塊，不計入字數
			if (node.type === "code" || node.type === "inlineCode") {
				return "skip";
			}

			// 累加文本
			if (node.type === "text" && node.value) {
				fullText += `${node.value} `;
			}
		});

		// 針對 CJK (中日韓) 字符的字數統計優化
		const cjkPattern =
			/[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af\u3000-\u303f\uff00-\uffef]/g;

		const cjkMatches = fullText.match(cjkPattern);
		const cjkCount = cjkMatches ? cjkMatches.length : 0;

		// 將 CJK 字符替換爲空格，避免粘連，然後計算非 CJK (英文/數字) 單詞數
		const nonCjkText = fullText.replace(cjkPattern, " ");
		const nonCjkStats = getReadingTime(nonCjkText);

		const totalWords = nonCjkStats.words + cjkCount;

		// 估算時間：英文 200詞/分，中文 400字/分
		const minutes = nonCjkStats.words / 200 + cjkCount / 400;

		// --- 注入數據到 Frontmatter ---
		data.astro.frontmatter.excerpt = excerpt;
		data.astro.frontmatter.minutes = Math.max(1, Math.round(minutes));
		data.astro.frontmatter.words = totalWords;
	};
}

/**
 * 輔助函數：遞歸從節點中提取純文本
 */
function getNodeText(node) {
	// 安全性檢查
	if (!node) {
		return "";
	}

	// 如果是文本節點，直接返回
	if (node.type === "text") {
		return node.value || "";
	}

	// 如果是圖片，提取 alt 文本 (可選，這裏選擇提取以保持語義)
	if (node.type === "image") {
		return node.alt || "";
	}

	// 跳過代碼塊和 HTML 標籤
	if (
		node.type === "code" ||
		node.type === "inlineCode" ||
		node.type === "html"
	) {
		return "";
	}

	// 遞歸處理子節點
	if (node.children && Array.isArray(node.children)) {
		return node.children.map(getNodeText).join("");
	}

	return "";
}
