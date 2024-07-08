import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Association } from './association.entity';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { User } from '../users/user.entity';
import { TypeAssociations } from '../type-associations/type-associations.entity';

@Injectable()
export class AssociationsService {
  constructor(
    @InjectRepository(Association)
    private associationsRepository: Repository<Association>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(TypeAssociations)
    private typeAssociationsRepository: Repository<TypeAssociations>,
  ) {}

  findAll(): Promise<Association[]> {
    return this.associationsRepository.find({ relations: ['users', 'types'] });
  }

  async findOne(id: number): Promise<Association> {
    const association = await this.associationsRepository.findOne({ where: { id }, relations: ['users', 'types'] });
    if (!association) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }
    return association;
  }

  async create(createAssociationDto: CreateAssociationDto): Promise<Association> {
    const user = await this.usersRepository.findOne({ where: { id: createAssociationDto.userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${createAssociationDto.userId} not found`);
    }

    const types = createAssociationDto.typeIds?.length 
      ? await this.typeAssociationsRepository.findByIds(createAssociationDto.typeIds) 
      : [];

    const association = this.associationsRepository.create({ ...createAssociationDto, users: [user], types });
    return this.associationsRepository.save(association);
  }

  async update(id: number, updateAssociationDto: UpdateAssociationDto): Promise<void> {
    const existingAssociation = await this.findOne(id);
    if (!existingAssociation) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }
    if (updateAssociationDto.userId) {
      const user = await this.usersRepository.findOne({ where: { id: updateAssociationDto.userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${updateAssociationDto.userId} not found`);
      }
      existingAssociation.users = [user];
    }
    if (updateAssociationDto.typeIds?.length) {
      const types = await this.typeAssociationsRepository.findByIds(updateAssociationDto.typeIds);
      existingAssociation.types = types;
    }
    Object.assign(existingAssociation, updateAssociationDto);
    await this.associationsRepository.save(existingAssociation);
  }

  async remove(id: number): Promise<void> {
    await this.associationsRepository.delete(id);
  }
}
