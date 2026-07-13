// 右側邊欄佈局管理器
// 用於在網格模式下隱藏右側邊欄

/**
 * 初始化頁面佈局
 * @param {string} pageType - 頁面類型（projects, skills等）
 */
function isLayoutSwitchEnabled() {
	return document.documentElement.getAttribute("data-post-list-layout-enabled") !== "false";
}

function getPostListLayout() {
	return isLayoutSwitchEnabled() ? (localStorage.getItem("postListLayout") || "list") : "list";
}

function initPageLayout(pageType) {
	// 獲取佈局配置
	const defaultPostListLayout = getPostListLayout();

	// 如果默認佈局是網格模式，則隱藏右側邊欄
	if (defaultPostListLayout === "grid") {
		hideRightSidebar();
	} else {
		showRightSidebar();
	}

	// 監聽佈局切換事件
	window.addEventListener("layoutChange", (event) => {
		const layout = event.detail.layout;
		if (layout === "grid") {
			hideRightSidebar();
		} else {
			showRightSidebar();
		}
	});

	// 監聽本地存儲變化（用於跨標籤頁同步）
	window.addEventListener("storage", (event) => {
		if (event.key === "postListLayout") {
			if (event.newValue === "grid") {
				hideRightSidebar();
			} else {
				showRightSidebar();
			}
		}
	});

	// 監聽頁面導航事件
	document.addEventListener("astro:page-load", () => {
		setTimeout(() => {
			const currentLayout = getPostListLayout();
			if (currentLayout === "grid") {
				hideRightSidebar();
			} else {
				showRightSidebar();
			}
		}, 100);
	});

	// 監聽SWUP導航事件
	document.addEventListener("swup:contentReplaced", () => {
		setTimeout(() => {
			const currentLayout = getPostListLayout();
			if (currentLayout === "grid") {
				hideRightSidebar();
			} else {
				showRightSidebar();
			}
		}, 100);
	});
}

/**
 * 隱藏右側邊欄
 */
function hideRightSidebar() {
	const rightSidebar = document.querySelector(".right-sidebar-container");
	if (rightSidebar) {
		// 添加隱藏類
		rightSidebar.classList.add("hidden-in-grid-mode");

		// 設置顯示爲none以完全隱藏
		rightSidebar.style.display = "none";

		// 調整主網格佈局
		const mainGrid = document.getElementById("main-grid");
		if (mainGrid) {
			mainGrid.style.gridTemplateColumns = "17.5rem 1fr";
			mainGrid.setAttribute("data-layout-mode", "grid");
		}
	}
}

/**
 * 顯示右側邊欄
 */
function showRightSidebar() {
	const rightSidebar = document.querySelector(".right-sidebar-container");
	if (rightSidebar) {
		// 移除隱藏類
		rightSidebar.classList.remove("hidden-in-grid-mode");

		// 恢復顯示
		rightSidebar.style.display = "";

		// 恢復主網格佈局
		const mainGrid = document.getElementById("main-grid");
		if (mainGrid) {
			mainGrid.style.gridTemplateColumns = "";
			mainGrid.setAttribute("data-layout-mode", "list");
		}
	}
}

// 頁面加載完成後初始化
function initialize() {
	const pageType =
		document.documentElement.getAttribute("data-page-type") || "projects";
	initPageLayout(pageType);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initialize);
} else {
	initialize();
}

// 導出函數供其他腳本使用
if (typeof module !== "undefined" && module.exports) {
	module.exports = {
		initPageLayout,
		hideRightSidebar,
		showRightSidebar,
	};
}

// 同時也掛載到 window 對象，以便在瀏覽器環境中直接調用
if (typeof window !== "undefined") {
	window.rightSidebarLayout = {
		initPageLayout,
		hideRightSidebar,
		showRightSidebar,
	};
}
