import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeAssociations } from './type-associations.entity';
import { CreateTypeAssociationDto } from './dto/create-type-association.dto';
import { UpdateTypeAssociationDto } from './dto/update-type-association.dto';

@Injectable()
export class TypeAssociationsService {
  constructor(
    @InjectRepository(TypeAssociations)
    private typeAssociationsRepository: Repository<TypeAssociations>,
  ) {}

  create(createTypeAssociationDto: CreateTypeAssociationDto) {
    const newTypeAssociation = this.typeAssociationsRepository.create(createTypeAssociationDto);
    return this.typeAssociationsRepository.save(newTypeAssociation);
  }

  findAll() {
    return this.typeAssociationsRepository.find({ relations: ['associations'] });
  }

  findOne(id: number) {
    return this.typeAssociationsRepository.findOne({ where: { id }, relations: ['associations'] });
  }

  async update(id: number, updateTypeAssociationDto: UpdateTypeAssociationDto) {
    await this.typeAssociationsRepository.update(id, updateTypeAssociationDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.typeAssociationsRepository.delete(id);
    return { deleted: true };
  }
}
