import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

/** Accepts UUIDs and legacy migrated ids (e.g. client-123, admin-456). */
export function IsEntityId(options?: { optional?: boolean; each?: boolean }) {
  const each = Boolean(options?.each);
  const optional = Boolean(options?.optional);

  const decorators = [
    IsString({ each }),
    IsNotEmpty({ each }),
  ];

  if (optional) {
    return applyDecorators(
      IsOptional(),
      ValidateIf((_, value) => value !== null && value !== undefined),
      ...decorators,
    );
  }

  return applyDecorators(...decorators);
}

export function ToUpperEnum() {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  );
}
