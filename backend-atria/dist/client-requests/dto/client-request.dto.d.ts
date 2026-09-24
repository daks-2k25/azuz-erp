import { ClientRequestContentType, ClientRequestStatus, KanbanTaskPriority } from '@prisma/client';
export declare class CreateClientRequestDto {
    clientId?: string;
    title: string;
    description?: string;
    contentType?: ClientRequestContentType;
    referenceLinks?: string[];
    attachments?: unknown;
    status?: ClientRequestStatus;
    relatedTaskId?: string;
}
export declare class UpdateClientRequestDto {
    clientId?: string;
    title?: string;
    description?: string;
    contentType?: ClientRequestContentType;
    referenceLinks?: string[];
    attachments?: unknown;
    status?: ClientRequestStatus;
    relatedTaskId?: string;
}
export declare class QueryClientRequestsDto {
    clientId?: string;
    status?: ClientRequestStatus;
    contentType?: ClientRequestContentType;
}
export declare class CreateClientRequestCommentDto {
    body: string;
    parentId?: string;
}
export declare class RejectClientRequestDto {
    rejectionReason: string;
}
export declare class ConvertClientRequestToTaskDto {
    title?: string;
    description?: string;
    columnId?: string;
    priority?: KanbanTaskPriority;
    dueDate?: string;
    deliveryDate?: string;
    publicationDate?: string;
    assigneeId?: string;
    assigneeIds?: string[];
    assignedGroupId?: string;
}
