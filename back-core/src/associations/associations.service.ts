import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Association } from './entities/association.entity';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { User } from '../users/entities/user.entity';
import { TypeAssociations } from '../type-associations/entities/type-associations.entity';

@Injectable()
export class AssociationsService {
  constructor(
    @Inject('ASSOCIATION_REPOSITORY')
    private associationsRepository: Repository<Association>,
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<User>,
    @Inject('TYPEASSOCIATIONS_REPOSITORY')
    private typeAssociationsRepository: Repository<TypeAssociations>,
  ) {}

  findAll(): Promise<Association[]> {
    return this.associationsRepository.find({ relations: ['users', 'types'] });
  }

  async findOne(id: string): Promise<Association> {
    const association = await this.associationsRepository.findOne({ where: { id }, relations: ['users', 'types'] });
    if (!association) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }
    return association;
  }

  async create(user: User,createAssociationDto: CreateAssociationDto): Promise<Association> {
    const types = await this.typeAssociationsRepository.findBy({ id: In(createAssociationDto.typeIds) });

    const association = new Association();
    association.name = createAssociationDto.name;
    association.description = createAssociationDto.description;
    association.image = createAssociationDto.image;
    association.localisation = createAssociationDto.localisation;
    association.users = [user];
    association.types = types;
    association.members = createAssociationDto.members;
    return this.associationsRepository.save(association);
  }

  async update(id: string, updateAssociationDto: UpdateAssociationDto): Promise<Association> {
    const existingAssociation = await this.findOne(id);
    if (!existingAssociation) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }
  
    if (Array.isArray(updateAssociationDto.typeIds)) {
      existingAssociation.types = await this.typeAssociationsRepository.findBy({ id: In(updateAssociationDto.typeIds) });
    }
  
    Object.assign(existingAssociation, updateAssociationDto);
    return await this.associationsRepository.save(existingAssociation);
  }

  async remove(id: string): Promise<void> {
    await this.associationsRepository.delete(id);
  }
}
