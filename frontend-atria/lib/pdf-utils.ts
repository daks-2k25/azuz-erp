import { isMediaVideo } from "@/lib/content-utils";

export type PreviewMediaKind = "image" | "video" | "pdf" | "file";

export function isPdfSource(
  url?: string | null,
  mimeType?: string | null,
  fileName?: string | null,
) {
  if (mimeType?.toLowerCase().includes("pdf")) return true;

  const haystack = `${url ?? ""} ${fileName ?? ""}`;
  return /\.pdf(?:$|[?#])/i.test(haystack);
}

export function getPreviewMediaKind(
  url?: string | null,
  mimeType?: string | null,
  fileName?: string | null,
): PreviewMediaKind {
  if (isPdfSource(url, mimeType, fileName)) return "pdf";
  if (isMediaVideo(url ?? "", mimeType)) return "video";
  if (
    mimeType?.startsWith("image/") ||
    /\.(jpe?g|png|gif|webp|svg)(?:$|[?#])/i.test(url ?? "") ||
    /\.(jpe?g|png|gif|webp|svg)$/i.test(fileName ?? "")
  ) {
    return "image";
  }
  return "file";
}

export function toLightboxMediaType(
  kind: PreviewMediaKind,
): "image" | "video" | "other" {
  if (kind === "video") return "video";
  if (kind === "image") return "image";
  return "other";
}

export function mimeTypeForPreviewKind(
  kind: PreviewMediaKind,
): string | undefined {
  if (kind === "video") return "video/mp4";
  if (kind === "image") return "image/jpeg";
  if (kind === "pdf") return "application/pdf";
  return undefined;
}
