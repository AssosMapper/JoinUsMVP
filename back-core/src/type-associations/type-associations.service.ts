import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeAssociations } from './entities/type-associations.entity';
import { CreateTypeAssociationDto } from './dto/create-type-association.dto';
import { UpdateTypeAssociationDto } from './dto/update-type-association.dto';

@Injectable()
export class TypeAssociationsService {
  constructor(
    @Inject('TYPEASSOCIATIONS_REPOSITORY')
    private typeAssociationsRepository: Repository<TypeAssociations>,
  ) {}

  create(createTypeAssociationDto: CreateTypeAssociationDto) {
    const newTypeAssociation = new TypeAssociations();
    newTypeAssociation.name = createTypeAssociationDto.name;
    newTypeAssociation.description = createTypeAssociationDto.description;
    return this.typeAssociationsRepository.save(newTypeAssociation);
  }

  findAll() {
    return this.typeAssociationsRepository.find({ relations: ['associations'] });
  }

  findOne(id: string) {
    return this.typeAssociationsRepository.findOne({ where: { id }, relations: ['associations'] });
  }

  async update(id: string, updateTypeAssociationDto: UpdateTypeAssociationDto) {
    await this.typeAssociationsRepository.update(id, updateTypeAssociationDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.typeAssociationsRepository.delete(id);
    return { deleted: true };
  }
}
