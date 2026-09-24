export declare class CreateClientReportFileDto {
    clientId: string;
    title: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    status?: string;
}
export declare class UpdateClientReportFileDto {
    clientId?: string;
    title?: string;
    fileUrl?: string;
    fileType?: string;
    uploadedBy?: string;
    status?: string;
}
export declare class QueryClientReportFilesDto {
    clientId?: string;
    status?: string;
}
export declare class ApproveClientReportFileDto {
    approvedBy: string;
}
