export declare enum InternalReviewAction {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class InternalReviewDto {
    status: InternalReviewAction;
    note?: string;
}
