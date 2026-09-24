import { DeliverableItemStatus } from '@prisma/client';
export declare class RevisionDeliverableItemDto {
    status: DeliverableItemStatus;
    adjustmentNotes?: string | null;
    feedbackNotes?: string | null;
}
