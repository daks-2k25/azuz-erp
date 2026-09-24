import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { ClockRemindersService } from './application/clock-reminders.service';
import { EmployeeProfilesService } from './application/employee-profiles.service';
import { Clock } from './application/ports/clock';
import { ClockReminderRepository } from './application/ports/clock-reminder.repository';
import { EmployeeProfileRepository } from './application/ports/employee-profile.repository';
import { ReminderNotifier } from './application/ports/reminder-notifier';
import { TimeClockEntryRepository } from './application/ports/time-clock-entry.repository';
import { WorkScheduleRepository } from './application/ports/work-schedule.repository';
import { TimeClockService } from './application/time-clock.service';
import { WorkSchedulesService } from './application/work-schedules.service';
import { BellReminderNotifier } from './infrastructure/bell-reminder-notifier';
import { ClockReminderScheduler } from './infrastructure/clock-reminder.scheduler';
import { PrismaClockReminderRepository } from './infrastructure/prisma-clock-reminder.repository';
import { PrismaEmployeeProfileRepository } from './infrastructure/prisma-employee-profile.repository';
import { PrismaTimeClockEntryRepository } from './infrastructure/prisma-time-clock-entry.repository';
import { PrismaWorkScheduleRepository } from './infrastructure/prisma-work-schedule.repository';
import { SystemClock } from './infrastructure/system-clock';
import { EmployeeProfilesController } from './presentation/employee-profiles.controller';
import { MyEmployeeProfileController } from './presentation/my-employee-profile.controller';
import { MyTimeClockController } from './presentation/my-time-clock.controller';
import { WorkSchedulesController } from './presentation/work-schedules.controller';

@Module({
  imports: [NotificationsModule],
  controllers: [
    WorkSchedulesController,
    EmployeeProfilesController,
    MyEmployeeProfileController,
    MyTimeClockController,
  ],
  providers: [
    { provide: Clock, useClass: SystemClock },
    { provide: WorkScheduleRepository, useClass: PrismaWorkScheduleRepository },
    {
      provide: EmployeeProfileRepository,
      useClass: PrismaEmployeeProfileRepository,
    },
    {
      provide: TimeClockEntryRepository,
      useClass: PrismaTimeClockEntryRepository,
    },
    {
      provide: ClockReminderRepository,
      useClass: PrismaClockReminderRepository,
    },
    { provide: ReminderNotifier, useClass: BellReminderNotifier },
    WorkSchedulesService,
    EmployeeProfilesService,
    TimeClockService,
    ClockRemindersService,
    ClockReminderScheduler,
  ],
  exports: [EmployeeProfilesService, WorkSchedulesService, TimeClockService],
})
export class TimeTrackingModule {}
