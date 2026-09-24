"use client";

import { AgencyLogo } from "@/components/branding/agency-logo";
import { cn } from "@/lib/utils";

interface SidebarBrandProps {
  collapsed?: boolean;
}

export function SidebarBrand({ collapsed = false }: SidebarBrandProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 transition-all duration-300 ease-in-out",
        collapsed ? "justify-center" : "justify-between",
      )}
    >
      <AgencyLogo
        size={collapsed ? "sm" : "md"}
        variant="sidebar"
        subtitle={collapsed ? undefined : "Workspace da agência"}
        showName={!collapsed}
        className={cn(collapsed ? "justify-center" : "min-w-0 flex-1")}
      />
    </div>
  );
}
