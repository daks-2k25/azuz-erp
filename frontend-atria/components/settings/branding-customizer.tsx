"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2, Save, Sparkles } from "lucide-react";
import { AgencyLogo } from "@/components/branding/agency-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useBranding } from "@/contexts/branding-context";
import {
  DEFAULT_BRANDING,
  resolveBrandingAssetUrl,
  type AgencyBranding,
} from "@/lib/branding-utils";
import { toast } from "@/lib/toast";

function AssetUploadField({
  label,
  previewUrl,
  onSelect,
  pending,
}: {
  label: string;
  previewUrl: string | null;
  onSelect: (file: File) => void;
  pending: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--atria-primary)]/20 bg-[var(--atria-primary)]/5">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={label}
              width={64}
              height={64}
              className="size-full object-contain p-1"
              unoptimized
            />
          ) : (
            <ImageIcon className="size-6 text-[var(--atria-primary)]/30" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onSelect(file);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon className="mr-2 size-4" />
            {pending ? "Imagem selecionada" : "Selecionar imagem"}
          </Button>
          <p className="text-[11px] text-[var(--atria-primary)]/45">
            {pending
              ? "Será enviada ao clicar em Salvar Alterações"
              : "PNG, JPG, WEBP, SVG ou ICO · máx. 5MB"}
          </p>
        </div>
      </div>
    </Field>
  );
}

export function BrandingCustomizer() {
  const { branding, isLoading, saveBranding, uploadBrandingAsset } =
    useBranding();
  const [draft, setDraft] = useState<AgencyBranding>(branding);
  const [saving, setSaving] = useState(false);
  const [pendingLogo, setPendingLogo] = useState<File | null>(null);
  const [pendingFavicon, setPendingFavicon] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      setDraft(branding);
      setPendingLogo(null);
      setPendingFavicon(null);
      setLogoPreview(null);
      setFaviconPreview(null);
    }
  }, [branding, isLoading]);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (faviconPreview) URL.revokeObjectURL(faviconPreview);
    };
  }, [logoPreview, faviconPreview]);

  function updateDraft(partial: Partial<AgencyBranding>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function handleLogoSelect(file: File) {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setPendingLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleFaviconSelect(file: File) {
    if (faviconPreview) URL.revokeObjectURL(faviconPreview);
    setPendingFavicon(file);
    setFaviconPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setSaving(true);
    try {
      let next = draft;
      if (pendingLogo) {
        next = await uploadBrandingAsset("logo", pendingLogo);
      }
      if (pendingFavicon) {
        next = await uploadBrandingAsset("favicon", pendingFavicon);
      }
      const saved = await saveBranding({
        ...next,
        agencyName: draft.agencyName,
        primaryColor: draft.primaryColor,
        accentColor: draft.accentColor,
      });
      setDraft(saved);
      setPendingLogo(null);
      setPendingFavicon(null);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (faviconPreview) URL.revokeObjectURL(faviconPreview);
      setLogoPreview(null);
      setFaviconPreview(null);
      toast.success("Identidade visual salva com sucesso!");
    } catch {
      toast.error("Não foi possível salvar a identidade visual.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    if (faviconPreview) URL.revokeObjectURL(faviconPreview);
    setPendingLogo(null);
    setPendingFavicon(null);
    setLogoPreview(null);
    setFaviconPreview(null);
    setDraft(DEFAULT_BRANDING);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-[var(--atria-accent)]/20 p-2 text-[var(--atria-primary)]">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--atria-primary)]">
              Identidade da Agência
            </h2>
            <p className="text-xs text-[var(--atria-primary)]/50">
              Logo, favicon e nome da agência. Cores do tema em Aparência.
            </p>
          </div>
        </div>

        <FieldGroup className="gap-5">
          <Field>
            <FieldLabel htmlFor="agency-name">Nome da Agência</FieldLabel>
            <Input
              id="agency-name"
              value={draft.agencyName}
              onChange={(e) => updateDraft({ agencyName: e.target.value })}
              placeholder="Ex: Estúdio Aurora"
            />
          </Field>

          <AssetUploadField
            label="Logo"
            previewUrl={
              logoPreview ?? resolveBrandingAssetUrl(draft.logoUrl)
            }
            onSelect={handleLogoSelect}
            pending={Boolean(pendingLogo)}
          />

          <AssetUploadField
            label="Favicon"
            previewUrl={
              faviconPreview ?? resolveBrandingAssetUrl(draft.faviconUrl)
            }
            onSelect={handleFaviconSelect}
            pending={Boolean(pendingFavicon)}
          />
        </FieldGroup>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            onClick={() => void handleSave()}
            disabled={saving}
            className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
          >
            {saving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Salvar Alterações
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Restaurar padrão
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
        <h3 className="mb-4 font-semibold text-[var(--atria-primary)]">
          Pré-visualização
        </h3>

        <div
          className="mb-6 rounded-2xl p-5 text-white"
          style={{ backgroundColor: "var(--atria-sidebar, #004949)" }}
        >
          <AgencyLogo
            size="md"
            variant="sidebar"
            subtitle="Workspace da agência"
            showName
          />
        </div>

        <div className="rounded-2xl border border-[var(--atria-primary)]/10 bg-[#f7fafa] p-5">
          <AgencyLogo
            size="lg"
            variant="login"
            subtitle="Workspace inteligente"
            showName
          />
        </div>
      </Card>
    </div>
  );
}
