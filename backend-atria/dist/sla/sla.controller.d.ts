import { UpdateClientBriefSlaDto, UpdateSlaSettingsDto } from './dto/sla.dto';
import { SlaService } from './sla.service';
export declare class SlaController {
    private readonly slaService;
    constructor(slaService: SlaService);
    getSettings(): Promise<import("./sla.utils").SlaSettingsResponse>;
    updateSettings(dto: UpdateSlaSettingsDto): Promise<import("./sla.utils").SlaSettingsResponse>;
    getDashboard(): Promise<{
        summary: {
            openTasks: number;
            openBriefs: number;
            breachedCount: number;
            atRiskCount: number;
        };
        breached: ({
            id: string;
            type: "task";
            title: string;
            clientName: string | null;
            priority: string;
            slaStatus: import("./sla.utils").SlaUiStatus;
            slaResponseDueAt: string | null;
            slaResolutionDueAt: string | null;
            firstResponseAt: string | null;
            resolvedAt: string | null;
            createdAt: string;
        } | {
            id: string;
            type: "brief";
            title: string;
            clientName: string;
            priority: string;
            status: string;
            assignee: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            slaStatus: import("./sla.utils").SlaUiStatus;
            slaResponseDueAt: string | null;
            slaResolutionDueAt: string | null;
            firstResponseAt: string | null;
            resolvedAt: string | null;
            createdAt: string;
        })[];
        atRisk: ({
            id: string;
            type: "task";
            title: string;
            clientName: string | null;
            priority: string;
            slaStatus: import("./sla.utils").SlaUiStatus;
            slaResponseDueAt: string | null;
            slaResolutionDueAt: string | null;
            firstResponseAt: string | null;
            resolvedAt: string | null;
            createdAt: string;
        } | {
            id: string;
            type: "brief";
            title: string;
            clientName: string;
            priority: string;
            status: string;
            assignee: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            slaStatus: import("./sla.utils").SlaUiStatus;
            slaResponseDueAt: string | null;
            slaResolutionDueAt: string | null;
            firstResponseAt: string | null;
            resolvedAt: string | null;
            createdAt: string;
        })[];
        tasks: {
            id: string;
            type: "task";
            title: string;
            clientName: string | null;
            priority: string;
            slaStatus: import("./sla.utils").SlaUiStatus;
            slaResponseDueAt: string | null;
            slaResolutionDueAt: string | null;
            firstResponseAt: string | null;
            resolvedAt: string | null;
            createdAt: string;
        }[];
        briefs: {
            id: string;
            type: "brief";
            title: string;
            clientName: string;
            priority: string;
            status: string;
            assignee: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            slaStatus: import("./sla.utils").SlaUiStatus;
            slaResponseDueAt: string | null;
            slaResolutionDueAt: string | null;
            firstResponseAt: string | null;
            resolvedAt: string | null;
            createdAt: string;
        }[];
    }>;
    updateBrief(id: string, dto: UpdateClientBriefSlaDto): Promise<{
        id: string;
        title: string;
        content: string;
        clientId: string;
        clientName: string;
        status: string;
        priority: string;
        assignedTo: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        slaStatus: import("./sla.utils").SlaUiStatus;
        slaResponseDueAt: string | null;
        slaResolutionDueAt: string | null;
        firstResponseAt: string | null;
        resolvedAt: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
}
