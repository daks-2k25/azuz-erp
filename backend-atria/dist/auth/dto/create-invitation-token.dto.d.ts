import { RoleName } from '@prisma/client';
export declare class CreateInvitationTokenDto {
    role: RoleName;
    expiresInDays?: number;
}
