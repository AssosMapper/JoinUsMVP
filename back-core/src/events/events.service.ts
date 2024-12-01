import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Association } from '../associations/entities/association.entity';
import { TypeEvents } from '../type-events/entities/type-events.entity';
import { User } from '../users/entities/user.entity';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
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

  async findByUserId(userId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['association', 'user', 'typeEvent'],
    });
  }

  async create(user: User, createEventDto: CreateEventDto): Promise<Event> {
    const event = new Event();
    const association = await this.associationRepository.findOne({
      where: { id: createEventDto.associationId },
    });
    if (!association) {
      throw new NotFoundException(
        `Association with ID ${createEventDto.associationId} not found`,
      );
    }
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
    event.image = createEventDto.image;
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
    page: number = 1,
    limit: number = 10,
    isValid?: boolean,
    search?: string,
  ): Promise<{ data: Event[]; total: number; page: number; limit: number }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const query = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.association', 'association')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.typeEvent', 'typeEvent')
      .where('event.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (isValid !== undefined) {
      query.andWhere('event.isValid = :isValid', { isValid });
    }

    if (search) {
      query.andWhere('LOWER(event.titre) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    query
      .orderBy('event.date', 'ASC')
      .addOrderBy('event.titre', 'ASC')
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
}
