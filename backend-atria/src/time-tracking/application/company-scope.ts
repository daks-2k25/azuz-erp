import { DEFAULT_COMPANY_ID } from '../../company/company.constants';

/** Usuários legados podem não ter empresa no token; eles pertencem à empresa padrão. */
export function resolveCompanyId(companyId: string | null): string {
  return companyId ?? DEFAULT_COMPANY_ID;
}
