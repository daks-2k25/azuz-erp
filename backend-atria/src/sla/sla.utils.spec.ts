import { KanbanTaskPriority, KanbanTaskStatus } from '@prisma/client';
import {
  computeSlaDueDates,
  computeSlaStatus,
  DEFAULT_SLA_SETTINGS,
} from './sla.utils';

describe('SLA utils', () => {
  const createdAt = new Date('2026-01-01T10:00:00.000Z');

  it('computes due dates for MEDIUM priority without throwing', () => {
    const due = computeSlaDueDates(
      KanbanTaskPriority.MEDIUM,
      createdAt,
      DEFAULT_SLA_SETTINGS,
    );

    expect(due.slaResponseDueAt.toISOString()).toBe(
      '2026-01-01T18:00:00.000Z',
    );
    expect(due.slaResolutionDueAt.toISOString()).toBe(
      '2026-01-04T10:00:00.000Z',
    );
  });

  it('returns not_tracked when both due dates are null', () => {
    expect(
      computeSlaStatus({
        slaResponseDueAt: null,
        slaResolutionDueAt: null,
        firstResponseAt: null,
        resolvedAt: null,
      }),
    ).toBe('not_tracked');
  });

  it('handles null createdAt safely when approaching response', () => {
    const status = computeSlaStatus({
      createdAt: null,
      slaResponseDueAt: new Date(Date.now() + 30 * 60 * 1000),
      slaResolutionDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      firstResponseAt: null,
      resolvedAt: null,
    });

    expect(['ok', 'approaching_response']).toContain(status);
  });

  it('marks response_breached when response window elapsed', () => {
    expect(
      computeSlaStatus({
        createdAt,
        slaResponseDueAt: new Date('2026-01-01T11:00:00.000Z'),
        slaResolutionDueAt: new Date('2026-01-02T10:00:00.000Z'),
        firstResponseAt: null,
        resolvedAt: null,
      }),
    ).toBe('response_breached');
  });

  it('marks met when resolved before resolution due', () => {
    expect(
      computeSlaStatus({
        createdAt,
        slaResponseDueAt: new Date('2026-01-01T18:00:00.000Z'),
        slaResolutionDueAt: new Date('2026-01-04T10:00:00.000Z'),
        firstResponseAt: new Date('2026-01-01T12:00:00.000Z'),
        resolvedAt: new Date('2026-01-02T10:00:00.000Z'),
      }),
    ).toBe('met');
  });

  it('marks resolution_breached when resolved late', () => {
    expect(
      computeSlaStatus({
        createdAt,
        slaResponseDueAt: new Date('2026-01-01T18:00:00.000Z'),
        slaResolutionDueAt: new Date('2026-01-02T10:00:00.000Z'),
        firstResponseAt: new Date('2026-01-01T12:00:00.000Z'),
        resolvedAt: new Date('2026-01-03T10:00:00.000Z'),
      }),
    ).toBe('resolution_breached');
  });
});
