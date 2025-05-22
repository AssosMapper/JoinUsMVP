import { Module } from '@nestjs/common';
import { AssociationsModule } from '../associations/associations.module';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../utils/database/database.module';
import { EventParticipation } from './entities/event-participation.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { IsParticipantGuard } from './guards/is-participant.guard';
import { IsPublicGuard } from './guards/is-public.guard';

@Module({
  imports: [
    DatabaseModule.forRoot([EventParticipation]),
    AssociationsModule,
    UsersModule,
  ],
  providers: [EventsService, IsPublicGuard, IsParticipantGuard],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
