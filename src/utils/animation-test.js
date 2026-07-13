// 動畫測試工具 - 驗證yukina風格的側滑效果

export function testSlideAnimation() {
	console.log("Testing slide animation effects...");

	// 測試主要動畫元素
	const mainElements = document.querySelectorAll(".transition-main");
	const animationElements = document.querySelectorAll(".onload-animation");

	console.log(`Found ${mainElements.length} main transition elements`);
	console.log(`Found ${animationElements.length} onload animation elements`);

	// 檢查CSS動畫屬性
	mainElements.forEach((el, index) => {
		const styles = window.getComputedStyle(el);
		console.log(`Element ${index}:`, {
			transition: styles.transition,
			transform: styles.transform,
			opacity: styles.opacity,
		});
	});

	return {
		mainElements: mainElements.length,
		animationElements: animationElements.length,
		status: "Animation test completed",
	};
}

// 模擬頁面切換動畫
export function simulatePageTransition() {
	const _body = document.body;
	const html = document.documentElement;

	// 添加離開狀態
	html.classList.add("is-animating", "is-leaving");

	setTimeout(() => {
		// 移除離開狀態，添加進入狀態
		html.classList.remove("is-leaving");

		setTimeout(() => {
			// 完成動畫
			html.classList.remove("is-animating");
			console.log("Page transition simulation completed");
		}, 300);
	}, 300);
}

// 在控制台中可用的測試函數
if (typeof window !== "undefined") {
	window.testSlideAnimation = testSlideAnimation;
	window.simulatePageTransition = simulatePageTransition;
}
