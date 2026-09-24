export declare class CreateCalendarEntryDto {
    month: number;
    year: number;
    clientId: string;
    artType: string;
    plannedDate: string;
    designerId: string;
    title: string;
    description?: string;
    taskId?: string;
    productionDeadline?: string;
    storyQuantity?: number;
}
export declare class UpdateCalendarEntryDto {
    month?: number;
    year?: number;
    clientId?: string;
    artType?: string;
    plannedDate?: string;
    designerId?: string;
    title?: string;
    description?: string;
    taskId?: string;
    productionDeadline?: string;
    storyQuantity?: number;
}
export declare class QueryCalendarEntriesDto {
    year?: number;
    month?: number;
    clientId?: string;
}
