import { PrismaClient } from '@prisma/client';
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
export declare const PRISMA_TRANSACTION_OPTIONS: {
    readonly maxWait: 10000;
    readonly timeout: 20000;
};
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
