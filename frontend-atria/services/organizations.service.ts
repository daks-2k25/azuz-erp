import { apiRequest } from "./api";
import type { Organization, OrganizationWithSdrAssignments } from "./types";

export async function getAssignedOrganizations(): Promise<Organization[]> {
  return apiRequest<Organization[]>("/sdr/assigned-organizations");
}

export async function getOrganization(
  id: string,
): Promise<OrganizationWithSdrAssignments> {
  return apiRequest<OrganizationWithSdrAssignments>(`/organizations/${id}`);
}

export async function updateCrmStatus(id: string, hasCrmEnabled: boolean) {
  return apiRequest<OrganizationWithSdrAssignments>(
    `/organizations/${id}/crm-status`,
    {
      method: "PATCH",
      body: { hasCrmEnabled },
    },
  );
}

export async function replaceSdrAssignments(id: string, sdrUserIds: string[]) {
  return apiRequest<OrganizationWithSdrAssignments>(
    `/organizations/${id}/sdr-assignments`,
    {
      method: "PUT",
      body: { sdrUserIds },
    },
  );
}
