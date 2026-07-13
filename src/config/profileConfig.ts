import type { ProfileConfig } from "../types/config";

// 個人資料配置
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg", // 相對於 /src 目錄。如果以 '/' 開頭，則相對於 /public 目錄
	name: "Nekocat",
	bio: "NYUST Computer Science Student",
	typewriter: {
		enable: false, // 啓用個人簡介打字機效果
		speed: 80, // 打字速度（毫秒）
	},
	links: [
		{
			name: "nekocat.cc",
			icon: "material-symbols:language",
			url: "https://www.nekocat.cc",
		},
		{
			name: "Facebook",
			icon: "fa7-brands:facebook",
			url: "https://www.facebook.com/neko.cat.863674",
		},
		{
			name: "Instagram",
			icon: "fa7-brands:instagram",
			url: "https://www.instagram.com/neko._cat422/",
		},
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/Catneko-0422",
		},
		{
			name: "Email",
			icon: "material-symbols:mail-outline",
			url: "mailto:linyian0422@gmail.com",
		},
	],
};
