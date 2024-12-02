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
  GetEventsByMonthDto,
  getEventsByMonthSchema,
} from '@shared/dto/events.dto';
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
  ): Promise<{ data: Event[]; total: number; page: number; limit: number }> {
    return this.eventsService.findAll(isValid, page, limit);
  }

  @Get('/by-association')
  @ApiQuery({ name: 'associationId', required: true })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  async findEventsByAssociationId(
    @Query('associationId') associationId: string,
    @Query('limit') limit: number,
  ): Promise<{
    pastEvents: Event[];
    todayEvents: Event[];
    upcomingEvents: Event[];
  }> {
    return this.eventsService.findEventsByAssociationId(associationId, limit);
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
  ): Promise<Event[]> {
    const { year, month, isValid, search, typeEventId } = query;
    return this.eventsService.findEventsByMonth(
      year,
      month,
      isValid,
      search,
      typeEventId,
    );
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
  create(
    @CurrentUserId() user: User,
    @Body() createEventDto: CreateEventDto,
  ): Promise<Event> {
    return this.eventsService.create(user, createEventDto);
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
