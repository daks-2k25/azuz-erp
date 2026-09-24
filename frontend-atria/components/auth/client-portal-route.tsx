"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { canAccessClientPortal } from "@/lib/crm-access";

export function ClientPortalRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!canAccessClientPortal(user?.role, user?.hasCrmEnabled)) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router, user?.hasCrmEnabled, user?.role]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8F6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#004949] border-t-transparent" />
      </div>
    );
  }

  if (
    !isAuthenticated ||
    !canAccessClientPortal(user?.role, user?.hasCrmEnabled)
  ) {
    return null;
  }

  return <>{children}</>;
}
