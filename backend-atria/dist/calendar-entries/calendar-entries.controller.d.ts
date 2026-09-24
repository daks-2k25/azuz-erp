import { CalendarEntriesService } from './calendar-entries.service';
import { CreateCalendarEntryDto, QueryCalendarEntriesDto, UpdateCalendarEntryDto } from './dto/calendar-entry.dto';
export declare class CalendarEntriesController {
    private readonly calendarEntriesService;
    constructor(calendarEntriesService: CalendarEntriesService);
    findAll(query: QueryCalendarEntriesDto): Promise<{
        id: string;
        month: number;
        year: number;
        clientId: string;
        client: {
            id: string;
            companyName: string;
        } | null;
        artType: string;
        plannedDate: string;
        designerId: string;
        title: string;
        description: string | null;
        taskId: string | null;
        productionDeadline: string | null;
        storyQuantity: number | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        month: number;
        year: number;
        clientId: string;
        client: {
            id: string;
            companyName: string;
        } | null;
        artType: string;
        plannedDate: string;
        designerId: string;
        title: string;
        description: string | null;
        taskId: string | null;
        productionDeadline: string | null;
        storyQuantity: number | null;
        createdAt: string;
        updatedAt: string;
    }>;
    create(dto: CreateCalendarEntryDto): Promise<{
        id: string;
        month: number;
        year: number;
        clientId: string;
        client: {
            id: string;
            companyName: string;
        } | null;
        artType: string;
        plannedDate: string;
        designerId: string;
        title: string;
        description: string | null;
        taskId: string | null;
        productionDeadline: string | null;
        storyQuantity: number | null;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: string, dto: UpdateCalendarEntryDto): Promise<{
        id: string;
        month: number;
        year: number;
        clientId: string;
        client: {
            id: string;
            companyName: string;
        } | null;
        artType: string;
        plannedDate: string;
        designerId: string;
        title: string;
        description: string | null;
        taskId: string | null;
        productionDeadline: string | null;
        storyQuantity: number | null;
        createdAt: string;
        updatedAt: string;
    }>;
    remove(id: string): Promise<void>;
}
