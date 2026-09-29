import { Injectable } from '@nestjs/common';
import { Prisma, TimeAdjustmentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { TimeClockEntry } from '../domain/time-clock-entry';
import {
  AppendEntryData,
  EntryTypeDecider,
  TimeClockEntryRepository,
} from '../application/ports/time-clock-entry.repository';

type TransactionClient = Prisma.TransactionClient;

@Injectable()
export class PrismaTimeClockEntryRepository extends TimeClockEntryRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  listEffectiveEntries(
    employeeProfileId: string,
    workDate: Date,
  ): Promise<TimeClockEntry[]> {
    return findEffectiveEntries(this.prisma, employeeProfileId, workDate);
  }

  append(
    data: AppendEntryData,
    decideEntryType: EntryTypeDecider,
  ): Promise<TimeClockEntry> {
    return this.prisma.$transaction(async (transaction) => {
      // Incrementar o contador trava a linha da empresa até o fim da transação,
      // serializando registros simultâneos (evita marcação e NSR duplicados).
      const sequenceNumber = await nextSequenceNumber(
        transaction,
        data.companyId,
      );

      const entriesOfDay = await findEffectiveEntries(
        transaction,
        data.employeeProfileId,
        data.workDate,
      );
      const entryType = decideEntryType(entriesOfDay);

      return transaction.timeClockEntry.create({
        data: {
          companyId: data.companyId,
          employeeProfileId: data.employeeProfileId,
          sequenceNumber,
          entryType,
          workDate: data.workDate,
          recordedAt: data.recordedAt,
        },
      });
    });
  }
}

async function nextSequenceNumber(
  transaction: TransactionClient,
  companyId: string,
): Promise<bigint> {
  const counter = await transaction.timeClockCounter.upsert({
    where: { companyId },
    create: { companyId, lastSequenceNumber: 1 },
    update: { lastSequenceNumber: { increment: 1 } },
  });
  return counter.lastSequenceNumber;
}

function findEffectiveEntries(
  client: TransactionClient,
  employeeProfileId: string,
  workDate: Date,
): Promise<TimeClockEntry[]> {
  return client.timeClockEntry.findMany({
    where: {
      employeeProfileId,
      workDate,
      replacedBy: { none: { status: TimeAdjustmentStatus.APPROVED } },
    },
    orderBy: [{ recordedAt: 'asc' }, { sequenceNumber: 'asc' }],
  });
}
