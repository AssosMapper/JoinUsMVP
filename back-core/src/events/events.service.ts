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
import { Repository } from 'typeorm';
import { Association } from '../associations/entities/association.entity';
import { TypeEvents } from '../type-events/entities/type-events.entity';
import { User } from '../users/entities/user.entity';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { EventParticipation } from './entities/event-participation.entity';
import { Event } from './entities/event.entity';

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
  ) {}
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
      relations: ['association', 'user', 'typeEvent'],
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

  async create(user: User, createEventDto: CreateEventDto): Promise<Event> {
    const associationId = user.associationId || createEventDto.associationId;

    const association = await this.associationRepository.findOne({
      where: { id: associationId },
    });

    if (!association) {
      throw new NotFoundException(`Association not found`);
    }

    const event = new Event();
    const typeEvent = await this.typeEventsRepository.findOne({
      where: { id: createEventDto.typeEventId },
    });
    if (!typeEvent) {
      throw new NotFoundException(
        `TypeEvent with ID ${createEventDto.typeEventId} not found`,
      );
    }
    event.titre = createEventDto.titre;
    event.description = createEventDto.description;
    //    event.image = createEventDto.image;
    event.date = createEventDto.date;
    event.localisation = createEventDto.localisation;
    event.association = association;
    event.user = user;
    event.typeEvent = typeEvent;
    event.isPublic = createEventDto.isPublic;
    event.isValid = createEventDto.isValid;

    return this.eventsRepository.save(event);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const existingEvent = await this.findOne(id);
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    if (updateEventDto.associationId) {
      const association = await this.associationRepository.findOne({
        where: { id: updateEventDto.associationId },
      });
      if (!association) {
        throw new NotFoundException(
          `Association with ID ${updateEventDto.associationId} not found`,
        );
      }
      existingEvent.association = association;
    }
    if (updateEventDto.typeEventId) {
      const typeEvent = await this.typeEventsRepository.findOne({
        where: { id: updateEventDto.typeEventId },
      });
      if (!typeEvent) {
        throw new NotFoundException(
          `TypeEvent with ID ${updateEventDto.typeEventId} not found`,
        );
      }
      existingEvent.typeEvent = typeEvent;
    }
    Object.assign(existingEvent, updateEventDto);
    return await this.eventsRepository.save(existingEvent);
  }

  async remove(id: string): Promise<void> {
    await this.eventsRepository.delete(id);
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

    const query = this.eventsRepository
      .createQueryBuilder('event')
      .distinct()
      .leftJoinAndSelect('event.association', 'association')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.typeEvent', 'typeEvent')
      .leftJoin('association.users', 'associationUser')
      .where('event.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (userId) {
      query.andWhere(
        '(event.isPublic = true OR associationUser.id = :userId)',
        {
          userId,
        },
      );
    } else query.andWhere('event.isPublic = true');

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
      relations: ['user'],
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
