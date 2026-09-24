import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CreateAppUpdateDto, UpdateAppUpdateDto } from './dto/app-update.dto';
import { AppUpdatesService } from './app-updates.service';
export declare class AppUpdatesController {
    private readonly appUpdatesService;
    constructor(appUpdatesService: AppUpdatesService);
    getAccess(user: AuthenticatedUser): Promise<{
        canView: boolean;
        canManage: boolean;
        unreadCount: number;
        updateCount: number;
    }>;
    markAllAsRead(user: AuthenticatedUser): Promise<{
        success: boolean;
    }>;
    markOneAsRead(user: AuthenticatedUser, id: string): Promise<{
        success: boolean;
    }>;
    findAll(user: AuthenticatedUser): Promise<{
        isRead: boolean;
        id: string;
        title: string;
        body: string;
        visibleRoles: string[];
        isPublished: boolean;
        createdById: string;
        createdBy: {
            id: string;
            name: string;
            email: string;
        };
        companyId: string;
        createdAt: string;
        updatedAt: string;
    }[]>;
    create(user: AuthenticatedUser, dto: CreateAppUpdateDto): Promise<{
        id: string;
        title: string;
        body: string;
        visibleRoles: string[];
        isPublished: boolean;
        createdById: string;
        createdBy: {
            id: string;
            name: string;
            email: string;
        };
        companyId: string;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: string, user: AuthenticatedUser, dto: UpdateAppUpdateDto): Promise<{
        id: string;
        title: string;
        body: string;
        visibleRoles: string[];
        isPublished: boolean;
        createdById: string;
        createdBy: {
            id: string;
            name: string;
            email: string;
        };
        companyId: string;
        createdAt: string;
        updatedAt: string;
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        success: boolean;
    }>;
}
