import { ClientFinancialAttachmentType } from '@prisma/client';
export declare class CreateClientFinancialAttachmentDto {
    fileType: ClientFinancialAttachmentType;
    description?: string;
}
