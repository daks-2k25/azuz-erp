import { Module } from '@nestjs/common';
import { LeadsModule } from '../leads/leads.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { SdrController } from './sdr.controller';

@Module({
  imports: [LeadsModule],
  controllers: [OrganizationsController, SdrController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
