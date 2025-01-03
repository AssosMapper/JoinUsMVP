import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
<<<<<<< HEAD
import { Event } from './entities/event.entity';
import { Association } from '../associations/entities/association.entity';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { User } from '../users/entities/user.entity';
import { TypeEvents } from '../type-events/entities/type-events.entity';
import { FilterEventsDto } from './dto/filter-events.dto';
=======
import { Association } from '../associations/entities/association.entity';
import { TypeEvents } from '../type-events/entities/type-events.entity';
import { User } from '../users/entities/user.entity';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { Event } from './entities/event.entity';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

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
<<<<<<< HEAD

  async findAll(isValid?: boolean, page: number = 1, limit: number = 10): Promise<{ data: Event[], total: number, page: number, limit: number }> {
    const query = this.eventsRepository.createQueryBuilder('event')
=======
  async findAll(
    isValid?: boolean,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Event[]; total: number; page: number; limit: number }> {
    const query = this.eventsRepository
      .createQueryBuilder('event')
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
      .leftJoinAndSelect('event.association', 'association')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.typeEvent', 'typeEvent');

    if (typeof isValid === 'boolean') {
      query.andWhere('event.isValid = :isValid', { isValid });
    }

<<<<<<< HEAD
    query.orderBy('event.date', 'ASC')
      .skip((page - 1) * limit)  
      .take(limit);  

    const [data, total] = await query.getManyAndCount();  

    return {
      data,  
      total,  
      page,   
      limit  
=======
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
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
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

<<<<<<< HEAD
  async findByUserId(userId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['association', 'user', 'typeEvent'],
=======
  async getEventsByUserId(userId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: {
        user: { id: userId }
      },
      relations: ['association', 'typeEvent'],
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    });
  }

  async create(user: User, createEventDto: CreateEventDto): Promise<Event> {
<<<<<<< HEAD
    const event = new Event();
    const association = await this.associationRepository.findOne({ where: { id: createEventDto.associationId } });
    if (!association) {
      throw new NotFoundException(`Association with ID ${createEventDto.associationId} not found`);
    }
    const typeEvent = await this.typeEventsRepository.findOne({ where: { id: createEventDto.typeEventId } });
    if (!typeEvent) {
      throw new NotFoundException(`TypeEvent with ID ${createEventDto.typeEventId} not found`);
    }
    event.titre = createEventDto.titre;
    event.description = createEventDto.description;
    event.image = createEventDto.image;
=======
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
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
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
<<<<<<< HEAD
      const association = await this.associationRepository.findOne({ where: { id: updateEventDto.associationId } });
      if (!association) {
        throw new NotFoundException(`Association with ID ${updateEventDto.associationId} not found`);
=======
      const association = await this.associationRepository.findOne({
        where: { id: updateEventDto.associationId },
      });
      if (!association) {
        throw new NotFoundException(
          `Association with ID ${updateEventDto.associationId} not found`,
        );
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
      }
      existingEvent.association = association;
    }
    if (updateEventDto.typeEventId) {
<<<<<<< HEAD
      const typeEvent = await this.typeEventsRepository.findOne({ where: { id: updateEventDto.typeEventId } });
      if (!typeEvent) {
        throw new NotFoundException(`TypeEvent with ID ${updateEventDto.typeEventId} not found`);
=======
      const typeEvent = await this.typeEventsRepository.findOne({
        where: { id: updateEventDto.typeEventId },
      });
      if (!typeEvent) {
        throw new NotFoundException(
          `TypeEvent with ID ${updateEventDto.typeEventId} not found`,
        );
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
      }
      existingEvent.typeEvent = typeEvent;
    }
    Object.assign(existingEvent, updateEventDto);
    return await this.eventsRepository.save(existingEvent);
  }

  async remove(id: string): Promise<void> {
    await this.eventsRepository.delete(id);
  }

<<<<<<< HEAD
  async findEventsByAssociationId(associationId: string, limit: number): Promise<{ pastEvents: Event[], todayEvents: Event[], upcomingEvents: Event[] }> {
=======
  async findEventsByAssociationId(
    associationId: string,
    limit: number,
  ): Promise<{
    pastEvents: Event[];
    todayEvents: Event[];
    upcomingEvents: Event[];
  }> {
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

<<<<<<< HEAD
    const events = await this.eventsRepository.createQueryBuilder('event')
=======
    const events = await this.eventsRepository
      .createQueryBuilder('event')
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
      .leftJoinAndSelect('event.association', 'association')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.typeEvent', 'typeEvent')
      .where('association.id = :associationId', { associationId })
<<<<<<< HEAD
      .andWhere('event.isValid = true')  // Only return valid events
      .orderBy('event.date', 'ASC')
      .getMany();

    const pastEvents = events.filter(event => event.date < today).slice(0, limit);
    const todayEvents = events.filter(event => event.date >= today && event.date <= endOfToday).slice(0, limit);
    const upcomingEvents = events.filter(event => event.date > endOfToday).slice(0, limit);
=======
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
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

    return { pastEvents, todayEvents, upcomingEvents };
  }

<<<<<<< HEAD
  async findEventsByDate(date: string, limit: number): Promise<{ pastEvents: Event[], todayEvents: Event[], upcomingEvents: Event[] }> {
=======
  async findEventsByDate(
    date: string,
    limit: number,
  ): Promise<{
    pastEvents: Event[];
    todayEvents: Event[];
    upcomingEvents: Event[];
  }> {
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const endOfTargetDate = new Date(date);
    endOfTargetDate.setHours(23, 59, 59, 999);

<<<<<<< HEAD
    const events = await this.eventsRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.association', 'association')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.typeEvent', 'typeEvent')
      .andWhere('event.isValid = true')  
      .orderBy('event.date', 'ASC')
      .getMany();

    const pastEvents = events.filter(event => event.date < targetDate).slice(0, limit);
    const todayEvents = events.filter(event => event.date >= targetDate && event.date <= endOfTargetDate).slice(0, limit);
    const upcomingEvents = events.filter(event => event.date > endOfTargetDate).slice(0, limit);
=======
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
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

    return { pastEvents, todayEvents, upcomingEvents };
  }

<<<<<<< HEAD
  async findEventsByMonth(year: number, month: number, page: number = 1, limit: number = 10, isValid?: boolean): Promise<{ data: Event[], total: number, page: number, limit: number }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const query = this.eventsRepository.createQueryBuilder('event')
        .leftJoinAndSelect('event.association', 'association')
        .leftJoinAndSelect('event.user', 'user')
        .leftJoinAndSelect('event.typeEvent', 'typeEvent')
        .where('event.date BETWEEN :startDate AND :endDate', { startDate, endDate })
        .orderBy('event.date', 'ASC')
        .skip((page - 1) * limit)  
        .take(limit);

    if (isValid !== undefined) {
        query.andWhere('event.isValid = :isValid', { isValid });
    }

    const [data, total] = await query.getManyAndCount();

    return {
        data,
        total,
        page,
        limit,
    };
}

=======
  async findEventsByMonth(
    year: number,
    month: number,
    isValid?: boolean,
    search?: string,
    typeEventId?: string,
  ): Promise<Event[]> {
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

    if (typeEventId) {
      query.andWhere('event.typeEvent.id = :typeEventId', { typeEventId });
    }

    query.orderBy('event.date', 'ASC').addOrderBy('event.titre', 'ASC');

    return query.getMany();
  }

  async getEventsByAssociation(associationId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { association: { id: associationId } },
      relations: ['association', 'typeEvent'],
    });
  }
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
}
