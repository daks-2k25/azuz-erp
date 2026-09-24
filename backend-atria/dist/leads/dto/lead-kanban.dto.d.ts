export declare class AddLeadToKanbanDto {
    leadId?: string;
    name?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    city?: string;
    neighborhood?: string;
    category?: string;
    placeId?: string;
    source?: string;
    organizationId?: string | null;
}
export declare class UpdateLeadStatusDto {
    status?: string;
    stageId?: string;
    order?: number;
}
