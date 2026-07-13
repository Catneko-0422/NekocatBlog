import type { MusicPlayerConfig } from "../types/config";

// 音樂播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
	enable: true, // 啓用音樂播放器功能
	showFloatingPlayer: true, // 顯示懸浮播放器 UI
	floatingEntryMode: "fab", // 懸浮入口模式："default" 爲獨立懸浮播放器，"fab" 爲集成到通用 FAB 組
	mode: "local", // 音樂播放器模式，可選 "local" 或 "meting"
	meting_api: "", // Meting API 地址
	id: "", // 歌單ID
	server: "netease", // 音樂源服務器
	type: "playlist", // 播單類型
};
