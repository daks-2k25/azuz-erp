import { Message } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessageService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createMessageDto: CreateMessageDto): Promise<Message>;
}
