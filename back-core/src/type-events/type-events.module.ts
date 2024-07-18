import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeEventsService } from './type-events.service';
import { TypeEventsController } from './type-events.controller';
import { TypeEvents } from './entities/type-events.entity';

@Module({
  providers: [TypeEventsService],
  controllers: [TypeEventsController],
})
export class TypeEventsModule {}