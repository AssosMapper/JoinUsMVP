import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  EventParticipantResponseDto,
  ParticipateEventDto,
  UserParticipationResponseDto,
} from '@shared/dto/event-participation.dto';
import {
  EventDto,
  GetEventsByMonthDto,
  getEventsByMonthSchema,
} from '@shared/dto/events.dto';
import { participateEventSchema } from '@shared/validations/event-participation.validation';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { YupValidationPipe } from '../utils/pipes/yup-validation.pipe';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { Event as EventEntity } from './entities/event.entity';
import { EventsService } from './events.service';
import { IsPublicGuard } from './guards/is-public.guard';

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
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventDto> {
    const event = await this.eventsService.update(id, updateEventDto);
    return plainToInstance(EventDto, event, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  /**
   * Participer à un événement
   */
  @Post('participate')
  @UseGuards(IsPublicGuard)
  @BearAuthToken()
  async participateEvent(
    @CurrentUserId() userId: string,
    @Body(new YupValidationPipe(participateEventSchema))
    participateEventDto: ParticipateEventDto,
  ) {
    const participateEvent = await this.eventsService.participateEvent(
      userId,
      participateEventDto.eventId,
    );
    return participateEvent;
  }

  /**
   * Récupérer tous les participants d'un événement
   */
  @Get(':id/participants')
  @BearAuthToken()
  async getEventParticipants(@Param('id') eventId: string) {
    const participants = await this.eventsService.getEventParticipants(eventId);
    return plainToInstance(EventParticipantResponseDto, participants, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  /**
   * Récupérer tous les événements auxquels un utilisateur participe
   */
  @Get('participations')
  @BearAuthToken()
  async getUserParticipations(@CurrentUserId() userId: string) {
    const participations =
      await this.eventsService.getUserParticipations(userId);
    return plainToInstance(UserParticipationResponseDto, participations, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  /**
   * Annuler la participation d'un utilisateur à un événement
   */
  @Delete('participate/:id')
  @BearAuthToken()
  async cancelParticipation(
    @CurrentUserId() userId: string,
    @Param('id') eventId: string,
    @Res() res: Response,
  ) {
    await this.eventsService.cancelParticipation(userId, eventId);
    res.status(HttpStatus.OK).send();
  }
}
