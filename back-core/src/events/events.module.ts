import { Module } from '@nestjs/common';
import { AssociationsModule } from '../associations/associations.module';
import { UsersModule } from '../users/users.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { IsParticipantGuard } from './guards/is-participant.guard';
import { IsPublicGuard } from './guards/is-public.guard';

@Module({
  imports: [AssociationsModule, UsersModule],
  providers: [EventsService, IsPublicGuard, IsParticipantGuard],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
