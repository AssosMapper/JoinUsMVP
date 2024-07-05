import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeEventsService } from './type-events.service';
import { TypeEventsController } from './type-events.controller';
import { TypeEvents } from './type-events.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeEvents])],
  providers: [TypeEventsService],
  controllers: [TypeEventsController],
})
export class TypeEventsModule {}