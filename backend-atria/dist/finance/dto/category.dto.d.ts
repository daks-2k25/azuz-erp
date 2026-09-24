import { TransactionType } from '@prisma/client';
export declare class CreateCategoryDto {
    name: string;
    type: TransactionType;
    color?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    color?: string;
}
