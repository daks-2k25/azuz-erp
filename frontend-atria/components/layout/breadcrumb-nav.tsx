"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getBreadcrumbs } from "@/lib/navigation-utils";

export function BreadcrumbNav() {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 md:flex">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="size-3.5 shrink-0 text-[var(--atria-primary)]/30" />
              )}
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="truncate text-[var(--atria-primary)]/55 transition-colors hover:text-[var(--atria-primary)]"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={`truncate ${
                    isLast
                      ? "font-medium text-[var(--atria-primary)]"
                      : "text-[var(--atria-primary)]/55"
                  }`}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
