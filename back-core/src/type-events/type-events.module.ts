import { Module } from '@nestjs/common';
import { TypeEventsService } from './type-events.service';
import { TypeEventsController } from './type-events.controller';
import { CheckRoleGuard } from '../utils/guards/check-role.guard';

@Module({
  providers: [TypeEventsService, CheckRoleGuard],
  controllers: [TypeEventsController],
})
export class TypeEventsModule {}
