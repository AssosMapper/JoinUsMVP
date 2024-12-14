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
import {
  EventDto,
  GetEventsByMonthDto,
  getEventsByMonthSchema,
} from '@shared/dto/events.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { YupValidationPipe } from '../utils/pipes/yup-validation.pipe';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';

@Controller('events')
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiQuery({ name: 'isValid', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('isValid') isValid?: boolean,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<{ data: EventDto[]; total: number; page: number; limit: number }> {
    const events = await this.eventsService.findAll(isValid, page, limit);
    return {
      data: plainToInstance(EventDto, events.data),
      total: events.total,
      page: events.page,
      limit: events.limit,
    };
  }

  @Get('/by-association')
  @ApiQuery({ name: 'associationId', required: true })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  async findEventsByAssociationId(
    @Query('associationId') associationId: string,
    @Query('limit') limit: number,
  ): Promise<{
    pastEvents: EventDto[];
    todayEvents: EventDto[];
    upcomingEvents: EventDto[];
  }> {
    const events = await this.eventsService.findEventsByAssociationId(
      associationId,
      limit,
    );
    return {
      pastEvents: plainToInstance(EventDto, events.pastEvents, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      todayEvents: plainToInstance(EventDto, events.todayEvents, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      upcomingEvents: plainToInstance(EventDto, events.upcomingEvents, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }

  @Get('/by-date')
  @ApiQuery({ name: 'date', required: true })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  async findEventsByDate(
    @Query('date') date: string,
    @Query('limit') limit: number,
  ): Promise<{
    pastEvents: Event[];
    todayEvents: Event[];
    upcomingEvents: Event[];
  }> {
    return this.eventsService.findEventsByDate(date, limit);
  }

  @Get('by-month')
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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EventDto> {
    const event = await this.eventsService.findOne(id);
    return plainToInstance(EventDto, event, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get('/user/:userId')
  async findEventsByUser(@Param('userId') userId: string): Promise<EventDto[]> {
    const events = await this.eventsService.findByUserId(userId);
    return plainToInstance(EventDto, events, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Post()
  @BearAuthToken()
  async create(
    @CurrentUserId() user: User,
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventDto | null> {
    const event = await this.eventsService.create(user, createEventDto);
    return plainToInstance(EventDto, event, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Put(':id')
  @BearAuthToken()
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventDto | null> {
    const event = await this.eventsService.update(id, updateEventDto);
    return plainToInstance(EventDto, event, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id')
  @BearAuthToken()
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
