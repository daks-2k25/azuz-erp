"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyBrandingToDocument,
  DEFAULT_BRANDING,
  resolveBrandingAssetUrl,
  type AgencyBranding,
} from "@/lib/branding-utils";
import { useCompany } from "@/contexts/company-context";
import { settingsService } from "@/services";

interface BrandingContextValue {
  branding: AgencyBranding;
  isLoading: boolean;
  logoUrl: string | null;
  faviconUrl: string | null;
  loadBranding: () => Promise<void>;
  saveBranding: (data: AgencyBranding) => Promise<AgencyBranding>;
  uploadBrandingAsset: (
    type: "logo" | "favicon",
    file: File,
  ) => Promise<AgencyBranding>;
}

const BrandingContext = createContext<BrandingContextValue | null>(null);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const companyContext = useCompany();
  const [branding, setBranding] = useState<AgencyBranding>(DEFAULT_BRANDING);
  const [isLoading, setIsLoading] = useState(true);

  const loadBranding = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await settingsService.getBranding();
      setBranding(data);
      applyBrandingToDocument(data);
    } catch {
      setBranding(companyContext.branding ?? DEFAULT_BRANDING);
      applyBrandingToDocument(companyContext.branding ?? DEFAULT_BRANDING);
    } finally {
      setIsLoading(false);
    }
  }, [companyContext.branding]);

  const saveBranding = useCallback(async (data: AgencyBranding) => {
    const saved = await settingsService.updateBranding(data);
    setBranding(saved);
    applyBrandingToDocument(saved);
    await companyContext.refresh();
    return saved;
  }, [companyContext]);

  const uploadBrandingAsset = useCallback(
    async (type: "logo" | "favicon", file: File) => {
      const saved = await settingsService.uploadBrandingAsset(type, file);
      setBranding(saved);
      applyBrandingToDocument(saved);
      await companyContext.refresh();
      return saved;
    },
    [companyContext],
  );

  useEffect(() => {
    if (companyContext.isLoading) {
      setIsLoading(true);
      return;
    }

    if (companyContext.branding) {
      setBranding(companyContext.branding);
      applyBrandingToDocument(companyContext.branding);
      setIsLoading(false);
      return;
    }

    void loadBranding();
  }, [companyContext.isLoading, companyContext.branding, loadBranding]);

  const value = useMemo(
    () => ({
      branding,
      isLoading: isLoading || companyContext.isLoading,
      logoUrl: resolveBrandingAssetUrl(branding.logoUrl),
      faviconUrl: resolveBrandingAssetUrl(branding.faviconUrl),
      loadBranding,
      saveBranding,
      uploadBrandingAsset,
    }),
    [
      branding,
      isLoading,
      companyContext.isLoading,
      loadBranding,
      saveBranding,
      uploadBrandingAsset,
    ],
  );

  return (
    <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within BrandingProvider");
  }
  return context;
}
