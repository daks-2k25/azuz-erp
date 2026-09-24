"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ExternalLinkChip } from "@/components/ui/external-link-chip";
import { isValidReferenceUrl } from "@/lib/link-utils";

interface ReferenceUrlFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ReferenceUrlField({
  id = "referenceUrl",
  label = "Link de referência",
  value,
  onChange,
  placeholder = "https://figma.com/... ou Google Drive, Meet, Notion",
}: ReferenceUrlFieldProps) {
  const showPreview = value.trim() && isValidReferenceUrl(value.trim());

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {showPreview && (
        <div className="mt-2">
          <ExternalLinkChip url={value.trim()} />
        </div>
      )}
    </Field>
  );
}
