import * as fs from "node:fs";
import * as path from "node:path";

import type { AlbumGroup, Photo } from "../types/album";

export async function scanAlbums(): Promise<AlbumGroup[]> {
	const albumsDir = path.join(process.cwd(), "public/images/albums");
	const albums: AlbumGroup[] = [];

	// 檢查目錄是否存在
	if (!fs.existsSync(albumsDir)) {
		console.warn("相冊目錄不存在:", albumsDir);
		return [];
	}

	// 獲取所有子文件夾
	const albumFolders = fs
		.readdirSync(albumsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	// 處理每個相冊文件夾
	for (const folder of albumFolders) {
		const albumPath = path.join(albumsDir, folder);
		const album = await processAlbumFolder(albumPath, folder);
		if (album) {
			albums.push(album);
		}
	}

	return albums;
}

async function processAlbumFolder(
	folderPath: string,
	folderName: string,
): Promise<AlbumGroup | null> {
	// 檢查必要文件
	const infoPath = path.join(folderPath, "info.json");

	if (!fs.existsSync(infoPath)) {
		console.warn(`相冊 ${folderName} 缺少 info.json 文件`);
		return null;
	}

	// 讀取相冊信息
	const infoContent = fs.readFileSync(infoPath, "utf-8");
	interface AlbumInfo {
		mode?: string;
		cover?: string;
		photos?: Record<string, unknown>[];
		hidden?: boolean;
		title?: string;
		description?: string;
		date?: string;
		location?: string;
		tags?: string[];
		password?: string;
		passwordHint?: string;
	}
	let info: AlbumInfo;
	try {
		info = JSON.parse(infoContent);
	} catch (e) {
		console.error(`相冊 ${folderName} 的 info.json 格式錯誤:`, e);
		return null;
	}

	// 檢查是否爲外鏈模式
	const isExternalMode = info.mode === "external";
	let photos: Photo[] = [];
	let cover: string;

	if (isExternalMode) {
		// 外鏈模式：從 info.json 中獲取封面和照片
		if (!info.cover) {
			console.warn(`相冊 ${folderName} 外鏈模式缺少 cover 字段`);
			return null;
		}

		cover = info.cover as string;
		photos = processExternalPhotos(
			(info.photos ?? []) as Parameters<typeof processExternalPhotos>[0],
			folderName,
		);
	} else {
		// 本地模式：檢查本地文件
		let coverPath = path.join(folderPath, "cover.webp");
		const hasWebpCover = fs.existsSync(coverPath);
		if (!hasWebpCover) {
			coverPath = path.join(folderPath, "cover.jpg");
			if (!fs.existsSync(coverPath)) {
				console.warn(`相冊 ${folderName} 缺少 cover 文件`);
				return null;
			}
		}

		cover = hasWebpCover
			? `/images/albums/${folderName}/cover.webp`
			: `/images/albums/${folderName}/cover.jpg`;
		photos = scanPhotos(folderPath, folderName);
	}

	// 檢查是否隱藏相冊
	if (info.hidden === true) {
		console.log(`相冊 ${folderName} 已設置爲隱藏，跳過顯示`);
		return null;
	}

	// 構建相冊對象
	return {
		id: folderName,
		title: info.title || folderName,
		description: info.description || "",
		cover,
		date: info.date || new Date().toISOString().split("T")[0],
		location: info.location || "",
		tags: info.tags || [],
		photos,
		password: info.password || undefined,
		passwordHint: info.passwordHint || undefined,
	};
}

function scanPhotos(folderPath: string, albumId: string): Photo[] {
	const photos: Photo[] = [];
	const files = fs.readdirSync(folderPath);

	const imageExtensions = [
		".jpg",
		".jpeg",
		".png",
		".gif",
		".webp",
		".svg",
		".avif",
		".bmp",
		".tiff",
		".tif",
	];

	const imageFiles = files.filter((file) => {
		const ext = path.extname(file).toLowerCase();
		return (
			imageExtensions.includes(ext) &&
			file !== "cover.jpg" &&
			file !== "cover.webp"
		);
	});

	const fileWebpMap = new Map<string, string>();
	for (const file of imageFiles) {
		const baseName = path.basename(file, path.extname(file));
		const ext = path.extname(file).toLowerCase();
		if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
			if (imageFiles.includes(`${baseName}.webp`)) {
				fileWebpMap.set(file, `${baseName}.webp`);
			}
		}
	}

	imageFiles.forEach((file, index) => {
		const filePath = path.join(folderPath, file);
		const stats = fs.statSync(filePath);

		const { baseName, tags } = parseFileName(file);

		const src = fileWebpMap.has(file)
			? `/images/albums/${albumId}/${fileWebpMap.get(file)}`
			: `/images/albums/${albumId}/${file}`;

		photos.push({
			id: `${albumId}-photo-${index}`,
			src,
			alt: baseName,
			title: baseName,
			tags: tags,
			date: stats.mtime.toISOString().split("T")[0],
		});
	});

	return photos;
}

function processExternalPhotos(
	externalPhotos: {
		src: string;
		id?: string;
		thumbnail?: string;
		alt?: string;
		title?: string;
		description?: string;
		tags?: string[];
		date?: string;
		location?: string;
		width?: number;
		height?: number;
	}[],
	albumId: string,
): Photo[] {
	const photos: Photo[] = [];

	externalPhotos.forEach((photo, index) => {
		if (!photo.src) {
			console.warn(`相冊 ${albumId} 的第 ${index + 1} 張照片缺少 src 字段`);
			return;
		}

		photos.push({
			id: photo.id || `${albumId}-external-photo-${index}`,
			src: photo.src,
			thumbnail: photo.thumbnail,
			alt: photo.alt || photo.title || `Photo ${index + 1}`,
			title: photo.title,
			description: photo.description,
			tags: photo.tags || [],
			date: photo.date || new Date().toISOString().split("T")[0],
			location: photo.location,
			width: photo.width,
			height: photo.height,
			// camera: photo.camera,
			// lens: photo.lens,
			// settings: photo.settings,
		});
	});

	return photos;
}

function parseFileName(fileName: string): { baseName: string; tags: string[] } {
	// 匹配文件名中的標籤，格式爲：文件名_標籤1_標籤2.擴展名
	const parts = path.basename(fileName, path.extname(fileName)).split("_");

	if (parts.length >= 3) {
		// 前 N-2 部分作爲基本名稱，最後 2 部分作爲標籤
		const baseName = parts.slice(0, -2).join("_");
		const tags = parts.slice(-2);
		return { baseName, tags };
	}

	if (parts.length === 2) {
		// 第一部分作爲基本名稱，第二部分作爲標籤
		return { baseName: parts[0], tags: [parts[1]] };
	}

	// 如果沒有標籤，返回不帶擴展名的文件名
	const baseName = path.basename(fileName, path.extname(fileName));
	return { baseName, tags: [] };
}
