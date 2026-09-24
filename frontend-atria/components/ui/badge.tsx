import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--atria-primary)] text-white",
        secondary:
          "border-transparent bg-[var(--atria-accent)]/30 text-[var(--atria-primary)]",
        outline:
          "border-[var(--atria-primary)]/20 bg-white text-[var(--atria-primary)]",
        success: "border-transparent bg-green-100 text-green-700",
        warning:
          "border-transparent bg-[var(--atria-accent)]/40 text-[var(--atria-primary)]",
        destructive: "border-transparent bg-red-100 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
