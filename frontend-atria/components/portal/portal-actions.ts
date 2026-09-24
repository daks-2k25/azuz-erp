import type {
  ClientReport,
  ClientPortalDeliverable,
  ClientPortalDeliverableStatus,
  CreatePortalClientRequestInput,
  DeliverableFullView,
  DeliverableItem,
  DeliverableItemStatus,
  PortalBrief,
  PortalClientRequest,
  PortalContractDetail,
  PortalRequestComment,
  ReportContentPost,
} from "@/services/types";

/** Injectable actions so the same portal UI works with session or RBAC auth. */
export interface PortalActionHandlers {
  approvePost: (postId: string) => Promise<ReportContentPost | unknown>;
  rejectPost: (
    postId: string,
    rejectionReason: string,
  ) => Promise<ReportContentPost | unknown>;
  getContract: (contractId: string) => Promise<PortalContractDetail>;
  signContract: (contractId: string) => Promise<unknown>;
  getReport: (reportId: string) => Promise<ClientReport>;
  uploadAsset: (
    file: File,
    fileType?: string,
  ) => Promise<{ id: string; fileName: string; fileUrl: string }>;
  submitBriefing: (data: {
    title: string;
    content: string;
  }) => Promise<PortalBrief>;
  listRequests: (status?: string) => Promise<PortalClientRequest[]>;
  createRequest: (
    data: CreatePortalClientRequestInput,
  ) => Promise<PortalClientRequest>;
  addRequestComment: (
    requestId: string,
    body: string,
    parentId?: string,
  ) => Promise<PortalRequestComment>;
  getDeliverableFullView: (id: string) => Promise<DeliverableFullView>;
  listDeliverables: (params?: {
    month?: number;
    year?: number;
    status?: ClientPortalDeliverableStatus;
  }) => Promise<ClientPortalDeliverable[]>;
  reviseDeliverableItem: (
    itemId: string,
    data: {
      status: DeliverableItemStatus;
      adjustmentNotes?: string | null;
    },
  ) => Promise<DeliverableItem>;
  resolveAssetUrl: (url: string) => string;
}
