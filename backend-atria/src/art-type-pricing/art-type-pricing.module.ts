import { Module } from '@nestjs/common';
import { ArtTypePricingController } from './art-type-pricing.controller';
import { ArtTypePricingService } from './art-type-pricing.service';

@Module({
  controllers: [ArtTypePricingController],
  providers: [ArtTypePricingService],
  exports: [ArtTypePricingService],
})
export class ArtTypePricingModule {}
