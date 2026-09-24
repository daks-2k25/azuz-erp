import { PrismaService } from '../prisma/prisma.service';
export type IntegrationEvent = 'post.rejected' | 'contract.signed';
export declare class IntegrationsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    notifyPostRejected(data: {
        postTitle: string;
        clientName: string;
        reason: string;
        source: 'portal' | 'internal';
        postId: string;
    }): Promise<void>;
    notifyContractSigned(data: {
        contractTitle: string;
        clientName: string;
        contractId: string;
        source: 'portal' | 'internal';
    }): Promise<void>;
    private dispatch;
    private sendSlack;
    private sendDiscord;
    private getIntegrationSettings;
}
