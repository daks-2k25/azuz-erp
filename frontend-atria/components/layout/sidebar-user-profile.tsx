"use client";

import { useState } from "react";
import { Camera, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/users/user-avatar";
import { UserAvatarPicker } from "@/components/users/user-avatar-picker";
import { ROLE_LABELS } from "@/lib/permissions";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { usersService } from "@/services";

interface SidebarUserProfileProps {
  onAction?: () => void;
  className?: string;
  collapsed?: boolean;
}

export function SidebarUserProfile({
  onAction,
  className,
  collapsed = false,
}: SidebarUserProfileProps) {
  const { user, logout, updateUser } = useAuth();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  async function handleLogout() {
    onAction?.();
    await logout();
  }

  function openAvatarDialog() {
    setAvatarUrl(user?.avatarUrl ?? null);
    setAvatarOpen(true);
    onAction?.();
  }

  const avatarButton = (
    <button
      type="button"
      onClick={openAvatarDialog}
      className="group relative shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C39E]"
      title="Alterar foto de perfil"
    >
      <UserAvatar
        name={user?.name ?? "Usuário"}
        avatarUrl={user?.avatarUrl}
        className={cn(
          "border border-white/15 ring-2 ring-[#E8C39E]/20",
          collapsed ? "size-9" : "size-10",
        )}
        fallbackClassName="bg-[#E8C39E]/90 text-xs font-bold text-[#004949]"
      />
      <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/35">
        <Camera className="size-3.5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
      <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#003838] bg-emerald-400" />
    </button>
  );

  return (
    <div
      className={cn(
        "shrink-0 transition-all duration-300 ease-in-out",
        collapsed ? "p-2" : "p-3",
        className,
      )}
    >
      {collapsed ? (
        <div className="flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger render={<div className="flex justify-center" />}>
              {avatarButton}
            </TooltipTrigger>
            <TooltipContent side="right">
              {user?.name ?? "Usuário"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => void handleLogout()}
                  aria-label="Sair da conta"
                />
              }
            >
              <LogOut className="size-4" />
            </TooltipTrigger>
            <TooltipContent side="right">Sair da conta</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg shadow-black/10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {avatarButton}

            <div className="min-w-0 flex-1 opacity-100 transition-opacity duration-300 ease-in-out">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name ?? "Usuário"}
              </p>
              <p className="truncate text-[11px] text-white/45">
                {user?.role ? ROLE_LABELS[user.role.toLowerCase()] ?? user.role : "Membro"}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            onClick={() => void handleLogout()}
          >
            <LogOut className="size-4" />
            Sair da conta
          </Button>
        </div>
      )}

      <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--atria-primary)]">
              Foto de perfil
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <UserAvatarPicker
              name={user?.name ?? "Usuário"}
              value={avatarUrl}
              onChange={(next) => setAvatarUrl(next)}
              onUpload={async (file) => {
                const updated = await usersService.uploadMyAvatar(file);
                updateUser({
                  avatarUrl: updated.avatarUrl ?? undefined,
                });
                toast.success("Foto atualizada!");
                return updated.avatarUrl ?? "";
              }}
              onRemove={async () => {
                await usersService.removeMyAvatar();
                updateUser({ avatarUrl: undefined });
                setAvatarUrl(null);
                toast.success("Foto removida.");
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAvatarOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
