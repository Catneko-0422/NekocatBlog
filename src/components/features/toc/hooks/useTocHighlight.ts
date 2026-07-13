/**
 * useTocHighlight - TOC 高亮計算 hook
 * 處理活動標題高亮計算邏輯
 */

/**
 * 查找當前活動標題索引（基於滾動位置）
 */
export function findActiveHeadingIndex(
	headings: HTMLElement[],
	scrollY?: number,
	offsetTop = 150,
): number {
	const scroll = scrollY ?? window.scrollY;
	let activeIndex = -1;

	for (let i = 0; i < headings.length; i++) {
		const heading = headings[i];
		const rect = heading.getBoundingClientRect().top + scroll;

		if (rect < scroll + offsetTop) {
			activeIndex = i;
		} else {
			break;
		}
	}

	return activeIndex;
}

/**
 * 查找活動標題（基於 IntersectionObserver）
 */
export function findActiveHeadingByObserver(
	entries: IntersectionObserverEntry[],
): string | null {
	for (const entry of entries) {
		if (entry.isIntersecting && entry.target.id) {
			return entry.target.id;
		}
	}
	return null;
}

/**
 * 計算活動標題範圍（用於 SidebarTOC 的多級高亮）
 */
export function calculateActiveHeadingRange(activeStates: boolean[]): {
	min: number;
	max: number;
} {
	let min = activeStates.length - 1;
	let max = -1;

	for (let i = activeStates.length - 1; i >= 0; i--) {
		if (activeStates[i]) {
			min = Math.min(min, i);
			max = Math.max(max, i);
		}
	}

	return { min, max };
}

/**
 * 創建 IntersectionObserver 用於跟蹤標題可見性
 */
export function createHeadingVisibilityObserver(
	onVisibilityChange: (id: string | null, isVisible: boolean) => void,
	options: IntersectionObserverInit = {},
): IntersectionObserver {
	const defaultOptions: IntersectionObserverInit = {
		rootMargin: "-80px 0px -80% 0px",
		threshold: 0,
		...options,
	};

	return new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const id = (entry.target as HTMLElement)?.id;
			if (id) {
				onVisibilityChange(id, entry.isIntersecting);
			}
		});
	}, defaultOptions);
}

/**
 * 判斷值是否在範圍內
 */
export function isInRange(value: number, min: number, max: number): boolean {
	return min < value && value < max;
}

/**
 * 判斷元素是否在視口中
 */
export function isElementInViewport(
	element: HTMLElement,
	offsetTop = 0,
	offsetBottom = 0,
): boolean {
	const rect = element.getBoundingClientRect();
	const windowHeight = window.innerHeight;
	return (
		rect.top + offsetTop >= 0 && rect.bottom - offsetBottom <= windowHeight
	);
}

/**
 * 計算 fallback 高亮（當 IntersectionObserver 不工作時）
 */
export function calculateFallbackActiveHeading(
	sections: HTMLElement[],
	activeStates: boolean[],
	windowHeight = window.innerHeight,
): number {
	for (let i = 0; i < sections.length; i++) {
		const rect = sections[i].getBoundingClientRect();
		const offsetTop = rect.top;
		const offsetBottom = rect.bottom;

		const isInRange =
			(offsetTop > 0 && offsetTop < windowHeight) ||
			(offsetBottom > 0 && offsetBottom < windowHeight) ||
			(offsetTop < 0 && offsetBottom > windowHeight);

		if (isInRange) {
			activeStates[i] = true;
			return i;
		}
		if (offsetTop > windowHeight) {
			break;
		}
	}
	return -1;
}
