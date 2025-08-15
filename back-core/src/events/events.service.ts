import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  EventParticipantResponseDto,
  UserParticipationResponseDto,
} from '@shared/dto/event-participation.dto';
import { SaveLocalisationDto } from '@shared/dto/localisation.dto';
import { RoleEnum } from '@shared/types';
import { checkRole } from '@src/utils/functions/check-role';
import { Repository } from 'typeorm';
import { Association } from '../associations/entities/association.entity';
import { Localisation } from '../localisation/entities/localisation.entity';
import { Media } from '../media/entities/media.entity';
import { EVENT_PICTURE_PATH } from '../media/enums/media.enum';
import { MediaService } from '../media/media.service';
import { TypeEvents } from '../type-events/entities/type-events.entity';
import { User } from '../users/entities/user.entity';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { EventParticipation } from './entities/event-participation.entity';
import { Event } from './entities/event.entity';
import { AssociationsService } from '@src/associations/associations.service';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EVENT_REPOSITORY')
    private eventsRepository: Repository<Event>,
    @Inject('ASSOCIATION_REPOSITORY')
    private associationRepository: Repository<Association>,
    @Inject('TYPE_EVENTS_REPOSITORY')
    private typeEventsRepository: Repository<TypeEvents>,
    @Inject('EVENT_PARTICIPATION_REPOSITORY')
    private eventParticipationRepository: Repository<EventParticipation>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('LOCALISATION_REPOSITORY')
    private localisationRepository: Repository<Localisation>,
    @Inject('MEDIA_REPOSITORY')
    private mediaRepository: Repository<Media>,
    private mediaService: MediaService,
    private associationsService: AssociationsService,
  ) {}

  /**
   * Méthode privée pour sauvegarder un événement avec gestion de la localisation
   */
  private async save(
    event: Event,
    localisationDto?: SaveLocalisationDto,
  ): Promise<Event> {
    if (localisationDto)
      event.localisation =
        await this.localisationRepository.save(localisationDto);

    return this.eventsRepository.save(event);
  }

  async findAll(
    isValid?: boolean,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Event[]; total: number; page: number; limit: number }> {
    const query = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.association', 'association')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.typeEvent', 'typeEvent');

    if (typeof isValid === 'boolean') {
      query.andWhere('event.isValid = :isValid', { isValid });
    }

    query
      .orderBy('event.date', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['association', 'user', 'typeEvent', 'localisation', 'image'],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['association', 'typeEvent'],
    });
  }
  async validEvent(
    userId: string,
    eventDto: CreateEventDto | UpdateEventDto,
  ): Promise<{ association: Association; typeEvent: TypeEvents; user: User }> {
    let association = null;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (eventDto.associationId) {
      association = await this.associationRepository.findOne({
        where: { id: eventDto.associationId },
      });
      if (!association)
        throw new NotFoundException(`L'association n'existe pas`);

      const isAdmin = checkRole(user, RoleEnum.SUPER_ADMIN);
      const isInAssociation = await this.associationsService.isInAssociation(
        user.id,
        association.id,
      );

      if (!isInAssociation && !isAdmin) {
        throw new NotFoundException(
          `L'utilisateur n'est pas dans L'association ${association?.name}`,
        );
      }
    }

    const typeEvent = await this.typeEventsRepository.findOne({
      where: { id: eventDto.typeEventId },
    });
    if (!typeEvent)
      throw new NotFoundException(`Le type d'événement n'existe pas`);

    return { association, typeEvent, user };
  }
  async create(
    userId: string,
    createEventDto: CreateEventDto,
    localisationDto?: SaveLocalisationDto,
    file?: Express.Multer.File,
  ): Promise<Event> {
    const { association, typeEvent, user } = await this.validEvent(
      userId,
      createEventDto,
    );
    let event = new Event();
    Object.assign(event, createEventDto);
    event.typeEvent = typeEvent;
    event.user = user;
    event.association = association ?? null;
    if (file) event = await this.updateEventImage(event, file);
    return this.save(event, localisationDto);
  }

  async update(
    id: string,
    userId: string,
    updateEventDto: UpdateEventDto,
    localisationDto?: SaveLocalisationDto,
    file?: Express.Multer.File,
  ): Promise<Event> {
    let existingEvent = await this.findOne(id);
    if (!existingEvent)
      throw new NotFoundException(`L'event n'a pas été trouvé`);

    const { association, typeEvent, user } = await this.validEvent(
      userId,
      updateEventDto,
    );

    const participants = await this.getEventParticipants(id);

    if (
      participants.length > 0 &&
      updateEventDto.associationId !== existingEvent.association?.id
    )
      throw new InternalServerErrorException(
        "Vous ne pouvez pas modifier l'association d'un événement qui a des participants",
      );

    Object.assign(existingEvent, updateEventDto);
    existingEvent.typeEvent = typeEvent;
    existingEvent.association = association ?? null;
    existingEvent.user = user;
    if (file) existingEvent = await this.updateEventImage(existingEvent, file);
    const savedEvent = await this.save(existingEvent, localisationDto);

    return savedEvent;
  }

  async updateEventImage(
    event: Event,
    file: Express.Multer.File,
  ): Promise<Event> {
    if (!event.image) {
      event.image = await this.mediaRepository.findOne({
        where: { id: event.image?.id ?? null },
      });
    }

    if (event.image) await this.mediaService.deleteFile(event.image.id);
    const media = await this.mediaService.save(file, {
      filepath: EVENT_PICTURE_PATH,
    });
    event.image = media;
    return await this.eventsRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    await this.eventsRepository.delete(id);
  }

  async findFilteredEvents(
    minDate?: Date,
    maxDate?: Date,
    isValid?: boolean,
    search?: string,
    typeEventId?: string,
    userId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ events: Event[]; total: number }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    const query = this.eventsRepository
      .createQueryBuilder('event')
      .distinct()
      .leftJoinAndSelect('event.association', 'association')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.typeEvent', 'typeEvent')
      .leftJoinAndSelect('event.localisation', 'localisation')
      .leftJoinAndSelect('event.image', 'image')
      .leftJoin('association.users', 'associationUser');

    if (minDate) {
      query.andWhere('event.date >= :minDate', { minDate });
    }
    if (maxDate) {
      query.andWhere('event.date <= :maxDate', { maxDate });
    }

    if (userId && !checkRole(user, RoleEnum.SUPER_ADMIN)) {
      query.andWhere(
        '(event.isPublic = true OR event.user.id = :userId OR associationUser.id = :userId)',
        { userId },
      );
    }

    if (isValid !== undefined) {
      query.andWhere('event.isValid = :isValid', { isValid });
    }

    if (search) {
      query.andWhere('LOWER(event.titre) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    if (typeEventId) {
      query.andWhere('event.typeEvent.id = :typeEventId', { typeEventId });
    }

    query.orderBy('event.date', 'DESC').addOrderBy('event.titre', 'ASC');

    const total = await query.getCount();
    const events = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { events, total };
  }

  async findEventsByAssociationId(
    associationId: string,
    limit: number,
  ): Promise<{
    pastEvents: Event[];
    todayEvents: Event[];
    upcomingEvents: Event[];
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const events = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.association', 'association')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.typeEvent', 'typeEvent')
      .where('association.id = :associationId', { associationId })
      .andWhere('event.isValid = true') // Only return valid events
      .orderBy('event.date', 'ASC')
      .getMany();

    const pastEvents = events
      .filter((event) => event.date < today)
      .slice(0, limit);
    const todayEvents = events
      .filter((event) => event.date >= today && event.date <= endOfToday)
      .slice(0, limit);
    const upcomingEvents = events
      .filter((event) => event.date > endOfToday)
      .slice(0, limit);

    return { pastEvents, todayEvents, upcomingEvents };
  }

  async findEventsByDate(
    date: string,
    limit: number,
  ): Promise<{
    pastEvents: Event[];
    todayEvents: Event[];
    upcomingEvents: Event[];
  }> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const endOfTargetDate = new Date(date);
    endOfTargetDate.setHours(23, 59, 59, 999);

    const events = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.association', 'association')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.typeEvent', 'typeEvent')
      .andWhere('event.isValid = true')
      .orderBy('event.date', 'ASC')
      .getMany();

    const pastEvents = events
      .filter((event) => event.date < targetDate)
      .slice(0, limit);
    const todayEvents = events
      .filter(
        (event) => event.date >= targetDate && event.date <= endOfTargetDate,
      )
      .slice(0, limit);
    const upcomingEvents = events
      .filter((event) => event.date > endOfTargetDate)
      .slice(0, limit);

    return { pastEvents, todayEvents, upcomingEvents };
  }

  async findEventsByMonth(
    year: number,
    month: number,
    isValid?: boolean,
    search?: string,
    typeEventId?: string,
    userId?: string,
  ): Promise<Event[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    const query = this.eventsRepository
      .createQueryBuilder('event')
      .distinct()
      .leftJoinAndSelect('event.association', 'association')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.typeEvent', 'typeEvent')
      .leftJoinAndSelect('event.localisation', 'localisation')
      .leftJoinAndSelect('event.image', 'image')
      .leftJoin('association.users', 'associationUser')
      .where('event.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (userId && !checkRole(user, RoleEnum.SUPER_ADMIN)) {
      query.andWhere(
        '(event.isPublic = true OR associationUser.id = :userId)',
        {
          userId,
        },
      );
    }

    if (isValid !== undefined)
      query.andWhere('event.isValid = :isValid', { isValid });

    if (search)
      query.andWhere('LOWER(event.titre) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });

    if (typeEventId)
      query.andWhere('event.typeEvent.id = :typeEventId', { typeEventId });

    query.orderBy('event.date', 'ASC').addOrderBy('event.titre', 'ASC');

    return query.getMany();
  }

  async getEventsByAssociation(associationId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { association: { id: associationId } },
      relations: ['association', 'typeEvent'],
    });
  }

  /**
   * Ajouter un utilisateur comme participant à un événement
   */
  async participateEvent(
    userId: string,
    eventId: string,
  ): Promise<EventParticipation> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
    });
    if (!event)
      throw new NotFoundException(`Événement avec l'ID ${eventId} non trouvé`);

    const oldParticipation = await this.eventParticipationRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
      },
    });
    if (oldParticipation) {
      throw new InternalServerErrorException(
        'Vous participez déjà à cet événement',
      );
    }

    //si la date de l'événement est dans le passé, on ne peut pas participer
    if (event.date < new Date()) {
      throw new InternalServerErrorException(
        'Vous ne pouvez pas participer à un événement passé',
      );
    }

    const participation = new EventParticipation();
    participation.user = user;
    participation.event = event;
    participation.registrationDate = new Date();

    return this.eventParticipationRepository.save(participation);
  }

  /**
   * Récupérer tous les participants d'un événement
   */
  async getEventParticipants(
    eventId: string,
  ): Promise<EventParticipantResponseDto[]> {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
    });
    if (!event)
      throw new NotFoundException(`Événement avec l'ID ${eventId} non trouvé`);

    const participations = await this.eventParticipationRepository.find({
      where: { event: { id: eventId } },
      relations: ['user.image'],
    });
    return participations.map((participation) => ({
      id: participation.id,
      eventId: eventId,
      registrationDate: participation.registrationDate,
      user: participation.user,
    }));
  }

  /**
   * Récupérer tous les événements auxquels un utilisateur participe
   */
  async getUserParticipations(
    userId: string,
  ): Promise<UserParticipationResponseDto[]> {
    const participations = await this.eventParticipationRepository.find({
      where: { user: { id: userId } },
      relations: ['event'],
    });

    return participations.map((participation) => ({
      id: participation.id,
      registrationDate: participation.registrationDate,
      event: participation.event,
    }));
  }

  async getUserParticipation(
    eventId: string,
    userId: string,
  ): Promise<EventParticipation | null> {
    const participation = await this.eventParticipationRepository.findOne({
      where: { event: { id: eventId }, user: { id: userId } },
      relations: ['event'],
    });
    if (!participation)
      throw new NotFoundException(
        `Participation non trouvée pour l'utilisateur ${userId} à l'événement ${eventId}`,
      );

    return participation;
  }

  /**
   * Annuler la participation d'un utilisateur à un événement
   */
  async cancelParticipation(userId: string, eventId: string): Promise<void> {
    const participation = await this.eventParticipationRepository.findOne({
      where: {
        user: { id: userId },
        event: { id: eventId },
      },
    });

    if (!participation)
      throw new NotFoundException(
        `Participation non trouvée pour l'utilisateur ${userId} à l'événement ${eventId}`,
      );

    await this.eventParticipationRepository.remove(participation);
  }
}
