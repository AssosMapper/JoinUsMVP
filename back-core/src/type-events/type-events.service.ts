import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTypeEventDto } from './dto/create-type-event.dto';
import { UpdateTypeEventDto } from './dto/update-type-event.dto';
import { TypeEvents } from './entities/type-events.entity';

@Injectable()
export class TypeEventsService {
  constructor(
    @Inject('TYPE_EVENTS_REPOSITORY')
    private readonly typeEventsRepository: Repository<TypeEvents>,
  ) {}

  findAll(): Promise<TypeEvents[]> {
    return this.typeEventsRepository.find();
  }

  async findOne(id: string): Promise<TypeEvents> {
    const typeEvent = await this.typeEventsRepository.findOne({
      where: { id },
    });
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

  async update(
    id: string,
    updateTypeEventDto: UpdateTypeEventDto,
  ): Promise<TypeEvents> {
    const existingTypeEvent = await this.findOne(id);
    if (!existingTypeEvent) {
      throw new NotFoundException(`TypeEvent with ID ${id} not found`);
    }
    Object.assign(existingTypeEvent, updateTypeEventDto);
    return await this.typeEventsRepository.save(existingTypeEvent);
  }

  async remove(id: string): Promise<void> {
    await this.typeEventsRepository.delete(id);
  }
}
