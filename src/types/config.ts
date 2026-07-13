import type {
	DARK_MODE,
	LIGHT_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "../constants/constants";

export interface SiteConfig {
	title: string;
	subtitle: string;
	siteURL: string; // 站點URL，以斜槓結尾，例如：https://mizuki.mysqil.com/
	keywords?: string[]; // 站點關鍵詞，用於生成 <meta name="keywords">
	siteStartDate?: string; // 站點開始日期，格式：YYYY-MM-DD，用於計算運行天數

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
	};

	// 特色頁面開關配置
	featurePages: {
		anime: boolean; // 番劇頁面開關
		diary: boolean; // 日記頁面開關
		friends: boolean; // 友鏈頁面開關
		projects: boolean; // 項目頁面開關
		skills: boolean; // 技能頁面開關
		timeline: boolean; // 時間線頁面開關
		albums: boolean; // 相冊頁面開關
		devices: boolean; // 設備頁面開關
		aiTools: boolean; // AI 工具頁面開關
	};

	// 文章列表佈局配置
	postListLayout: {
		defaultMode: "list" | "grid"; // 默認佈局模式：list=列表模式，grid=網格模式
		enable: boolean; // 是否啓用佈局切換功能
		allowSwitch: boolean; // 是否允許用戶切換佈局
		categoryBar?: {
			enable: boolean; // 是否在文章列表頁顯示分類導航條
		};
	};

	// 頂欄標題配置
	navbarTitle?: {
		mode?: "text-icon" | "logo"; // 顯示模式："text-icon" 顯示圖標+文本，"logo" 僅顯示Logo
		text: string; // 頂欄標題文本
		icon?: string; // 頂欄標題圖標路徑
		logo?: string; // 網站Logo圖片路徑
	};

	// 頁面自動縮放配置
	pageScaling?: {
		enable: boolean; // 是否開啓自動縮放
		targetWidth?: number; // 目標寬度，低於此寬度時開始縮放
	};

	// 字體現在通過 astro.config.mjs 的 fonts 選項配置（Astro Font API）

	// 添加bangumi配置
	bangumi?: {
		userId?: string; // Bangumi用戶ID
		fetchOnDev?: boolean;
	};

	// 添加bilibili配置
	bilibili?: {
		vmid?: string; // Bilibili用戶ID (vmid)
		fetchOnDev?: boolean; // 是否在開發環境下獲取 Bilibili 數據
		coverMirror?: string; // 封面圖片鏡像源（可選，默認爲空字符串）
		useWebp?: boolean; // 是否使用WebP格式（默認 true）
	};

	// 添加番劇頁面配置
	anime?: {
		mode?: "bangumi" | "local" | "bilibili"; // 番劇頁面模式
	};

	// 日記頁面 Memos API 地址，客戶端 fetch 獲取動態數據
	diaryApiUrl?: string;

	// 標籤樣式配置
	tagStyle?: {
		useNewStyle?: boolean; // 是否使用新樣式（懸停高亮樣式）還是舊樣式（外框常亮樣式）
	};

	// 壁紙模式配置
	wallpaperMode: {
		defaultMode: "banner" | "fullscreen" | "overlay" | "none";
		showModeSwitchOnMobile?: "off" | "mobile" | "desktop" | "both";
	};

	banner: {
		src:
			| string
			| string[]
			| {
					desktop?: string | string[];
					mobile?: string | string[];
			  };
		position?: "top" | "center" | "bottom";
		carousel?: {
			enable: boolean;
			interval: number;
			switchable?: boolean;
		};
		waves?: {
			enable: boolean;
			performanceMode?: boolean;
			mobileDisable?: boolean;
			switchable?: boolean;
		};
		imageApi?: {
			enable: boolean;
			url: string;
		};
		homeText?: {
			enable: boolean;
			title?: string;
			subtitle?: string | string[];
			typewriter?: {
				enable: boolean;
				speed: number;
				deleteSpeed: number;
				pauseTime: number;
			};
			switchable?: boolean;
		};
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
		navbar?: {
			transparentMode?: "semi" | "full" | "semifull"; // 導航欄透明模式
		};
	};
	toc: {
		enable: boolean; // 總開關，false 時所有 TOC 都不顯示
		mobileTop: boolean; // 手機端頂部 TOC 按鈕
		desktopSidebar: boolean; // 電腦端右側邊欄 TOC
		floating: boolean; // 懸浮 TOC 按鈕
		depth: 1 | 2 | 3;
		useJapaneseBadge?: boolean; // 使用日語假名標記（あいうえお...）代替數字
	};
	showCoverInContent: boolean; // 控制文章封面在文章內容頁顯示的開關
	generateOgImages: boolean;
	favicon: Favicon[];
	showLastModified: boolean; // 控制"上次編輯"卡片顯示的開關
	pageProgressBar?: PageProgressBarConfig; // 頁面頂部進度條配置
	thirdPartyAnalytics?: ThirdPartyAnalyticsConfig; // 第三方統計配置

	// 卡片樣式配置
	card?: {
		border: boolean; // 是否開啓卡片邊框和微陰影立體效果
		followTheme?: boolean; // 是否讓卡片風格跟隨主題色相
	};

	// 圖片優化配置
	imageOptimization?: {
		formats?: "avif" | "webp" | "both"; // 圖片輸出格式：avif、webp 或 both（avif+webp）
		quality?: number; // 圖片質量 1-100，推薦 70-85
		noReferrerDomains?: string[]; // 需要添加 no-referrer 的域名（支持通配符，如 "*.hdslb.com"）
	};
}

// 圖片格式類型
export type ImageFormat = "avif" | "webp" | "png" | "jpg" | "jpeg" | "gif";

// 響應式圖片佈局類型
export type ResponsiveImageLayout = "constrained" | "full-width" | "none";

export interface Favicon {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
}

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Anime = 4,
	Diary = 5,
	Albums = 6,
	Projects = 7,
	Skills = 8,
	Timeline = 9,
	AITools = 10,
}

export interface NavBarLink {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // 菜單項圖標
	children?: (NavBarLink | LinkPreset)[]; // 支持子菜單，可以是NavBarLink或LinkPreset
}

export interface NavBarConfig {
	links: (NavBarLink | LinkPreset)[];
}

export interface ProfileConfig {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
	typewriter?: {
		enable: boolean; // 是否啓用打字機效果
		speed?: number; // 打字速度（毫秒）
	};
}

export interface LicenseConfig {
	enable: boolean;
	name: string;
	url: string;
}

// Permalink 配置
export interface PermalinkConfig {
	enable: boolean; // 是否啓用全局 permalink 功能
	/**
	 * permalink 格式模板
	 * 支持的佔位符：
	 * - %year% : 4位年份 (2024)
	 * - %monthnum% : 2位月份 (01-12)
	 * - %day% : 2位日期 (01-31)
	 * - %hour% : 2位小時 (00-23)
	 * - %minute% : 2位分鐘 (00-59)
	 * - %second% : 2位秒數 (00-59)
	 * - %post_id% : 文章序號（按發佈時間升序排列）
	 * - %postname% : 文章文件名（slug）
	 * - %category% : 分類名（無分類時爲 "uncategorized"）
	 *
	 * 示例：
	 * - "%year%-%monthnum%-%postname%" => "2024-12-my-post"
	 * - "%post_id%-%postname%" => "42-my-post"
	 * - "%category%-%postname%" => "tech-my-post"
	 *
	 * 注意：不支持斜槓 "/"，所有生成的鏈接都在根目錄下
	 */
	format: string;
}

// 評論配置

export interface CommentConfig {
	enable: boolean; // 是否啓用評論功能
	system?: "twikoo" | "giscus"; // 評論系統選擇
	twikoo?: TwikooConfig;
	giscus?: GiscusConfig;
}

export interface GiscusConfig {
	repo: string;
	repoId: string;
	category: string;
	categoryId: string;
	mapping: string;
	strict: string;
	reactionsEnabled: string;
	emitMetadata: string;
	inputPosition: string;
	theme: string;
	lang: string;
	loading: string;
}

interface TwikooConfig {
	envId: string;
	region?: string;
	lang?: string;
}

export type LIGHT_DARK_MODE = typeof LIGHT_MODE | typeof DARK_MODE;

export type WALLPAPER_MODE =
	| typeof WALLPAPER_BANNER
	| typeof WALLPAPER_FULLSCREEN
	| typeof WALLPAPER_OVERLAY
	| typeof WALLPAPER_NONE;

export interface BlogPostData {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	pinned?: boolean;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
}

export interface ExpressiveCodeConfig {
	theme: string;
	hideDuringThemeTransition?: boolean; // 是否在主題切換時隱藏代碼塊
}

export interface AnnouncementConfig {
	// enable屬性已移除，現在通過sidebarLayoutConfig統一控制
	title?: string; // 公告欄標題
	content: string; // 公告欄內容
	icon?: string; // 公告欄圖標
	type?: "info" | "warning" | "success" | "error"; // 公告類型
	closable?: boolean; // 是否可關閉
	link?: {
		enable: boolean; // 是否啓用鏈接
		text: string; // 鏈接文字
		url: string; // 鏈接地址
		external?: boolean; // 是否外部鏈接
	};
}

export interface MusicPlayerConfig {
	enable: boolean; // 是否啓用音樂播放器功能
	showFloatingPlayer: boolean; // 是否顯示懸浮播放器 UI
	floatingEntryMode?: "default" | "fab"; // 懸浮入口模式：默認獨立播放器或集成到 FAB 組
	mode: "meting" | "local"; // 音樂播放器模式
	meting_api: string; // Meting API 地址
	id: string; // 歌單ID
	server: string; // 音樂源服務器
	type: string; // 音樂類型
}

export interface FooterConfig {
	enable: boolean; // 是否啓用Footer HTML注入功能
	customHtml?: string; // 自定義HTML內容，用於添加備案號等信息
}

// 組件配置類型定義
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "toc"
	| "card-toc" // 卡片式目錄組件
	| "music-player"
	| "music-sidebar"
	| "pio" // 添加 pio 組件類型
	| "site-stats" // 站點統計組件
	| "calendar" // 日曆組件
	| "custom";

export interface WidgetComponentConfig {
	type: WidgetComponentType; // 組件類型
	position: "top" | "sticky"; // 組件位置：頂部固定區域或粘性區域
	class?: string; // 自定義CSS類名
	style?: string; // 自定義內聯樣式
	animationDelay?: number; // 動畫延遲時間（毫秒）
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定設備上隱藏
		collapseThreshold?: number; // 摺疊閾值
	};
	customProps?: Record<string, unknown>; // 自定義屬性，用於擴展組件功能
}

export interface SidebarLayoutConfig {
	properties: WidgetComponentConfig[]; // 組件配置列表
	components: {
		left: WidgetComponentType[];
		right: WidgetComponentType[];
		drawer: WidgetComponentType[];
	};
	defaultAnimation: {
		enable: boolean; // 是否啓用默認動畫
		baseDelay: number; // 基礎延遲時間（毫秒）
		increment: number; // 每個組件遞增的延遲時間（毫秒）
	};
	responsive: {
		breakpoints: {
			mobile: number; // 移動端斷點（px）
			tablet: number; // 平板端斷點（px）
			desktop: number; // 桌面端斷點（px）
		};
	};
}

export interface SakuraConfig {
	enable: boolean;
	switchable?: boolean;
	sakuraNum: number;
	limitTimes: number;
	size: {
		min: number; // 櫻花最小尺寸倍數
		max: number; // 櫻花最大尺寸倍數
	};
	opacity: {
		min: number; // 櫻花最小不透明度
		max: number; // 櫻花最大不透明度
	};
	speed: {
		horizontal: {
			min: number; // 水平移動速度最小值
			max: number; // 水平移動速度最大值
		};
		vertical: {
			min: number; // 垂直移動速度最小值
			max: number; // 垂直移動速度最大值
		};
		rotation: number; // 旋轉速度
		fadeSpeed: number; // 消失速度
	};
	zIndex: number; // 層級，確保櫻花在合適的層級顯示
}

export interface FullscreenWallpaperConfig {
	enable?: boolean;
	src:
		| string
		| string[]
		| {
				desktop?: string | string[];
				mobile?: string | string[];
		  };
	position?: "top" | "center" | "bottom";
	carousel?: {
		enable: boolean;
		interval: number;
	};
	zIndex?: number;
	opacity?: number;
	blur?: number;
	switchable?: boolean;
	overlay?: {
		opacity?: number;
		blur?: number;
		cardOpacity?: number;
		switchable?:
			| boolean
			| {
					opacity?: boolean;
					blur?: boolean;
					cardOpacity?: boolean;
			  };
	};
	fullscreen?: {
		switchable?:
			| boolean
			| {
					opacity?: boolean;
					blur?: boolean;
			  };
	};
}

/**
 * Pio 看板娘配置
 */
export interface PioConfig {
	enable: boolean; // 是否啓用看板娘
	models?: string[]; // 模型文件路徑數組（支持 .model.json 和 .model3.json）
	position?: "left" | "right"; // 看板娘位置
	width?: number; // 看板娘寬度
	height?: number; // 看板娘高度
	mode?: "static" | "fixed" | "draggable"; // 展現模式
	hiddenOnMobile?: boolean; // 是否在移動設備上隱藏
	hideAboutMenu?: boolean; // 是否隱藏內置 About 菜單按鈕
	dialog?: {
		welcome?: string | string[]; // 歡迎詞
		touch?: string | string[]; // 觸摸提示
		home?: string; // 首頁提示
		skin?: [string, string]; // 換裝提示 [切換前, 切換後]
		close?: string; // 關閉提示
		link?: string; // 關於鏈接
		custom?: {
			selector: string; // CSS選擇器
			type: "read" | "link"; // 類型
			text?: string; // 自定義文本
		}[];
	};
	tips?: {
		welcomeMessage?: string[]; // 歡迎語
		messages?: string[]; // 循環提示內容
		duration?: number; // 每條 tips 展示時長（ms）
		interval?: number; // tips 循環間隔（ms）
	};
	menus?: {
		items?: {
			icon?: string; // Iconify 圖標名稱
			label: string; // 無障礙標題
			action: string; // 預定義動作名稱
		}[];
		align?: "left" | "right"; // 菜單對齊方式
	};
}

/**
 * 分享組件配置
 */
export interface ShareConfig {
	enable: boolean; // 是否啓用分享功能
}

/**
 * 相關文章組件配置
 */
export interface RelatedPostsConfig {
	enable: boolean; // 是否啓用相關文章功能
	maxCount: number; // 相關文章數量
	weights?: RelatedPostsWeights; // 評分權重配置
	freshnessHalfLife?: number; // 新鮮度半衰期（天），默認 180
}

// 相關文章評分權重配置（所有權重歸一化後使用）
export interface RelatedPostsWeights {
	tagSimilarity?: number; // 標籤相似度權重，默認 1.0
	titleSimilarity?: number; // 標題相似度權重，默認 0.6
	descriptionSimilarity?: number; // 描述相似度權重，默認 0.4
	categoryMatch?: number; // 分類匹配權重，默認 0.3
	freshness?: number; // 時間新鮮度權重，默認 0.2
	tagIDF?: boolean; // 是否啓用標籤 IDF 加權（稀有標籤權重更高），默認 true
}

/**
 * 隨機文章組件配置
 */
export interface RandomPostsConfig {
	enable: boolean; // 是否啓用隨機文章功能
	maxCount: number; // 隨機文章數量
}

/**
 * 頁面頂部進度條配置
 */
export interface PageProgressBarConfig {
	enable: boolean; // 是否啓用頁面頂部進度條
	height?: number; // 進度條高度，默認 3px
	duration?: number; // 動畫時長，默認 8000ms
}

/**
 * 第三方統計配置（可能影響 Lighthouse 評分）
 */
export interface ThirdPartyAnalyticsConfig {
	enable: boolean; // 是否啓用第三方統計（Microsoft Clarity），默認關閉
	clarityId?: string; // Clarity 項目 ID
}
