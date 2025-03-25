import { Module } from '@nestjs/common';
import { LocalisationService } from './localisation.service';

@Module({
  providers: [LocalisationService],
  exports: [LocalisationService],
})
export class LocalisationModule {}
