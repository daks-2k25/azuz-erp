import { API_BASE_URL, apiRequest, uploadFile } from "./api";
import type { Asset, AssetFileType, ClientAssetGroup } from "./types";

export function resolveAssetUrl(fileUrl: string) {
  if (fileUrl.startsWith("http")) return fileUrl;
  return `${API_BASE_URL}${fileUrl}`;
}

export async function getAssets(params?: {
  clientId?: string;
  fileType?: AssetFileType;
}) {
  const search = new URLSearchParams();
  if (params?.clientId) search.set("clientId", params.clientId);
  if (params?.fileType) search.set("fileType", params.fileType.toUpperCase());
  const qs = search.toString();
  return apiRequest<Asset[]>(`/assets${qs ? `?${qs}` : ""}`);
}

export async function getGroupedAssets() {
  return apiRequest<ClientAssetGroup[]>("/assets/grouped");
}

export async function uploadAsset(
  clientId: string,
  fileType: AssetFileType,
  file: File,
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("clientId", clientId);
  formData.append("fileType", fileType.toUpperCase());
  return uploadFile<Asset>("/assets/upload", formData);
}

export async function deleteAsset(id: string) {
  return apiRequest<void>(`/assets/${id}`, { method: "DELETE" });
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
