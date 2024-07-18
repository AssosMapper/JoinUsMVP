import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Association } from '../associations/entities/association.entity';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';
import { User } from '../users/entities/user.entity';
import { TypeEvents } from '../type-events/entities/type-events.entity';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EVENT_REPOSITORY')
    private eventsRepository: Repository<Event>,
    @Inject('ASSOCIATION_REPOSITORY')
    private associationRepository: Repository<Association>,
    @Inject('TYPEEVENTS_REPOSITORY')
    private typeEventsRepository: Repository<TypeEvents>,
  ) {}

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find({ relations: ['organisation', 'user', 'typeEvent'] });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organisation', 'user', 'typeEvent'],
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
      relations: ['organisation', 'user', 'typeEvent'],
    });
  }

  async create(user: User, createEventDto: CreateEventDto): Promise<Event> {
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
    event.date = createEventDto.date;
    event.localisation = createEventDto.localisation;
    event.association = association;
    event.user = user;
    event.typeEvent = typeEvent;
    event.isPublic = true;

    return this.eventsRepository.save(event);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<void> {
    const existingEvent = await this.findOne(id);
    if (!existingEvent)
      throw new NotFoundException(`Event with ID ${id} not found`);
    if (updateEventDto.associationId) {
      const association = await this.associationRepository.findOne({ where: { id: updateEventDto.associationId } });
      if (!association) {
        throw new NotFoundException(`Association with ID ${updateEventDto.associationId} not found`);
      }
      existingEvent.association = association;
    }
    if (updateEventDto.typeEventId) {
      const typeEvent = await this.typeEventsRepository.findOne({ where: { id: updateEventDto.typeEventId } });
      if (!typeEvent) {
        throw new NotFoundException(`TypeEvent with ID ${updateEventDto.typeEventId} not found`);
      }
      existingEvent.typeEvent = typeEvent;
    }
    Object.assign(existingEvent, updateEventDto);
    await this.eventsRepository.save(existingEvent);
  }

  async remove(id: string): Promise<void> {
    await this.eventsRepository.delete(id);
  }
}
