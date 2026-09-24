import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const PREFIX = 'enc:v1:';

function deriveKey(secret: string) {
  return createHash('sha256').update(secret).digest();
}

export function encryptSecret(plain: string, secretKey: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, deriveKey(secretKey), iv);
  const encrypted = Buffer.concat([
    cipher.update(plain, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString('base64url')}:${tag.toString('base64url')}:${encrypted.toString('base64url')}`;
}

export function decryptSecret(payload: string, secretKey: string): string {
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
  const decipher = createDecipheriv(ALGORITHM, deriveKey(secretKey), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString('utf8');
}

export function isEncryptedSecret(value: string) {
  return value.startsWith(PREFIX);
}

export function maskSecretValue(plain: string): string {
  const trimmed = plain.trim();
  if (!trimmed) return '';
  if (trimmed.length <= 8) return '********';
  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`;
}

export function shouldPreserveMaskedSecret(value: string | null | undefined): boolean {
  if (value == null) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed === '********') return true;
  return /^.{1,8}\.\.\..{1,8}$/.test(trimmed);
}
