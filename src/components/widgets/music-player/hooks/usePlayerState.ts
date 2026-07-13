import { ERROR_DISPLAY_DURATION } from "../constants";

export interface PlayerUIState {
	isExpanded: boolean;
	isHidden: boolean;
	showPlaylist: boolean;
	errorMessage: string;
	showError: boolean;
}

export function createPlayerUIState(): PlayerUIState {
	return {
		isExpanded: false,
		isHidden: false,
		showPlaylist: false,
		// 錯誤提示相關狀態
		errorMessage: "",
		showError: false,
	};
}

/**
 * 切換展開狀態：展開時強制顯示播放器且關閉播放列表
 */
export function toggleExpandedUI(state: PlayerUIState) {
	state.isExpanded = !state.isExpanded;
	if (state.isExpanded) {
		state.showPlaylist = false;
		state.isHidden = false;
	}
}

/**
 * 切換隱藏狀態：隱藏時收起播放器並關閉播放列表
 */
export function toggleHiddenUI(state: PlayerUIState) {
	state.isHidden = !state.isHidden;
	if (state.isHidden) {
		state.isExpanded = false;
		state.showPlaylist = false;
	}
}

/**
 * 切換播放列表面板展示
 */
export function togglePlaylistUI(state: PlayerUIState) {
	state.showPlaylist = !state.showPlaylist;
}

/**
 * 顯示錯誤提示，並在固定時間後自動隱藏
 */
export function showErrorMessageUI(state: PlayerUIState, message: string) {
	state.errorMessage = message;
	state.showError = true;
	setTimeout(() => {
		state.showError = false;
	}, ERROR_DISPLAY_DURATION);
}

export function hideErrorUI(state: PlayerUIState) {
	state.showError = false;
}
