import type { PermalinkConfig } from "../types/config";

// Permalink 固定鏈接配置
export const permalinkConfig: PermalinkConfig = {
	enable: false, // 是否啓用全局 permalink 功能，關閉時使用默認的文件名作爲鏈接
	/**
	 * permalink 格式模板
	 * 支持的佔位符：
	 * - %year% : 4位年份 (2024)
	 * - %monthnum% : 2位月份 (01-12)
	 * - %day% : 2位日期 (01-31)
	 * - %hour% : 2位小時 (00-23)
	 * - %minute% : 2位分鐘 (00-59)
	 * - %second% : 2位秒數 (00-59)
	 * - %post_id% : 文章序號（按發佈時間升序排列，最早的文章爲1）
	 * - %postname% : 文章文件名（slug，通常爲全小寫）
	 * - %raw_postname% : 文章原始文件名（保留大小寫）
	 * - %category% : 分類名（無分類時爲 "uncategorized"）
	 *
	 * 示例：
	 * - "%year%-%monthnum%-%postname%" => "/2024-12-my-post/"
	 * - "%post_id%-%postname%" => "/42-my-post/"
	 * - "%category%-%postname%" => "/tech-my-post/"
	 * - "%year%/%monthnum%/%day%/%postname%" => "/2024/12/01/my-post/"
	 *
	 * 注意：支持使用斜槓 "/" 構建嵌套路徑。
	 */
	format: "%postname%", // 默認使用文件名
};
