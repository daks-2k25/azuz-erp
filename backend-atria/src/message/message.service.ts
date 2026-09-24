import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    return this.prisma.message.create({
      data: {
        content: createMessageDto.content,
      },
    });
  }
}
