#!/usr/bin/env node

/**
 * Mizuki 內容倉庫初始化腳本
 * 幫助用戶快速設置代碼內容分離
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { loadEnv } from "./load-env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

loadEnv();
console.log("已加載 .env 配置文件\n");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function question(query) {
	return new Promise((resolve) => rl.question(query, resolve));
}

function exec(command, options = {}) {
	try {
		return execSync(command, { stdio: "inherit", ...options });
	} catch (error) {
		console.error(`命令執行失敗: ${command}`);
		throw error;
	}
}

async function main() {
	console.log("Mizuki 內容倉庫初始化\n");

	console.log("將使用獨立倉庫模式管理內容\n");

	// 詢問內容倉庫 URL
	const repoUrl = await question("請輸入內容倉庫 URL: ");

	if (!repoUrl.trim()) {
		console.error("錯誤：內容倉庫 URL 不能爲空！");
		rl.close();
		return;
	}

	// 確認信息
	console.log("\n當前配置：");
	console.log("  模式：獨立倉庫");
	console.log(`  倉庫：${repoUrl.trim()}`);

	const confirm = await question("\n確認初始化？(y/n): ");

	if (confirm.toLowerCase() !== "y") {
		console.log("已取消初始化");
		rl.close();
		return;
	}

	console.log("\n開始初始化...\n");

	// 創建 .env 文件
	const envPath = path.join(rootDir, ".env");
	const envContent = `# Mizuki 內容倉庫配置
# 由初始化腳本自動生成

CONTENT_REPO_URL=${repoUrl.trim()}
CONTENT_DIR=./content
`;

	fs.writeFileSync(envPath, envContent);
	console.log("已創建 .env 文件");

	// 同步內容
	console.log("正在同步內容倉庫...");
	try {
		exec("pnpm run sync-content", {
			cwd: rootDir,
			env: {
				...process.env,
				CONTENT_REPO_URL: repoUrl.trim(),
			},
		});
		console.log("內容同步成功");
	} catch (error) {
		console.error(
			"內容同步失敗。請手動執行：pnpm run sync-content",
		);
	}

	// 提示後續步驟
	console.log("\n初始化完成\n");
	console.log("\n相關文檔：");
	console.log("- 內容倉庫說明：docs/CONTENT_REPOSITORY.md");
	console.log("- 遷移指南：docs/MIGRATION_GUIDE.md");

	rl.close();
}

main().catch((error) => {
	console.error("初始化失敗：", error);
	rl.close();
	process.exit(1);
});
