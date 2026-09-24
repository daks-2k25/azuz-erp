import { cn } from "@/lib/utils";

const CLIENT_NAME_CLASS = "font-extrabold uppercase tracking-wide";

interface ClientNameProps {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}

export function ClientName({
  children,
  className,
  as: Comp = "span",
}: ClientNameProps) {
  return <Comp className={cn(CLIENT_NAME_CLASS, className)}>{children}</Comp>;
}
