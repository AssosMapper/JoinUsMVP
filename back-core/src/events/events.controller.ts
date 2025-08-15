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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  GetFilteredEventsDto,
  getFilteredEventsSchema,
} from '@shared/dto/events.dto';
import { SaveLocalisationDto } from '@shared/dto/localisation.dto';
import { RoleEnum } from '@shared/types';
import { participateEventSchema } from '@shared/validations/event-participation.validation';
import {
  createEventSchema,
  updateEventSchema,
} from '@shared/validations/events.validation';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { CheckRole, CheckRoleGuard } from '../utils/guards/check-role.guard';
import {
  OptionalYupValidationPipe,
  YupValidationPipe,
} from '../utils/pipes/yup-validation.pipe';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { Event as EventEntity } from './entities/event.entity';
import { EventsService } from './events.service';
import { CanUpdateEventGuard } from './guards/can-update-event.guard';
import { IsParticipantGuard } from './guards/is-participant.guard';
import { IsPublicGuard } from './guards/is-public.guard';
import { saveLocalisationSchema } from '@shared/validations/localisation.validation';

@Controller('events')
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @CheckRole(RoleEnum.ASSOCIATION_MANAGER, RoleEnum.EVENTS_MANAGER)
  @UseGuards(CheckRoleGuard)
  @BearAuthToken()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @CurrentUserId() userId: string,
    @Body('event', new YupValidationPipe(createEventSchema))
    createEventDto: CreateEventDto,
    @Body('localisation', new OptionalYupValidationPipe(saveLocalisationSchema))
    localisationDto?: SaveLocalisationDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<EventDto> {
    const event = await this.eventsService.create(
      userId,
      createEventDto,
      localisationDto,
      file,
    );
    return plainToInstance(EventDto, event, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get('by-month')
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  @ApiQuery({ name: 'isValid', required: false, type: Boolean })
  @BearAuthToken()
  async getEventsByMonth(
    @Query(new YupValidationPipe(getEventsByMonthSchema))
    query: GetEventsByMonthDto,
    @CurrentUserId() userId: string,
  ): Promise<EventDto[]> {
    const { year, month, isValid, search, typeEventId } = query;
    const events = await this.eventsService.findEventsByMonth(
      year,
      month,
      isValid,
      search,
      typeEventId,
      userId,
    );
    return plainToInstance(EventDto, events, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get('filtered')
  @ApiQuery({ name: 'minDate', required: false, type: Date })
  @ApiQuery({ name: 'maxDate', required: false, type: Date })
  @ApiQuery({ name: 'isValid', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'typeEventId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortField', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, type: String })
  @BearAuthToken()
  async getFilteredEvents(
    @Query(new YupValidationPipe(getFilteredEventsSchema))
    query: GetFilteredEventsDto,
    @CurrentUserId() userId: string,
  ): Promise<{ events: EventDto[]; total: number; page: number; limit: number }> {
    const { minDate, maxDate, isValid, search, typeEventId, page, limit, sortField, sortOrder } = query;
    const result = await this.eventsService.findFilteredEvents(
      minDate,
      maxDate,
      isValid,
      search,
      typeEventId,
      userId,
      page,
      limit,
      sortField,
      sortOrder,
    );
    return {
      events: plainToInstance(EventDto, result.events, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      total: result.total,
      page,
      limit,
    };
  }

  @Get('association/:associationId')
  async getEventsByAssociation(
    @Param('associationId') associationId: string,
  ): Promise<EventEntity[]> {
    return this.eventsService.getEventsByAssociation(associationId);
  }

  /**
   * Récupérer tous les événements auxquels un utilisateur participe
   */
  @Get('participations')
  @BearAuthToken()
  async getUserParticipations(
    @CurrentUserId() userId: string,
  ): Promise<UserParticipationResponseDto[]> {
    const participations =
      await this.eventsService.getUserParticipations(userId);
    return plainToInstance(UserParticipationResponseDto, participations, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get(':id/participation')
  @BearAuthToken()
  async getUserParticipation(
    @Param('id') eventId: string,
    @CurrentUserId() userId: string,
  ): Promise<UserParticipationResponseDto> {
    const participation = await this.eventsService.getUserParticipation(
      eventId,
      userId,
    );

    return plainToInstance(UserParticipationResponseDto, participation, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  /**
   * Récupérer tous les participants d'un événement
   */
  @Get(':id/participants')
  @UseGuards(IsParticipantGuard)
  @BearAuthToken()
  async getEventParticipants(
    @Param('id') eventId: string,
  ): Promise<EventParticipantResponseDto[]> {
    const participants = await this.eventsService.getEventParticipants(eventId);
    return plainToInstance(EventParticipantResponseDto, participants, {
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

  @Put(':id')
  @UseGuards(CanUpdateEventGuard)
  @BearAuthToken()
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body('event', new YupValidationPipe(updateEventSchema))
    updateEventDto: UpdateEventDto,
    @Body('localisation', new OptionalYupValidationPipe(saveLocalisationSchema))
    localisationDto?: SaveLocalisationDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<EventDto> {
    const event = await this.eventsService.update(
      id,
      userId,
      updateEventDto,
      localisationDto,
      file,
    );
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
  ): Promise<UserParticipationResponseDto> {
    const participateEvent = await this.eventsService.participateEvent(
      userId,
      participateEventDto.eventId,
    );
    return plainToInstance(UserParticipationResponseDto, participateEvent, {
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
