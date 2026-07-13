import type { SakuraConfig } from "../types/config";

export const sakuraConfig: SakuraConfig = {
	enable: false,
	switchable: true,
	sakuraNum: 21,
	limitTimes: -1,
	size: {
		min: 0.5, // 櫻花最小尺寸倍數
		max: 1.1, // 櫻花最大尺寸倍數
	},
	opacity: {
		min: 0.3, // 櫻花最小不透明度
		max: 0.9, // 櫻花最大不透明度
	},
	speed: {
		horizontal: {
			min: -1.7, // 水平移動速度最小值
			max: -1.2, // 水平移動速度最大值
		},
		vertical: {
			min: 1.5, // 垂直移動速度最小值
			max: 2.2, // 垂直移動速度最大值
		},
		rotation: 0.03, // 旋轉速度
		fadeSpeed: 0.03, // 消失速度，不應大於最小不透明度
	},
	zIndex: 100, // 層級，確保櫻花在合適的層級顯示
};
