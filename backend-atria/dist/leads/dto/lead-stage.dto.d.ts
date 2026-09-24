export declare class CreateLeadStageDto {
    name: string;
    color?: string;
    order?: number;
}
export declare class UpdateLeadStageDto {
    name?: string;
    color?: string;
    order?: number;
}
export declare class ReorderLeadStagesDto {
    ids: string[];
}
