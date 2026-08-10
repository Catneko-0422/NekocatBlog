import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import * as fs from "node:fs";
import path from "node:path";
import type { APIContext, GetStaticPaths } from "astro";
import satori from "satori";
import sharp from "sharp";

import { getPostPublicDescription } from "@/utils/post-card-content";
import { removeFileExtension } from "@/utils/url-utils";

import { profileConfig, siteConfig } from "../../config";

type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type FontStyle = "normal" | "italic";
interface FontOptions {
	data: Buffer | ArrayBuffer;
	name: string;
	weight?: Weight;
	style?: FontStyle;
	lang?: string;
}
export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
	if (!siteConfig.generateOgImages) {
		return [];
	}

	const allPosts = await getCollection("posts");
	const publishedPosts = allPosts.filter((post) => !post.data.draft);

	return publishedPosts.map((post) => {
		// 將 .png 作爲 catch-all 參數的一部分，避免 Astro 對
		// [...slug].png.ts 生成的嚴格後綴路由無法匹配尾斜槓路徑。
		const slug = `${removeFileExtension(post.id)}.png`;
		return {
			params: { slug },
			props: { post },
		};
	});
};

let fontCache: { regular: Buffer | null; bold: Buffer | null } | null = null;

async function fetchNotoSansSCFonts() {
	if (fontCache) {
		return fontCache;
	}

	try {
		const cssResp = await fetch(
			"https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap",
		);
		if (!cssResp.ok) {
			throw new Error("Failed to fetch Google Fonts CSS");
		}
		const cssText = await cssResp.text();

		const getUrlForWeight = (weight: number) => {
			const blockRe = new RegExp(
				`@font-face\\s*{[^}]*font-weight:\\s*${weight}[^}]*}`,
				"g",
			);
			const match = cssText.match(blockRe);
			if (!match || match.length === 0) {
				return null;
			}
			const urlMatch = match[0].match(/url\((https:[^)]+)\)/);
			return urlMatch ? urlMatch[1] : null;
		};

		const regularUrl = getUrlForWeight(400);
		const boldUrl = getUrlForWeight(700);

		if (!regularUrl || !boldUrl) {
			console.warn(
				"Could not find font urls in Google Fonts CSS; falling back to no fonts.",
			);
			fontCache = { regular: null, bold: null };
			return fontCache;
		}

		const [rResp, bResp] = await Promise.all([
			fetch(regularUrl),
			fetch(boldUrl),
		]);
		if (!rResp.ok || !bResp.ok) {
			console.warn(
				"Failed to download font files from Google; falling back to no fonts.",
			);
			fontCache = { regular: null, bold: null };
			return fontCache;
		}

		const rBuf = Buffer.from(await rResp.arrayBuffer());
		const bBuf = Buffer.from(await bResp.arrayBuffer());

		fontCache = { regular: rBuf, bold: bBuf };
		return fontCache;
	} catch (err) {
		console.warn("Error fetching fonts:", err);
		fontCache = { regular: null, bold: null };
		return fontCache;
	}
}

export async function GET({
	props,
}: APIContext<{ post: CollectionEntry<"posts"> }>) {
	const { post } = props;

	// Try to fetch fonts from Google Fonts (woff2) at runtime.
	const { regular: fontRegular, bold: fontBold } = await fetchNotoSansSCFonts();

	// Avatar + icon: still read from disk (small assets)
	// 使用存在性檢查與副檔名推斷 MIME，避免建構期間因檔案缺失而崩潰
	const mimeByExt: Record<string, string> = {
		".png": "image/png",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".webp": "image/webp",
		".gif": "image/gif",
		".svg": "image/svg+xml",
		".ico": "image/x-icon",
	};

	const readImageAsDataUri = (filePath: string): string | null => {
		try {
			if (!fs.existsSync(filePath)) {
				return null;
			}
			const buffer = fs.readFileSync(filePath);
			const ext = path.extname(filePath).toLowerCase();
			const mime = mimeByExt[ext] || "image/png";
			return `data:${mime};base64,${buffer.toString("base64")}`;
		} catch {
			return null;
		}
	};

	const avatarUri = (() => {
		if (!profileConfig.avatar) {
			return null;
		}
		if (profileConfig.avatar.startsWith("data:")) {
			return profileConfig.avatar;
		}
		if (
			profileConfig.avatar.startsWith("http://") ||
			profileConfig.avatar.startsWith("https://")
		) {
			// 遠端頭像跳過（避免建構期間的網路依賴）
			return null;
		}
		if (profileConfig.avatar.startsWith("/")) {
			return readImageAsDataUri(`./public${profileConfig.avatar}`);
		}
		return readImageAsDataUri(`./src/${profileConfig.avatar}`);
	})();

	let iconUri: string | null = null;
	if (siteConfig.favicon.length > 0) {
		const iconSrc = siteConfig.favicon[0].src.startsWith("/")
			? siteConfig.favicon[0].src
			: `/${siteConfig.favicon[0].src}`;
		iconUri = readImageAsDataUri(`./public${iconSrc}`);
	} else {
		iconUri = readImageAsDataUri("./public/favicon/favicon.ico");
	}

	const hue = siteConfig.themeColor.hue;
	const primaryColor = `hsl(${hue}, 90%, 65%)`;
	const textColor = "hsl(0, 0%, 95%)";

	const subtleTextColor = `hsl(${hue}, 10%, 75%)`;
	const backgroundColor = `hsl(${hue}, 15%, 12%)`;

	const pubDate = post.data.published.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const description = getPostPublicDescription(post.data);

	const template = {
		type: "div",
		props: {
			style: {
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				backgroundColor: backgroundColor,
				fontFamily:
					'"Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
				padding: "60px",
			},
			children: [
				{
					type: "div",
					props: {
						style: {
							width: "100%",
							display: "flex",
							alignItems: "center",
							gap: "20px",
						},
						children: [
							iconUri && {
								type: "img",
								props: {
									src: iconUri,
									width: 48,
									height: 48,
									style: { borderRadius: "10px" },
								},
							},
							{
								type: "div",
								props: {
									style: {
										fontSize: "36px",
										fontWeight: 600,
										color: subtleTextColor,
									},
									children: siteConfig.title,
								},
							},
						],
					},
				},

				{
					type: "div",
					props: {
						style: {
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							flexGrow: 1,
							gap: "20px",
						},
						children: [
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										alignItems: "flex-start",
									},
									children: [
										{
											type: "div",
											props: {
												style: {
													width: "10px",
													height: "68px",
													backgroundColor: primaryColor,
													borderRadius: "6px",
													marginTop: "14px",
												},
											},
										},
										{
											type: "div",
											props: {
												style: {
													fontSize: "72px",
													fontWeight: 700,
													lineHeight: 1.2,
													color: textColor,
													marginLeft: "25px",
													display: "-webkit-box",
													overflow: "hidden",
													textOverflow: "ellipsis",
													lineClamp: 3,
													WebkitLineClamp: 3,
													WebkitBoxOrient: "vertical",
												},
												children: post.data.title,
											},
										},
									],
								},
							},
							description && {
								type: "div",
								props: {
									style: {
										fontSize: "32px",
										lineHeight: 1.5,
										color: subtleTextColor,
										paddingLeft: "35px",
										display: "-webkit-box",
										overflow: "hidden",
										textOverflow: "ellipsis",
										lineClamp: 2,
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
									},
									children: description,
								},
							},
						],
					},
				},
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							width: "100%",
						},
						children: [
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "20px",
									},
									children: [
										avatarUri && {
											type: "img",
											props: {
												src: avatarUri,
												width: 60,
												height: 60,
												style: { borderRadius: "50%" },
											},
										},
										{
											type: "div",
											props: {
												style: {
													fontSize: "28px",
													fontWeight: 600,
													color: textColor,
												},
												children: profileConfig.name,
											},
										},
									],
								},
							},
							{
								type: "div",
								props: {
									style: {
										fontSize: "28px",
										color: subtleTextColor,
									},
									children: pubDate,
								},
							},
						],
					},
				},
			],
		},
	};

	const fonts: FontOptions[] = [];
	if (fontRegular) {
		fonts.push({
			name: "Noto Sans SC",
			data: fontRegular,
			weight: 400,
			style: "normal",
		});
	}
	if (fontBold) {
		fonts.push({
			name: "Noto Sans SC",
			data: fontBold,
			weight: 700,
			style: "normal",
		});
	}

	const svg = await satori(template, {
		width: 1200,
		height: 630,
		fonts,
	});

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
