import { Inject, Injectable, NotFoundException } from '@nestjs/common';
<<<<<<< HEAD
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeEvents } from './entities/type-events.entity';
import { CreateTypeEventDto } from './dto/create-type-event.dto';
import { UpdateTypeEventDto } from './dto/update-type-event.dto';
=======
import { Repository } from 'typeorm';
import { CreateTypeEventDto } from './dto/create-type-event.dto';
import { UpdateTypeEventDto } from './dto/update-type-event.dto';
import { TypeEvents } from './entities/type-events.entity';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

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
<<<<<<< HEAD
    const typeEvent = await this.typeEventsRepository.findOne({ where: { id } });
=======
    const typeEvent = await this.typeEventsRepository.findOne({
      where: { id },
    });
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
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

<<<<<<< HEAD
  async update(id: string, updateTypeEventDto: UpdateTypeEventDto): Promise<TypeEvents> {
=======
  async update(
    id: string,
    updateTypeEventDto: UpdateTypeEventDto,
  ): Promise<TypeEvents> {
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
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
