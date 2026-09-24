import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContractStatus, Prisma } from '@prisma/client';
import { FinanceService } from '../finance/finance.service';
import { IntegrationsService } from '../integrations/integrations.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateContractDto,
  QueryContractsDto,
  UpdateContractDto,
} from './dto/contract.dto';

const contractInclude = {
  client: {
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
      phone: true,
      street: true,
      number: true,
      city: true,
      state: true,
      zipCode: true,
      avatarUrl: true,
    },
  },
  createdBy: {
    select: { id: true, name: true, email: true, avatarUrl: true },
  },
  _count: { select: { transactions: true } },
} satisfies Prisma.ContractInclude;

type ContractWithRelations = Prisma.ContractGetPayload<{
  include: typeof contractInclude;
}>;

@Injectable()
export class ContractsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly financeService: FinanceService,
    private readonly notifications: NotificationsService,
    private readonly integrations: IntegrationsService,
  ) {}

  async findAll(query: QueryContractsDto) {
    const contracts = await this.prisma.contract.findMany({
      where: {
        clientId: query.clientId,
        status: query.status,
      },
      include: contractInclude,
      orderBy: { createdAt: 'desc' },
    });

    return contracts.map((contract) => this.toResponse(contract));
  }

  async findOne(id: string) {
    const contract = await this.ensureExists(id);
    return this.toResponse(contract);
  }

  async create(userId: string, dto: CreateContractDto) {
    await this.ensureClientExists(dto.clientId);

    const contract = await this.prisma.contract.create({
      data: {
        clientId: dto.clientId,
        title: dto.title,
        status: dto.status ?? ContractStatus.DRAFT,
        recurringValue: dto.recurringValue,
        paymentFrequency: dto.paymentFrequency,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        termsContent: dto.termsContent,
        pdfUrl: dto.pdfUrl,
        createdById: userId,
      },
      include: contractInclude,
    });

    return this.toResponse(contract);
  }

  async update(id: string, dto: UpdateContractDto) {
    const existing = await this.ensureExists(id);

    if (existing.status === ContractStatus.SIGNED && dto.status !== undefined) {
      throw new BadRequestException(
        'Signed contracts cannot change status through update. Use the sign endpoint.',
      );
    }

    if (dto.clientId) await this.ensureClientExists(dto.clientId);

    const contract = await this.prisma.contract.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate:
          dto.endDate !== undefined
            ? dto.endDate
              ? new Date(dto.endDate)
              : null
            : undefined,
      },
      include: contractInclude,
    });

    return this.toResponse(contract);
  }

  async remove(id: string) {
    const contract = await this.ensureExists(id);

    if (contract.status === ContractStatus.SIGNED) {
      throw new BadRequestException('Cannot delete a signed contract');
    }

    await this.prisma.contract.delete({ where: { id } });
  }

  async signContract(
    userId: string,
    id: string,
    source: 'portal' | 'internal' = 'internal',
  ) {
    const contract = await this.ensureExists(id);

    if (contract.status === ContractStatus.SIGNED) {
      throw new BadRequestException('Contract is already signed');
    }

    if (
      contract.status === ContractStatus.CANCELLED ||
      contract.status === ContractStatus.EXPIRED
    ) {
      throw new BadRequestException(
        'Cannot sign a cancelled or expired contract',
      );
    }

    await this.prisma.contract.update({
      where: { id },
      data: { status: ContractStatus.SIGNED },
    });

    const withClient = await this.prisma.contract.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!withClient) throw new NotFoundException('Contract not found');

    const receivables = await this.financeService.generateReceivablesFromContract(
      userId,
      withClient,
    );

    const adminUsers = await this.prisma.user.findMany({
      where: { role: { name: 'ADMIN' } },
      select: { id: true },
    });

    await this.notifications.notifyContractSigned(
      [withClient.createdById, ...adminUsers.map((u) => u.id)],
      withClient.title,
      withClient.client.companyName,
    );

    await this.integrations.notifyContractSigned({
      contractTitle: withClient.title,
      clientName: withClient.client.companyName,
      contractId: withClient.id,
      source,
    });

    const updated = await this.ensureExists(id);

    return {
      contract: this.toResponse(updated),
      receivablesGenerated: receivables.length,
      receivables,
    };
  }

  private async ensureExists(id: string): Promise<ContractWithRelations> {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: contractInclude,
    });

    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }

  private async ensureClientExists(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  private toResponse(contract: ContractWithRelations) {
    return {
      id: contract.id,
      clientId: contract.clientId,
      client: contract.client,
      title: contract.title,
      status: contract.status.toLowerCase() as
        | 'draft'
        | 'sent'
        | 'signed'
        | 'expired'
        | 'cancelled',
      recurringValue: Number(contract.recurringValue),
      paymentFrequency: contract.paymentFrequency.toLowerCase() as
        | 'monthly'
        | 'one_time',
      startDate: contract.startDate.toISOString(),
      endDate: contract.endDate?.toISOString() ?? null,
      termsContent: contract.termsContent,
      pdfUrl: contract.pdfUrl,
      createdBy: contract.createdBy,
      receivablesCount: contract._count.transactions,
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString(),
    };
  }
}
