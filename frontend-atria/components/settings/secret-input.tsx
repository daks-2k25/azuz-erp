"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SecretInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "type"
> {
  containerClassName?: string;
}

export function SecretInput({
  className,
  containerClassName,
  ...props
}: SecretInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("relative", containerClassName)}>
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-[var(--atria-primary)]/45 transition-colors hover:bg-[var(--atria-primary)]/5 hover:text-[var(--atria-primary)]"
        aria-label={visible ? "Ocultar token" : "Mostrar token"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
