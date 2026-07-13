import type { AnnouncementConfig } from "../types/config";

// 公告欄配置
export const announcementConfig: AnnouncementConfig = {
	title: "", // 公告標題，填空使用i18n字符串Key.announcement
	content: "", // 公告內容
	closable: true, // 允許用戶關閉公告
	link: {
		enable: false, // 啓用鏈接
		text: "", // 鏈接文本
		url: "", // 鏈接 URL
		external: false, // 內部鏈接
	},
};
