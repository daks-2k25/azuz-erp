export declare function encryptSecret(plain: string, secretKey: string): string;
export declare function decryptSecret(payload: string, secretKey: string): string;
export declare function isEncryptedSecret(value: string): boolean;
export declare function maskSecretValue(plain: string): string;
export declare function shouldPreserveMaskedSecret(value: string | null | undefined): boolean;
