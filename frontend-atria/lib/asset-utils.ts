import type { AssetFileType } from "@/services/types";

export const ASSET_TYPE_LABELS: Record<AssetFileType, string> = {
  image: "Mídia / Imagem",
  logo: "Logo",
  brand_guide: "Brand Guidelines",
  document: "Documento",
};

export const ASSET_TYPE_STYLES: Record<AssetFileType, string> = {
  image: "bg-[#004949]/10 text-[#004949]",
  logo: "bg-[#E8C39E]/30 text-[#004949]",
  brand_guide: "bg-[#2D6A6A]/10 text-[#004949]",
  document: "bg-gray-100 text-gray-700",
};
