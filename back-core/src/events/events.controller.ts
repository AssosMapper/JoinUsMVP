import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';

@Controller('events')
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @Get('/user/:userId')
  findEventsByUser(@Param('userId') userId: string): Promise<Event[]> {
    return this.eventsService.findByUserId(userId);
  }

  @Post()
  @BearAuthToken()
  create(@CurrentUserId() user:User,@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(user,createEventDto);
  }

  @Put(':id')
  @BearAuthToken()
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @BearAuthToken()
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}