import { apiRequest } from "./api";
import type {
  Contract,
  CreateContractInput,
  SignContractResult,
  ContractStatus,
  UpdateContractInput,
} from "./types";

export async function getContracts(params?: {
  clientId?: string;
  status?: ContractStatus;
}): Promise<Contract[]> {
  const entries = Object.entries(params ?? {})
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => [
      k,
      k === "status" ? String(v).toUpperCase() : String(v),
    ]);

  const query = new URLSearchParams(entries).toString();

  return apiRequest<Contract[]>(`/contracts${query ? `?${query}` : ""}`);
}

export async function getContract(id: string): Promise<Contract> {
  return apiRequest<Contract>(`/contracts/${id}`);
}

export async function createContract(
  data: CreateContractInput,
): Promise<Contract> {
  return apiRequest<Contract>("/contracts", {
    method: "POST",
    body: {
      ...data,
      status: data.status?.toUpperCase(),
      paymentFrequency: data.paymentFrequency?.toUpperCase(),
    },
  });
}

export async function updateContract(
  id: string,
  data: UpdateContractInput,
): Promise<Contract> {
  const body: Record<string, unknown> = { ...data };
  if (data.status) body.status = data.status.toUpperCase();
  if (data.paymentFrequency) {
    body.paymentFrequency = data.paymentFrequency.toUpperCase();
  }

  return apiRequest<Contract>(`/contracts/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function deleteContract(id: string): Promise<void> {
  return apiRequest<void>(`/contracts/${id}`, { method: "DELETE" });
}

export async function signContract(id: string): Promise<SignContractResult> {
  return apiRequest<SignContractResult>(`/contracts/${id}/sign`, {
    method: "PATCH",
    body: {},
  });
}
