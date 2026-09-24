"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptSecret = encryptSecret;
exports.decryptSecret = decryptSecret;
exports.isEncryptedSecret = isEncryptedSecret;
exports.maskSecretValue = maskSecretValue;
exports.shouldPreserveMaskedSecret = shouldPreserveMaskedSecret;
const crypto_1 = require("crypto");
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const PREFIX = 'enc:v1:';
function deriveKey(secret) {
    return (0, crypto_1.createHash)('sha256').update(secret).digest();
}
function encryptSecret(plain, secretKey) {
    const iv = (0, crypto_1.randomBytes)(IV_LENGTH);
    const cipher = (0, crypto_1.createCipheriv)(ALGORITHM, deriveKey(secretKey), iv);
    const encrypted = Buffer.concat([
        cipher.update(plain, 'utf8'),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return `${PREFIX}${iv.toString('base64url')}:${tag.toString('base64url')}:${encrypted.toString('base64url')}`;
}
function decryptSecret(payload, secretKey) {
    if (!payload.startsWith(PREFIX)) {
        return payload;
    }
    const parts = payload.slice(PREFIX.length).split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted secret format');
    }
    const [ivPart, tagPart, dataPart] = parts;
    const iv = Buffer.from(ivPart, 'base64url');
    const tag = Buffer.from(tagPart, 'base64url');
    const data = Buffer.from(dataPart, 'base64url');
    const decipher = (0, crypto_1.createDecipheriv)(ALGORITHM, deriveKey(secretKey), iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString('utf8');
}
function isEncryptedSecret(value) {
    return value.startsWith(PREFIX);
}
function maskSecretValue(plain) {
    const trimmed = plain.trim();
    if (!trimmed)
        return '';
    if (trimmed.length <= 8)
        return '********';
    return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`;
}
function shouldPreserveMaskedSecret(value) {
    if (value == null)
        return false;
    const trimmed = value.trim();
    if (!trimmed)
        return false;
    if (trimmed === '********')
        return true;
    return /^.{1,8}\.\.\..{1,8}$/.test(trimmed);
}
//# sourceMappingURL=secret-crypto.js.map