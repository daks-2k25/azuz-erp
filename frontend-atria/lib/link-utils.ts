export type LinkProvider =
  | "figma"
  | "drive"
  | "meet"
  | "notion"
  | "generic";

export function detectLinkProvider(url: string): LinkProvider {
  const lower = url.toLowerCase();
  if (lower.includes("figma.com")) return "figma";
  if (lower.includes("drive.google.com") || lower.includes("docs.google.com"))
    return "drive";
  if (lower.includes("meet.google.com") || lower.includes("zoom.us"))
    return "meet";
  if (lower.includes("notion.so") || lower.includes("notion.site"))
    return "notion";
  return "generic";
}

export const LINK_PROVIDER_LABELS: Record<LinkProvider, string> = {
  figma: "Figma",
  drive: "Google Drive",
  meet: "Google Meet",
  notion: "Notion",
  generic: "Link externo",
};

export const LINK_PROVIDER_COLORS: Record<LinkProvider, string> = {
  figma: "#A259FF",
  drive: "#4285F4",
  meet: "#00897B",
  notion: "#000000",
  generic: "var(--atria-primary)",
};

export function isValidReferenceUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
