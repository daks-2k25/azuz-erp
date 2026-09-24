import { LeadStatus } from '@prisma/client';
export declare const SDR_ZONE_STATUSES: readonly LeadStatus[];
export declare const CLIENT_ZONE_STATUSES: readonly LeadStatus[];
export type CrmMoveZone = 'all' | 'sdr' | 'client' | 'none';
export declare function isSdrZoneStatus(status: string): boolean;
export declare function isClientZoneStatus(status: string): boolean;
export declare function resolveCrmMoveZone(role: string): CrmMoveZone;
export declare function assertLeadStatusMoveAllowed(role: string, fromStatus: string, toStatus: string): void;
