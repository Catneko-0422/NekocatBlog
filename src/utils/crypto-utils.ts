import { createCipheriv, createHmac, pbkdf2Sync } from "node:crypto";

// 共享加密常量 — 客戶端 PasswordProtection.astro 中的內聯腳本必須保持同步
export const CRYPTO_CONSTANTS = {
	PBKDF2_ITERATIONS: 100000,
	SALT_LENGTH: 16,
	IV_LENGTH: 12,
	AUTH_TAG_LENGTH: 16,
	KEY_LENGTH: 32,
	VERIFY_PREFIX: "MIZUKI-VERIFY:", // 驗證前綴：正確解密後內容以此開頭
} as const;

/**
 * 使用 HMAC-SHA256 派生確定性字節
 */
function deriveBytes(key: string, context: string, length: number): Buffer {
	return createHmac("sha256", key).update(context).digest().subarray(0, length);
}

/**
 * 加密 HTML 內容
 *
 * 協議 v2：在明文前添加驗證前綴，使客戶端可以快速驗證密碼是否正確，
 * 無需等待完整 AES-GCM 解密失敗。
 *
 * 輸出格式：base64(salt[16] + iv[12] + authTag[16] + ciphertext)
 * 其中 ciphertext = AES-256-GCM-encrypt("MIZUKI-VERIFY:" + html)
 */
export function encryptContent(
	html: string,
	password: string,
	slug: string,
): string {
	const {
		PBKDF2_ITERATIONS,
		SALT_LENGTH,
		IV_LENGTH,
		KEY_LENGTH,
		VERIFY_PREFIX,
	} = CRYPTO_CONSTANTS;

	const plaintext = VERIFY_PREFIX + html;

	const salt = deriveBytes(password, `salt:${slug}`, SALT_LENGTH);
	const iv = deriveBytes(password, `iv:${slug}`, IV_LENGTH);
	const key = pbkdf2Sync(
		password,
		salt,
		PBKDF2_ITERATIONS,
		KEY_LENGTH,
		"sha256",
	);

	const cipher = createCipheriv("aes-256-gcm", key, iv);
	const encrypted = Buffer.concat([
		cipher.update(plaintext, "utf8"),
		cipher.final(),
	]);
	const authTag = cipher.getAuthTag();

	return Buffer.concat([salt, iv, authTag, encrypted]).toString("base64");
}
