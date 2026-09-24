import { ContractStatus, PaymentFrequency } from '@prisma/client';
export declare class CreateContractDto {
    clientId: string;
    title: string;
    status?: ContractStatus;
    recurringValue: number;
    paymentFrequency?: PaymentFrequency;
    startDate: string;
    endDate?: string;
    termsContent: string;
    pdfUrl?: string;
}
export declare class UpdateContractDto {
    clientId?: string;
    title?: string;
    status?: ContractStatus;
    recurringValue?: number;
    paymentFrequency?: PaymentFrequency;
    startDate?: string;
    endDate?: string | null;
    termsContent?: string;
    pdfUrl?: string | null;
}
export declare class QueryContractsDto {
    clientId?: string;
    status?: ContractStatus;
}
