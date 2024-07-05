import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeEvents } from './type-events.entity';
import { CreateTypeEventDto } from './dto/create-type-event.dto';
import { UpdateTypeEventDto } from './dto/update-type-event.dto';

@Injectable()
export class TypeEventsService {
  constructor(
    @InjectRepository(TypeEvents)
    private typeEventsRepository: Repository<TypeEvents>,
  ) {}

  findAll(): Promise<TypeEvents[]> {
    return this.typeEventsRepository.find();
  }

  async findOne(id: number): Promise<TypeEvents> {
    const typeEvent = await this.typeEventsRepository.findOne({ where: { id } });
    if (!typeEvent) {
      throw new NotFoundException(`TypeEvent with ID ${id} not found`);
    }
    return typeEvent;
  }

  create(createTypeEventDto: CreateTypeEventDto): Promise<TypeEvents> {
    const typeEvent = this.typeEventsRepository.create(createTypeEventDto);
    return this.typeEventsRepository.save(typeEvent);
  }

  async update(id: number, updateTypeEventDto: UpdateTypeEventDto): Promise<void> {
    const existingTypeEvent = await this.findOne(id);
    if (!existingTypeEvent) {
      throw new NotFoundException(`TypeEvent with ID ${id} not found`);
    }
    Object.assign(existingTypeEvent, updateTypeEventDto);
    await this.typeEventsRepository.save(existingTypeEvent);
  }

  async remove(id: number): Promise<void> {
    await this.typeEventsRepository.delete(id);
  }
}
