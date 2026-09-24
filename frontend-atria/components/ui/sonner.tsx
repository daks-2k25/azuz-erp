"use client";

import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "@/contexts/theme-context";

export function Toaster({ ...props }: ToasterProps) {
  const { mode } = useTheme();

  return (
    <Sonner
      theme={mode}
      position="bottom-right"
      expand={false}
      richColors={false}
      closeButton
      icons={{
        success: <CircleCheck className="size-4 text-emerald-400" />,
        error: <CircleAlert className="size-4 text-red-400" />,
        info: <Info className="size-4 text-[#E8C39E]" />,
        warning: <TriangleAlert className="size-4 text-[#E8C39E]" />,
      }}
      toastOptions={{
        classNames: {
          toast: "atria-toast group",
          title: "text-white font-medium",
          description: "text-white/65",
          actionButton: "bg-[#E8C39E] text-[#031d1d] font-medium",
          cancelButton: "bg-white/10 text-white",
          closeButton:
            "bg-white/10 border-white/10 text-white/70 hover:bg-white/15 hover:text-white",
        },
      }}
      {...props}
    />
  );
}
