import { RoleName } from '@prisma/client';
export declare class CreateAppUpdateDto {
    title: string;
    body: string;
    visibleRoles: RoleName[];
    isPublished?: boolean;
}
export declare class UpdateAppUpdateDto {
    title?: string;
    body?: string;
    visibleRoles?: RoleName[];
    isPublished?: boolean;
}
