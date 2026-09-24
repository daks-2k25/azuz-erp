export declare enum CreationDeliverableType {
    POST_INSTAGRAM = "post_instagram",
    POST_REELS = "post_reels",
    POST_CAROUSEL = "post_carousel",
    POST_STATIC = "post_static",
    POST_STORY = "post_story",
    MEETING = "reuniao",
    DELIVERY = "entrega"
}
export declare enum CreationDeliverableStatus {
    DRAFT = "draft",
    PENDING = "pending",
    APPROVED = "approved"
}
export declare class CreateDeliverableDto {
    clientId: string;
    title: string;
    type: CreationDeliverableType;
    scheduledAt: string;
    referenceUrl?: string;
    status: CreationDeliverableStatus;
}
export declare class QueryClientPipelineDto {
    clientId: string;
    from?: string;
    to?: string;
}
export declare class UpdateItemStatusDto {
    status: CreationDeliverableStatus;
}
