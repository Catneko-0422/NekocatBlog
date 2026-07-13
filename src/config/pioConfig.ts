import type { PioConfig } from "../types/config";

// Pio 看板娘配置
export const pioConfig: PioConfig = {
	enable: true, // 啓用看板娘
	models: ["/pio/models/NOIR/noir.model3.json"], // 默認模型路徑
	position: "left", // 模型位置
	width: 280, // 默認寬度
	height: 250, // 默認高度
	mode: "draggable", // 默認爲可拖拽模式
	hiddenOnMobile: true, // 默認在移動設備上隱藏
	hideAboutMenu: false, // 隱藏內置 About 菜單按鈕
	dialog: {
		welcome: "Welcome to Nekocat's Blog!",
		touch: [
			"What are you doing?",
			"Stop touching me!",
		],
		home: "Click here to go back to homepage!",
		skin: ["Want to see my new outfit?"],
		close: "See you next time~",
		link: "https://github.com/Catneko-0422",
	},
};
