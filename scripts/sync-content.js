import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadEnv } from "./load-env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

loadEnv();
console.log("已加載 .env 配置文件\n");

// 從環境變量讀取配置
const ENABLE_CONTENT_SYNC = process.env.ENABLE_CONTENT_SYNC !== "false"; // 默認啓用
const CONTENT_REPO_URL = process.env.CONTENT_REPO_URL || "";
const CONTENT_DIR = process.env.CONTENT_DIR || path.join(rootDir, "content");

console.log("開始同步內容...\n");

// 檢查是否啓用內容分離
if (!ENABLE_CONTENT_SYNC) {
	console.log("內容分離功能已關閉（ENABLE_CONTENT_SYNC=false）");
	console.log("提示：將使用本地內容，不會從遠程倉庫同步");
	console.log("      若要啓用內容分離，請在 .env 中設置：");
	console.log("      ENABLE_CONTENT_SYNC=true");
	console.log("      CONTENT_REPO_URL=<your-repo-url>\n");
	process.exit(0);
}

// 檢查內容目錄是否存在
if (!fs.existsSync(CONTENT_DIR)) {
	console.log(`內容目錄不存在：${CONTENT_DIR}`);
	console.log("將使用獨立倉庫模式");

	if (!CONTENT_REPO_URL) {
		console.warn("警告：未設置 CONTENT_REPO_URL，將使用本地內容");
		console.log(
			"提示：請設置 CONTENT_REPO_URL 環境變量，或手動創建內容目錄",
		);
		process.exit(0);
	}

	try {
		console.log(`正在克隆內容倉庫：${CONTENT_REPO_URL}`);
		execSync(`git clone --depth 1 ${CONTENT_REPO_URL} ${CONTENT_DIR}`, {
			stdio: "inherit",
			cwd: rootDir,
		});
		console.log("內容倉庫克隆成功");
	} catch (error) {
		console.error("克隆失敗：", error.message);
		process.exit(1);
	}
} else {
	console.log(`內容目錄已存在：${CONTENT_DIR}`);

	if (fs.existsSync(path.join(CONTENT_DIR, ".git"))) {
		try {
			console.log("正在同步遠程內容（強制模式）...");

			// 1. 防止本地修改丟失
			execSync("git stash push --include-untracked -m 'auto-sync'", {
				stdio: "inherit",
				cwd: CONTENT_DIR,
			});

			// 2. 更新遠程引用
			execSync("git fetch --all --prune", {
				stdio: "inherit",
				cwd: CONTENT_DIR,
			});

			// 3. 判斷分支
			let branch = "main";
			try {
				execSync("git rev-parse --verify origin/main", { cwd: CONTENT_DIR });
			} catch {
				branch = "master";
			}

			// 4. 強制同步
		execSync(`git checkout ${branch}`, { cwd: CONTENT_DIR });
		execSync(`git reset --hard origin/${branch}`, { cwd: CONTENT_DIR });

		console.log(`內容同步成功（分支：${branch}）`);
		} catch (error) {
			console.warn("內容更新失敗：", error.message);
		}
	}
}

// 創建符號鏈接或複製內容
console.log("\n正在建立內容鏈接...");

const contentMappings = [
	{ src: "posts", dest: "src/content/posts" },
	{ src: "spec", dest: "src/content/spec" },
	{ src: "data", dest: "src/data" },
	{ src: "images", dest: "public/images" },
];

for (const mapping of contentMappings) {
	const srcPath = path.join(CONTENT_DIR, mapping.src);
	const destPath = path.join(rootDir, mapping.dest);

	if (!fs.existsSync(srcPath)) {
		console.log(`跳過不存在的源目錄：${mapping.src}`);
		continue;
	}

	// 如果目標已存在且不是符號鏈接,備份它
	if (fs.existsSync(destPath) && !fs.lstatSync(destPath).isSymbolicLink()) {
		const backupPath = `${destPath}.backup`;
		console.log(
			`正在備份已有內容：${mapping.dest} -> ${mapping.dest}.backup`,
		);
		if (fs.existsSync(backupPath)) {
			fs.rmSync(backupPath, { recursive: true, force: true });
		}
		fs.renameSync(destPath, backupPath);
	}

	// 刪除現有的符號鏈接
	if (fs.existsSync(destPath)) {
		fs.unlinkSync(destPath);
	}

	// 創建符號鏈接 (Windows 需要管理員權限,否則複製文件)
	try {
		const relPath = path.relative(path.dirname(destPath), srcPath);
		fs.symlinkSync(relPath, destPath, "junction");
		console.log(`已創建符號鏈接：${mapping.dest} -> ${mapping.src}`);
	} catch (error) {
		console.log(`符號鏈接失敗，改爲複製內容：${mapping.src} -> ${mapping.dest}`);
		copyRecursive(srcPath, destPath);
	}
}

console.log("\n內容同步完成\n");
try {
	// 1. 獲取 content 分支名
	const branch = execSync("git rev-parse --abbrev-ref HEAD", {
		cwd: CONTENT_DIR,
	})
		.toString()
		.trim();

	// 2. 獲取 content commit hash（短）
	const hash = execSync("git rev-parse --short HEAD", {
		cwd: CONTENT_DIR,
	})
		.toString()
		.trim();

	// 3. 提交主倉庫
	execSync("git add .", { cwd: rootDir });

	execSync(
		`git commit -m "chore(content): sync ${branch}@${hash}"`,
		{ cwd: rootDir },
	);

	console.log(`已提交內容更新（${branch}@${hash}）`);
} catch {
	console.log("沒有變化，跳過提交");
}

// 遞歸複製函數
function copyRecursive(src, dest) {
	if (fs.statSync(src).isDirectory()) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest, { recursive: true });
		}
		const files = fs.readdirSync(src);
		for (const file of files) {
			copyRecursive(path.join(src, file), path.join(dest, file));
		}
	} else {
		fs.copyFileSync(src, dest);
	}
}
