<<<<<<< HEAD
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query, DefaultValuePipe, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { FilterEventsDto } from './dto/filter-events.dto';
=======
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EventDto, GetEventsByMonthDto, getEventsByMonthSchema } from '@shared/dto/events.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { YupValidationPipe } from '../utils/pipes/yup-validation.pipe';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { EventsService } from './events.service';
import { Event as EventEntity } from './entities/event.entity';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

@Controller('events')
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

<<<<<<< HEAD
  @Get()
  @ApiQuery({ name: 'isValid', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('isValid') isValid?: boolean,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<{ data: Event[], total: number, page: number, limit: number }> {
    return this.eventsService.findAll(isValid, page, limit);
  }

  @Get('/by-association')
  @ApiQuery({ name: 'associationId', required: true })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  async findEventsByAssociationId(
    @Query('associationId') associationId: string,
    @Query('limit') limit: number
  ): Promise<{ pastEvents: Event[], todayEvents: Event[], upcomingEvents: Event[] }> {
    return this.eventsService.findEventsByAssociationId(associationId, limit);
  }

  @Get('/by-date')
  @ApiQuery({ name: 'date', required: true })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  async findEventsByDate(
    @Query('date') date: string,
    @Query('limit') limit: number
  ): Promise<{ pastEvents: Event[], todayEvents: Event[], upcomingEvents: Event[] }> {
    return this.eventsService.findEventsByDate(date, limit);
  }

  @Get('by-month')
  async getEventsByMonth(
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('isValid') isValid?: string,  
  ): Promise<{ data: Event[], total: number, page: number, limit: number }> {
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
  
    let isValidBoolean: boolean | undefined = undefined;
    if (isValid === 'true') {
      isValidBoolean = true;
    } else if (isValid === 'false') {
      isValidBoolean = false;
    }
  
    return this.eventsService.findEventsByMonth(yearNum, monthNum, page, limit, isValidBoolean);
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
=======
  @Post()
  @BearAuthToken()
  async create(
    @CurrentUserId() user: User,
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventDto> {
    const event = await this.eventsService.create(user, createEventDto);
    return plainToInstance(EventDto, event, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get('by-month')
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  @ApiQuery({ name: 'isValid', required: false, type: Boolean })
  async getEventsByMonth(
    @Query(new YupValidationPipe(getEventsByMonthSchema))
    query: GetEventsByMonthDto,
  ): Promise<EventDto[]> {
    const { year, month, isValid, search, typeEventId } = query;
    const events = await this.eventsService.findEventsByMonth(
      year,
      month,
      isValid,
      search,
      typeEventId,
    );
    return plainToInstance(EventDto, events, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get('association/:associationId')
  async getEventsByAssociation(
    @Param('associationId') associationId: string,
    @Query('limit') limit: number = 100
  ): Promise<EventEntity[]> {
    return this.eventsService.getEventsByAssociation(associationId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EventDto> {
    const event = await this.eventsService.findOne(id);
    return plainToInstance(EventDto, event, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }

  @Put(':id')
  @BearAuthToken()
<<<<<<< HEAD
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @BearAuthToken()
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
=======
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<EventDto> {
    const event = await this.eventsService.update(id, updateEventDto);
    return plainToInstance(EventDto, event, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
}
