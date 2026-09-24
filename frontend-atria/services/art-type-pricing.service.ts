import { apiRequest } from "./api";
import type {
  ArtTypePricing,
  CreateArtTypePricingInput,
  UpdateArtTypePricingInput,
} from "./types";

export async function getArtTypePricings(): Promise<ArtTypePricing[]> {
  return apiRequest<ArtTypePricing[]>("/art-type-pricing");
}

export async function getArtTypePricing(id: string): Promise<ArtTypePricing> {
  return apiRequest<ArtTypePricing>(`/art-type-pricing/${id}`);
}

export async function createArtTypePricing(
  data: CreateArtTypePricingInput,
): Promise<ArtTypePricing> {
  return apiRequest<ArtTypePricing>("/art-type-pricing", {
    method: "POST",
    body: data,
  });
}

export async function updateArtTypePricing(
  id: string,
  data: UpdateArtTypePricingInput,
): Promise<ArtTypePricing> {
  return apiRequest<ArtTypePricing>(`/art-type-pricing/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteArtTypePricing(id: string): Promise<void> {
  return apiRequest<void>(`/art-type-pricing/${id}`, { method: "DELETE" });
}
