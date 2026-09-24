const BRASIL_API = "https://brasilapi.com.br/api";

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatDocument(value: string) {
  const digits = onlyDigits(value);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function formatZipCode(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function isValidCnpj(digits: string) {
  return digits.length === 14;
}

export function isValidCpf(digits: string) {
  return digits.length === 11;
}

export interface AddressLookupResult {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  companyName?: string;
}

export async function lookupAddressByZipCode(
  zipCode: string,
): Promise<AddressLookupResult | null> {
  const digits = onlyDigits(zipCode);
  if (digits.length !== 8) return null;

  try {
    const response = await fetch(`${BRASIL_API}/cep/v1/${digits}`);
    if (!response.ok) return null;
    const data = (await response.json()) as {
      street?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
    };

    return {
      street: data.street ?? "",
      neighborhood: data.neighborhood ?? "",
      city: data.city ?? "",
      state: data.state ?? "",
      zipCode: formatZipCode(digits),
    };
  } catch {
    return null;
  }
}

export async function lookupAddressByCnpj(
  document: string,
): Promise<AddressLookupResult | null> {
  const digits = onlyDigits(document);
  if (!isValidCnpj(digits)) return null;

  try {
    const response = await fetch(`${BRASIL_API}/cnpj/v1/${digits}`);
    if (!response.ok) return null;
    const data = (await response.json()) as {
      razao_social?: string;
      logradouro?: string;
      bairro?: string;
      municipio?: string;
      uf?: string;
      cep?: string;
    };

    return {
      companyName: data.razao_social ?? undefined,
      street: data.logradouro ?? "",
      neighborhood: data.bairro ?? "",
      city: data.municipio ?? "",
      state: data.uf ?? "",
      zipCode: data.cep ? formatZipCode(data.cep) : "",
    };
  } catch {
    return null;
  }
}
