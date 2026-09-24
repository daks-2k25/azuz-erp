import { TransactionStatus, TransactionType } from '@prisma/client';
export declare class ImportTransactionItemDto {
    categoryName: string;
    description: string;
    amount: number;
    date: string;
    dueDate?: string;
    status?: TransactionStatus;
    type?: TransactionType;
    companyName?: string;
    managerName?: string;
    serviceName?: string;
    reference?: string;
}
export declare class BulkImportTransactionsDto {
    transactions: ImportTransactionItemDto[];
}
