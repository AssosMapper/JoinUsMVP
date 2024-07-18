import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeEvents } from './entities/type-events.entity';
import { CreateTypeEventDto } from './dto/create-type-event.dto';
import { UpdateTypeEventDto } from './dto/update-type-event.dto';

@Injectable()
export class TypeEventsService {
  constructor(
    @Inject('TYPEEVENTS_REPOSITORY')
    private readonly typeEventsRepository: Repository<TypeEvents>,
  ) {}

  findAll(): Promise<TypeEvents[]> {
    return this.typeEventsRepository.find();
  }

  async findOne(id: string): Promise<TypeEvents> {
    const typeEvent = await this.typeEventsRepository.findOne({ where: { id } });
    if (!typeEvent) {
      throw new NotFoundException(`TypeEvent with ID ${id} not found`);
    }
    return typeEvent;
  }

  create(createTypeEventDto: CreateTypeEventDto): Promise<TypeEvents> {
    const typeEvent = new TypeEvents();
    typeEvent.name = createTypeEventDto.name;
    typeEvent.description = createTypeEventDto.description;
    return this.typeEventsRepository.save(typeEvent);
  }

  async update(id: string, updateTypeEventDto: UpdateTypeEventDto): Promise<void> {
    const existingTypeEvent = await this.findOne(id);
    if (!existingTypeEvent) {
      throw new NotFoundException(`TypeEvent with ID ${id} not found`);
    }
    Object.assign(existingTypeEvent, updateTypeEventDto);
    await this.typeEventsRepository.save(existingTypeEvent);
  }

  async remove(id: string): Promise<void> {
    await this.typeEventsRepository.delete(id);
  }
}
