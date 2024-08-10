import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeAssociationsSeedService {
  constructor(
    @Inject('TYPE_ASSOCIATIONS_REPOSITORY')
    private readonly typeAssociationsRepository: Repository<TypeAssociations>,
    @Inject('DATA_SOURCE')
    private readonly datasource: DataSource,
  ) {}

  async seed() {
    console.log('Starting TypeAssociations seed...');

    const types = [
      { name: "Écologie", description: "Associations engagées pour la protection de l'environnement." },
      { name: "Droits sociaux", description: "Associations défendant les droits sociaux et l'égalité." },
      { name: "Santé", description: "Associations œuvrant pour l'accès à la santé pour tous." },
      { name: "Droits humains", description: "Associations promouvant et défendant les droits humains." }
    ];

    const typeEntities = types.map(type => {
      const typeEntity = new TypeAssociations();
      typeEntity.name = type.name;
      typeEntity.description = type.description;
      return typeEntity;
    });

    console.log('Seeding type associations...', typeEntities);
    await this.typeAssociationsRepository.save(typeEntities);
    console.log('Seeded type associations...');
  }

}