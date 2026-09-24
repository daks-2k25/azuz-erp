import { Module, forwardRef } from '@nestjs/common';
import { DeliverablesModule } from '../deliverables/deliverables.module';
import { InternalApprovalsController } from './internal-approvals.controller';
import { InternalApprovalsService } from './internal-approvals.service';

@Module({
  imports: [forwardRef(() => DeliverablesModule)],
  controllers: [InternalApprovalsController],
  providers: [InternalApprovalsService],
})
export class InternalApprovalsModule {}
