import type { SiteConfig } from "../types/config";

// 定義站點語言
const SITE_LANG = "en"; // 語言代碼，例如：'en', 'zh_CN', 'ja' 等。

export const siteConfig: SiteConfig = {
	title: "Nekocat's Blog",
	subtitle: "Blog",
	siteURL: "https://blog.nekocat.cc/", // 請替換爲你的站點URL，以斜槓結尾
	siteStartDate: "2024-01-01", // 站點開始運行日期，用於站點統計組件計算運行天數

	lang: SITE_LANG,

	themeColor: {
		hue: 260, // 主題色的默認色相，範圍從 0 到 360。例如：紅色：0，青色：200，藍綠色：250，粉色：345
		fixed: true, // 對訪問者隱藏主題色選擇器
	},

	// 特色頁面開關配置（關閉未使用的頁面有助於提升 SEO，關閉後請記得在 navbarConfig 中移除對應鏈接）
	featurePages: {
		anime: false, // 番劇頁面開關
		diary: false, // 日記頁面開關
		friends: false, // 友鏈頁面開關
		projects: false, // 項目頁面開關
		skills: false, // 技能頁面開關
		timeline: false, // 時間線頁面開關
		albums: false, // 相冊頁面開關
		devices: false, // 設備頁面開關
		aiTools: false, // AI 工具頁面開關
	},

	// 頂欄標題配置
	navbarTitle: {
		// 顯示模式："text-icon" 顯示圖標+文本，"logo" 僅顯示Logo
		mode: "text-icon",
		// 頂欄標題文本
		text: "Nekocat",
		// 頂欄標題圖標路徑，默認使用 public/assets/home/home.webp
		icon: "assets/home/home.webp",
		// 網站Logo圖片路徑
		logo: "assets/home/default-logo.webp",
	},

	// 頁面自動縮放配置
	pageScaling: {
		enable: true, // 是否開啓自動縮放
		targetWidth: 2000, // 目標寬度，低於此寬度時開始縮放
	},

	bangumi: {
		userId: "your-bangumi-id", // 在此處設置你的Bangumi用戶ID，可以設置爲 "sai" 測試
		fetchOnDev: false, // 是否在開發環境下獲取 Bangumi 數據（默認 false），獲取前先執行 pnpm build 構建 json 文件
	},

	bilibili: {
		vmid: "your-bilibili-vmid", // 在此處設置你的Bilibili用戶ID (uid)，例如 "1129280784"
		fetchOnDev: false, // 是否在開發環境下獲取 Bilibili 數據（默認 false）
		coverMirror: "", // 封面圖片鏡像源（可選，如果需要使用鏡像源，例如 "https://images.weserv.nl/?url="）
		useWebp: true, // 是否使用WebP格式（默認 true）

		// bilibili 觀看進度配置說明(可選，如需配置仔細閱讀):
		// 1. 本地開發：請在 .env 文件中填寫 BILI_SESSDATA=your_SESSDATA
		// 2. 遠程構建：請在 GitHub 倉庫 Settings -> Secrets 中添加 BILI_SESSDATA
		// 注意：SESSDATA 爲賬號憑證，爲防止泄露，切記不可使用硬編碼。
		// 安全提示：如 SESSDATA 已泄露，請打開 B站手機端 —— 我的 —— 設置 —— 安全隱私 —— 登陸設備管理 —— 一鍵退登，銷燬已泄露的賬號憑證
	},

	anime: {
		mode: "local", // 番劇頁面模式："bangumi" 使用Bangumi API，"local" 使用本地配置，"bilibili" 使用Bilibili API
	},

	// 日記頁面 Memos API 地址，留空則使用靜態數據
	diaryApiUrl: "",

	// 文章列表佈局配置
	postListLayout: {
		// 默認佈局模式："list" 列表模式（單列布局），"grid" 網格模式（雙列布局）
		// 注意：如果側邊欄配置啓用了"both"雙側邊欄，則無法使用文章列表"grid"網格（雙列）佈局
		defaultMode: "list",
		// 是否啓用佈局切換功能
		enable: true,
		// 是否允許用戶切換佈局
		allowSwitch: true,
		// 文章列表頁分類導航條配置
		categoryBar: {
			enable: true, // 是否在文章列表頁顯示分類導航條
		},
	},

	// 標籤樣式配置
	tagStyle: {
		// 是否使用新樣式（懸停高亮樣式）還是舊樣式（外框常亮樣式）
		useNewStyle: false,
	},

	// 壁紙模式配置
	wallpaperMode: {
		// 默認壁紙模式：banner=頂部橫幅，fullscreen=全屏壁紙，none=無壁紙
		defaultMode: "banner",
		// 整體佈局方案切換按鈕顯示設置（默認："desktop"）
		// "off" = 不顯示
		// "mobile" = 僅在移動端顯示
		// "desktop" = 僅在桌面端顯示
		// "both" = 在所有設備上顯示
		showModeSwitchOnMobile: "both",
	},

	banner: {
		// 支持單張圖片或圖片數組，當數組長度 > 1 時自動啓用輪播
		src: {
			desktop: [
				"/assets/desktop-banner/background.gif",
			], // 桌面橫幅圖片
			mobile: [
				"/assets/desktop-banner/background.gif",
			], // 移動橫幅圖片
		}, // 使用本地橫幅圖片

		position: "center", // 等同於 object-position，僅支持 'top', 'center', 'bottom'。默認爲 'center'

		carousel: {
			enable: false,
			interval: 3,
			switchable: true,
		},

		waves: {
			enable: false,
			performanceMode: false,
			mobileDisable: false,
			switchable: true,
		},

		// PicFlow API支持(智能圖片API)
		imageApi: {
			enable: false, // 啓用圖片API
			url: "", // API地址
		},
		// 這裏需要使用PicFlow API的Text返回類型,所以我們需要format=text參數
		// 項目地址:https://github.com/matsuzaka-yuki/PicFlow-API
		// 請自行搭建API

		homeText: {
			enable: true,
			title: "Nekocat's Blog",
			switchable: true,

			subtitle: [
				"NYUST Computer Science Student",
				"Welcome to my blog",
			],
			typewriter: {
				enable: true, // 啓用副標題打字機效果

				speed: 100, // 打字速度（毫秒）
				deleteSpeed: 50, // 刪除速度（毫秒）
				pauseTime: 2000, // 完全顯示後的暫停時間（毫秒）
			},
		},

		credit: {
			enable: false, // 顯示橫幅圖片來源文本

			text: "Describe", // 要顯示的來源文本
			url: "", // （可選）原始藝術品或藝術家頁面的 URL 鏈接
		},

		navbar: {
			transparentMode: "semifull", // 導航欄透明模式："semi" 半透明加圓角，"full" 完全透明，"semifull" 動態透明
		},
	},
	toc: {
		enable: true, // 總開關，啓用目錄功能
		mobileTop: true, // 手機端頂部 TOC 按鈕
		desktopSidebar: true, // 電腦端右側邊欄 TOC
		floating: true, // 懸浮 TOC 按鈕
		depth: 2, // 目錄深度，1-6，1 表示只顯示 h1 標題，2 表示顯示 h1 和 h2 標題，依此類推
		useJapaneseBadge: true, // 使用日語假名標記（あいうえお...）代替數字，開啓後會將 1、2、3... 改爲 あ、い、う...
	},
	showCoverInContent: true, // 在文章內容頁顯示文章封面
	generateOgImages: false, // 啓用生成OpenGraph圖片功能,注意開啓後要渲染很長時間，不建議本地調試的時候開啓
	favicon: [
		{
			src: '/favicon/favicon.ico',
		},
	],

	// 字體現在通過 astro.config.mjs 的 fonts 選項配置（Astro Font API）
	showLastModified: true, // 控制"上次編輯"卡片顯示的開關
	pageProgressBar: {
		enable: true, // 啓用頁面頂部進度條
		height: 3, // 進度條高度 3px
		duration: 6000, // 動畫時長 6s
	},

	thirdPartyAnalytics: {
		enable: false, // 是否啓用第三方統計（Microsoft Clarity），默認關閉，啓用可能影響 Lighthouse 評分
		clarityId: "", // Clarity 項目 ID
	},
	// 卡片樣式配置
	card: {
		border: true, // 開啓卡片邊框和微陰影，讓卡片更有立體感
		followTheme: false, // 卡片背景跟隨主題色相
	},
	// 圖片優化配置
	imageOptimization: {
		formats: "webp", // 圖片輸出格式："avif"、"webp" 或 "both"（avif+webp，最優質量但構建更慢）
		quality: 85, // 圖片質量，推薦 70-85
		noReferrerDomains: [
			// 需要添加 referrerpolicy="no-referrer" 的域名（支持通配符）
			"*.hdslb.com", // Bilibili CDN
		],
	},
};

export { SITE_LANG };
