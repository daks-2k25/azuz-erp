import { ContentPlatform, ContentPostFormat } from '@prisma/client';
export declare class GenerateBriefPlanDto {
    brief: string;
    clientId: string;
    platform?: ContentPlatform;
    objective?: string;
}
export declare class BriefPlanIdeaDto {
    title: string;
    copy: string;
    format: ContentPostFormat;
    mediaConcept: string;
    suggestedDate: string;
}
export declare class CreateBriefPlanDto {
    clientId: string;
    platform: ContentPlatform;
    ideas: BriefPlanIdeaDto[];
    createKanbanTasks?: boolean;
}
