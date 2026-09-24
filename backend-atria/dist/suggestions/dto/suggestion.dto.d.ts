import { SystemSuggestionStatus, SystemSuggestionType } from '@prisma/client';
export declare class CreateSuggestionDto {
    type: SystemSuggestionType;
    title: string;
    description: string;
}
export declare class UpdateSuggestionStatusDto {
    status: SystemSuggestionStatus;
}
