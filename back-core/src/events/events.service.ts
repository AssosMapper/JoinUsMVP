import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find({ relations: ['organisation', 'user', 'typeEvent'] });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organisation', 'user', 'typeEvent'],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async findByUserId(userId: number): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { user_id: userId },
      relations: ['organisation', 'user', 'typeEvent'],
    });
  }

  create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create(createEventDto);
    return this.eventsRepository.save(event);
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<void> {
    const existingEvent = await this.findOne(id);
    Object.assign(existingEvent, updateEventDto);
    await this.eventsRepository.save(existingEvent);
  }

  async remove(id: number): Promise<void> {
    await this.eventsRepository.delete(id);
  }
}
