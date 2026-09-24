"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/users/user-avatar";
import { cn } from "@/lib/utils";

interface UserAvatarPickerProps {
  name: string;
  /** Current avatar URL (relative or absolute), or local blob preview */
  value: string | null;
  onChange: (next: string | null, file?: File | null) => void;
  /** When set, picking a file uploads immediately via this handler */
  onUpload?: (file: File) => Promise<string>;
  onRemove?: () => Promise<void> | void;
  disabled?: boolean;
  className?: string;
}

export function UserAvatarPicker({
  name,
  value,
  onChange,
  onUpload,
  onRemove,
  disabled,
  className,
}: UserAvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Selecione uma imagem PNG, JPG ou WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB.");
      return;
    }

    if (onUpload) {
      setUploading(true);
      try {
        const url = await onUpload(file);
        onChange(url, file);
      } catch {
        setError("Não foi possível enviar a imagem.");
      } finally {
        setUploading(false);
      }
      return;
    }

    const preview = URL.createObjectURL(file);
    onChange(preview, file);
  }

  async function handleRemove() {
    setError(null);
    if (onRemove) {
      setUploading(true);
      try {
        await onRemove();
        onChange(null, null);
      } catch {
        setError("Não foi possível remover a foto.");
      } finally {
        setUploading(false);
      }
      return;
    }
    onChange(null, null);
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <UserAvatar
            name={name || "Usuário"}
            avatarUrl={value}
            size="lg"
            className="size-20 border border-[var(--atria-primary)]/15"
            fallbackClassName="bg-[var(--atria-accent)]/40 text-base font-bold text-[var(--atria-primary)]"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            disabled={disabled || uploading}
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="mr-2 size-4" />
            {value ? "Trocar foto" : "Enviar foto"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || uploading}
              className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => void handleRemove()}
            >
              <Trash2 className="mr-2 size-4" />
              Remover
            </Button>
          )}
          <p className="text-[11px] text-[var(--atria-primary)]/45">
            PNG, JPG ou WEBP · máx. 5MB
          </p>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
