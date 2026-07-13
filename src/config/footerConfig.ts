import type { FooterConfig } from "../types/config";

// 頁腳配置
export const footerConfig: FooterConfig = {
	enable: false, // 是否啓用Footer HTML注入功能
	customHtml: "", // HTML格式的自定義頁腳信息，例如備案號等，默認留空
	// 也可以直接編輯 FooterConfig.html 文件來添加備案號等自定義內容
	// 注意：若 customHtml 不爲空，則使用 customHtml 中的內容；若 customHtml 留空，則使用 FooterConfig.html 文件中的內容
	// FooterConfig.html 可能會在未來的某個版本棄用
};
