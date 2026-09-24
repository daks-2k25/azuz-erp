import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';

export interface LeadArrivalNotificationInput {
  leadName: string;
  organizationId: string;
  companyId: string;
  actorId?: string;
}

@Injectable()
export class LeadNotificationService {
  private readonly logger = new Logger(LeadNotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  notifyLeadCreated(input: LeadArrivalNotificationInput): void {
    void this.dispatch(input).catch((error: unknown) => {
      const detail = error instanceof Error ? error.stack : String(error);
      this.logger.error(
        `Failed to notify representatives about lead "${input.leadName}": ${detail}`,
      );
    });
  }

  private async dispatch(input: LeadArrivalNotificationInput): Promise<void> {
    const representativeIds = await this.resolveRepresentativeUserIds(
      input.organizationId,
    );
    const recipientIds = representativeIds.filter(
      (userId) => userId !== input.actorId,
    );

    if (recipientIds.length === 0) {
      return;
    }

    await this.notifications.notifyNewLeadInKanban(
      recipientIds,
      input.leadName,
      { companyId: input.companyId },
    );
  }

  private async resolveRepresentativeUserIds(
    organizationId: string,
  ): Promise<string[]> {
    const assignments = await this.prisma.crmSdrAssignment.findMany({
      where: {
        organizationId,
        user: { isActive: true },
      },
      select: { userId: true },
    });

    return [...new Set(assignments.map((assignment) => assignment.userId))];
  }
}
