import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { AssociationsModule } from '../associations/associations.module';

@Module({
  imports: [
    AssociationsModule, 
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
