export function resolveSecretUpdateValue(
  value: string | null | undefined,
  hasStoredSecret: boolean,
): string | null | undefined {
  if (value == null) {
    return hasStoredSecret ? undefined : null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return hasStoredSecret ? undefined : null;
  }

  if (trimmed === "********" || /^.{1,8}\.\.\..{1,8}$/.test(trimmed)) {
    return undefined;
  }

  return trimmed;
}
