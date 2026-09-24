import { Message } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    create(createMessageDto: CreateMessageDto): Promise<Message>;
    findAll(): string;
}
