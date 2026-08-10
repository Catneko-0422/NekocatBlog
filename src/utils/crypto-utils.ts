import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";

// 共享加密常量 — 客戶端 PasswordProtection.astro 中的內聯腳本必須保持同步
export const CRYPTO_CONSTANTS = {
	PBKDF2_ITERATIONS: 600000,
	SALT_LENGTH: 16,
	IV_LENGTH: 12,
	AUTH_TAG_LENGTH: 16,
	KEY_LENGTH: 32,
	VERIFY_PREFIX: "MIZUKI-VERIFY:", // 驗證前綴：正確解密後內容以此開頭
} as const;

/**
 * 加密 HTML 內容
 *
 * 協議 v2：在明文前添加驗證前綴，使客戶端可以快速驗證密碼是否正確，
 * 無需等待完整 AES-GCM 解密失敗。
 *
 * 輸出格式：base64(salt[16] + iv[12] + authTag[16] + ciphertext)
 * 其中 ciphertext = AES-256-GCM-encrypt("MIZUKI-VERIFY:" + html)
 *
 * salt/iv 每次加密隨機生成並寫入密文前綴，客戶端直接從密文中讀取，
 * 因此相同密碼與內容每次加密結果不同。
 */
export function encryptContent(
	html: string,
	password: string,
	_slug: string,
): string {
	const {
		PBKDF2_ITERATIONS,
		SALT_LENGTH,
		IV_LENGTH,
		KEY_LENGTH,
		VERIFY_PREFIX,
	} = CRYPTO_CONSTANTS;

	const plaintext = VERIFY_PREFIX + html;

	const salt = randomBytes(SALT_LENGTH);
	const iv = randomBytes(IV_LENGTH);
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
