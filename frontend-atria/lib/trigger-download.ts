import { resolveMediaUrl } from "@/lib/media-url";

export function triggerBrowserDownload(url: string, fileName?: string) {
  const anchor = document.createElement("a");
  anchor.href = resolveMediaUrl(url) ?? url;
  anchor.download = fileName?.trim() || "download";
  anchor.rel = "noopener noreferrer";
  anchor.target = "_blank";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function triggerBlobDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  triggerBrowserDownload(objectUrl, fileName);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export function fileNameFromContentDisposition(
  header: string | null,
  fallback = "download.bin",
) {
  if (!header) return fallback;

  const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1]).replace(/["']/g, "");
    } catch {
      return utfMatch[1].replace(/["']/g, "");
    }
  }

  const plainMatch = /filename="?([^"]+)"?/i.exec(header);
  if (plainMatch?.[1]) {
    return plainMatch[1].replace(/["']/g, "");
  }

  return fallback;
}
