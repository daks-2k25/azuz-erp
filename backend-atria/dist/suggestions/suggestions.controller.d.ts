import { type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CreateSuggestionDto, UpdateSuggestionStatusDto } from './dto/suggestion.dto';
import { SuggestionsService } from './suggestions.service';
export declare class SuggestionsController {
    private readonly suggestionsService;
    constructor(suggestionsService: SuggestionsService);
    create(user: AuthenticatedUser, dto: CreateSuggestionDto): Promise<{
        id: string;
        type: string;
        title: string;
        description: string;
        status: string;
        submittedById: string;
        submittedBy: {
            id: string;
            name: string;
            email: string;
        };
        companyId: string;
        createdAt: string;
        updatedAt: string;
    }>;
    findMine(user: AuthenticatedUser): Promise<{
        id: string;
        type: string;
        title: string;
        description: string;
        status: string;
        submittedById: string;
        submittedBy: {
            id: string;
            name: string;
            email: string;
        };
        companyId: string;
        createdAt: string;
        updatedAt: string;
    }[]>;
    findAll(user: AuthenticatedUser): Promise<{
        id: string;
        type: string;
        title: string;
        description: string;
        status: string;
        submittedById: string;
        submittedBy: {
            id: string;
            name: string;
            email: string;
        };
        companyId: string;
        createdAt: string;
        updatedAt: string;
    }[]>;
    updateStatus(id: string, user: AuthenticatedUser, dto: UpdateSuggestionStatusDto): Promise<{
        id: string;
        type: string;
        title: string;
        description: string;
        status: string;
        submittedById: string;
        submittedBy: {
            id: string;
            name: string;
            email: string;
        };
        companyId: string;
        createdAt: string;
        updatedAt: string;
    }>;
}
