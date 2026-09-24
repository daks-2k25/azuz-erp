export declare class CreateAgendaEventDto {
    title: string;
    description?: string;
    eventDate: string;
    startTime?: string;
    endTime?: string;
    eventType: string;
    recurrence?: string;
    participants?: unknown[];
    meetingLink?: string;
    location?: string;
    priority?: string;
    status?: string;
}
export declare class UpdateAgendaEventDto {
    title?: string;
    description?: string;
    eventDate?: string;
    startTime?: string;
    endTime?: string;
    eventType?: string;
    recurrence?: string;
    participants?: unknown[];
    meetingLink?: string;
    location?: string;
    priority?: string;
    status?: string;
}
export declare class QueryAgendaEventsDto {
    from?: string;
    to?: string;
}
export declare class ConfirmAgendaEventDto {
    userId: string;
}
