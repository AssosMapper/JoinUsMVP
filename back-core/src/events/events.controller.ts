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

@Controller('events')
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

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
  }

  @Put(':id')
  @BearAuthToken()
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<EventDto> {
    const event = await this.eventsService.update(id, updateEventDto);
    return plainToInstance(EventDto, event, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
