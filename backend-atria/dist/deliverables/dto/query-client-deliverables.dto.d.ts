import { DeliverableApprovalStatus } from '@prisma/client';
export declare enum ClientPortalDeliverableStatus {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    REQUIRES_ADJUSTMENT = "REQUIRES_ADJUSTMENT"
}
export declare function mapClientPortalDeliverableStatus(status: ClientPortalDeliverableStatus): DeliverableApprovalStatus;
export declare class QueryClientDeliverablesDto {
    month?: number;
    year?: number;
    status?: ClientPortalDeliverableStatus;
}
