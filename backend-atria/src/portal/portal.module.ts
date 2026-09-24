import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AssetsModule } from '../assets/assets.module';
import { ClientPortalFinancialModule } from '../client-portal-financial/client-portal-financial.module';
import { ClientRequestsModule } from '../client-requests/client-requests.module';
import { ContractsModule } from '../contracts/contracts.module';
import { DeliverablesModule } from '../deliverables/deliverables.module';
import { FinanceModule } from '../finance/finance.module';
import { KanbanModule } from '../kanban/kanban.module';
import { LeadsModule } from '../leads/leads.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SlaModule } from '../sla/sla.module';
import { ClientPortalController } from './client-portal.controller';
import { ClientPortalRequestsController } from './client-portal-requests.controller';
import { PortalAuthGuard } from './guards/portal-auth.guard';
import { PortalAuthService } from './portal-auth.service';
import { PortalController } from './portal.controller';
import { PortalSessionController, PortalAuthRoutesController } from './portal-session.controller';
import { PortalService } from './portal.service';

@Module({
  imports: [
    JwtModule.register({}),
    ContractsModule,
    AssetsModule,
    NotificationsModule,
    SlaModule,
    FinanceModule,
    KanbanModule,
    ClientRequestsModule,
    ClientPortalFinancialModule,
    DeliverablesModule,
    LeadsModule,
  ],
  controllers: [
    PortalController,
    PortalSessionController,
    PortalAuthRoutesController,
    ClientPortalController,
    ClientPortalRequestsController,
  ],
  providers: [PortalService, PortalAuthService, PortalAuthGuard],
  exports: [PortalService, PortalAuthService],
})
export class PortalModule {}
