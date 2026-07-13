import type { CommentConfig } from "../types/config";
import { SITE_LANG } from "./siteConfig";

// 評論系統配置
export const commentConfig: CommentConfig = {
	enable: false, // 啓用評論功能。當設置爲 false 時，評論組件將不會顯示在文章區域。
	system: "twikoo", // 評論系統選擇: "twikoo" | "giscus"
	twikoo: {
		envId: "https://twikoo.vercel.app",
		lang: SITE_LANG,
	},
	giscus: {
		repo: "your-github-username/your-repo-name",
		repoId: "your-repo-id",
		category: "Announcements",
		categoryId: "your-category-id",
		mapping: "pathname",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "top",
		theme: "preferred_color_scheme",
		lang: SITE_LANG,
		loading: "lazy",
	},
};
