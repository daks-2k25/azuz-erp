import { useAuth } from "@/contexts/auth-context";
import { useCompany } from "@/contexts/company-context";

export function useCompanyId(): string | undefined {
  const { user } = useAuth();
  const { company } = useCompany();
  return user?.companyId ?? company?.id ?? undefined;
}
