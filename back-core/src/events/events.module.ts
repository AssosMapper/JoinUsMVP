import { Module } from '@nestjs/common';
import { AssociationsModule } from '../associations/associations.module';
import { MediaModule } from '../media/media.module';
import { UsersModule } from '../users/users.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CanUpdateEventGuard } from './guards/can-update-event.guard';
import { IsParticipantGuard } from './guards/is-participant.guard';
import { IsPublicGuard } from './guards/is-public.guard';

@Module({
  imports: [AssociationsModule, UsersModule, MediaModule],
  providers: [
    EventsService,
    IsPublicGuard,
    IsParticipantGuard,
    CanUpdateEventGuard,
  ],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
