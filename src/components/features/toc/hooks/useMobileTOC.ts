/**
 * MobileTOC 自定義鉤子
 * 處理移動端目錄的狀態管理和交互邏輯
 */

export interface TOCItem {
	id: string;
	text: string;
	level: number;
	badge?: string;
}

export interface PostItem {
	title: string;
	url: string;
	category?: string;
	pinned?: boolean;
}

export interface TOCConfig {
	useJapaneseBadge: boolean;
	depth: number;
}

/**
 * 生成目錄項
 */
export function generateTOCItems(config: TOCConfig): TOCItem[] {
	const japaneseHiragana = [
		"ア",
		"イ",
		"ウ",
		"エ",
		"オ",
		"カ",
		"キ",
		"ク",
		"ケ",
		"コ",
		"サ",
		"シ",
		"ス",
		"セ",
		"ソ",
		"タ",
		"チ",
		"ツ",
		"テ",
		"ト",
	];

	const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
	const items: TOCItem[] = [];
	let h1Count = 0;

	headings.forEach((heading) => {
		if (!heading.id) {
			return;
		}

		const level = Number.parseInt(heading.tagName.charAt(1), 10);

		// 根據 depth 配置過濾標題
		if (level > config.depth) {
			return;
		}

		const text = (heading.textContent || "").replace(/#+\s*$/, "");
		let badge = "";

		// 只爲 H1 標題生成 badge
		if (level === 1) {
			h1Count++;
			if (config.useJapaneseBadge && h1Count - 1 < japaneseHiragana.length) {
				badge = japaneseHiragana[h1Count - 1];
			} else {
				badge = h1Count.toString();
			}
		}

		items.push({ id: heading.id, text, level, badge });
	});

	return items;
}

/**
 * 生成文章列表項（首頁使用）
 */
export function generatePostItems(): PostItem[] {
	const postCards = document.querySelectorAll(".card-base");
	const items: PostItem[] = [];

	postCards.forEach((card) => {
		const titleLink = card.querySelector('a[href*="/posts/"].transition.group');
		const categoryLink = card.querySelector('a[href*="/categories/"].link-lg');
		const pinnedIcon = titleLink?.querySelector('svg[data-icon="mdi:pin"]');

		if (titleLink) {
			const href = titleLink.getAttribute("href");
			const title = titleLink.textContent?.replace(/\s+/g, " ").trim() || "";
			const category = categoryLink?.textContent?.trim() || "";
			const pinned = !!pinnedIcon;

			if (href && title) {
				items.push({ title, url: href, category, pinned });
			}
		}
	});

	return items;
}

/**
 * 檢查是否爲首頁
 */
export function checkIsHomePage(): boolean {
	const pathname = window.location.pathname;
	return pathname === "/" || pathname === "" || /^\/\d+\/?$/.test(pathname);
}

/**
 * 更新活動標題（基於滾動位置）
 */
export function updateActiveHeading(): string {
	const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
	const scrollTop = window.scrollY;
	const offset = 100;

	let currentActiveId = "";
	headings.forEach((heading) => {
		if (heading.id) {
			const elementTop = (heading as HTMLElement).offsetTop - offset;
			if (scrollTop >= elementTop) {
				currentActiveId = heading.id;
			}
		}
	});

	return currentActiveId;
}

/**
 * 滾動到指定標題
 */
export function scrollToHeading(id: string, offset = 80): void {
	const element = document.getElementById(id);
	if (element) {
		const elementPosition = element.offsetTop - offset;
		window.scrollTo({
			top: elementPosition,
			behavior: "smooth",
		});
	}
}

/**
 * 獲取 TOC 配置
 */
export function getTOCConfig(): TOCConfig {
	return {
		useJapaneseBadge: window.siteConfig?.toc?.useJapaneseBadge ?? false,
		depth: window.siteConfig?.toc?.depth ?? 3,
	};
}
